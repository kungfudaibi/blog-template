import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { CORE_SCHEMA, load as loadYaml } from "js-yaml";
import type { z } from "zod";

import {
  postMetadataSchema,
  profileMetadataSchema,
  projectMetadataSchema,
  safeSlugSchema,
  type PostMetadata,
  type ProfileMetadata,
  type ProjectMetadata,
} from "./schema";

export class ContentValidationError extends Error {
  override readonly name = "ContentValidationError";
}

export class ContentSecurityError extends Error {
  override readonly name = "ContentSecurityError";
}

export type LoadedContent<Metadata> = {
  slug: string;
  metadata: Metadata;
  content: string;
  sourcePath: string;
};

export type LoadedPost = LoadedContent<Omit<PostMetadata, "slug">>;
export type LoadedProject = LoadedContent<Omit<ProjectMetadata, "slug">>;
export type LoadedProfile = LoadedContent<Omit<ProfileMetadata, "slug">>;

type LoaderOptions = {
  contentRoot?: string;
};

type PostLoaderOptions = LoaderOptions & {
  includeDrafts?: boolean;
};

type ProfileLoaderOptions = LoaderOptions & {
  includePrivate?: boolean;
};

type ContentDirectory = "posts" | "profile" | "projects";

type SchemaWithSlug<Metadata> = z.ZodType<Metadata & { slug?: string }>;

// CORE_SCHEMA keeps dates as strings; timestamp construction belongs to YAML11_SCHEMA.
// Source: https://github.com/nodeca/js-yaml#load-string---options-
function yamlEngine(source: string): object {
  const parsed = loadYaml(source, {
    schema: CORE_SCHEMA,
    maxAliases: 0,
    maxDepth: 20,
  });

  return typeof parsed === "object" && parsed !== null
    ? parsed
    : { invalidFrontmatterValue: parsed };
}

function getContentRoot(contentRoot?: string) {
  return path.resolve(contentRoot ?? path.join(process.cwd(), "content"));
}

function toSourcePath(directory: ContentDirectory, filename: string) {
  return `${directory}/${filename}`;
}

function formatValidationError(
  sourcePath: string,
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>,
) {
  const details = issues
    .map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
    .join("; ");

  return new ContentValidationError(`Invalid content metadata in ${sourcePath}: ${details}`);
}

function assertSafeSlug(slug: string) {
  const result = safeSlugSchema.safeParse(slug);

  if (!result.success) {
    throw new ContentSecurityError("Invalid content slug");
  }

  return result.data;
}

async function readDirectory<Metadata>(
  directory: ContentDirectory,
  extension: ".md" | ".mdx",
  schema: SchemaWithSlug<Metadata>,
  options: LoaderOptions,
): Promise<Array<LoadedContent<Metadata>>> {
  const contentRoot = getContentRoot(options.contentRoot);
  const directoryPath = path.join(contentRoot, directory);
  let entries;

  try {
    entries = await readdir(directoryPath, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .sort((left, right) => left.name.localeCompare(right.name, "en"));
  const loaded: Array<LoadedContent<Metadata>> = [];
  const slugSources = new Map<string, string>();

  for (const file of files) {
    const sourcePath = toSourcePath(directory, file.name);
    const raw = await readFile(path.join(directoryPath, file.name), "utf8");
    const parsed = (() => {
      try {
        return matter(raw, { engines: { yaml: yamlEngine } });
      } catch {
        throw new ContentValidationError(`Invalid content syntax in ${sourcePath}`);
      }
    })();
    const validation = schema.safeParse(parsed.data);

    if (!validation.success) {
      throw formatValidationError(sourcePath, validation.error.issues);
    }

    const { slug: explicitSlug, ...metadata } = validation.data;
    const slug = assertSafeSlug(explicitSlug ?? path.basename(file.name, extension));
    const previousSource = slugSources.get(slug);

    if (previousSource) {
      throw new ContentValidationError(
        `Duplicate slug "${slug}" in ${previousSource} and ${sourcePath}`,
      );
    }

    slugSources.set(slug, sourcePath);
    loaded.push({
      slug,
      metadata: metadata as Metadata,
      content: parsed.content.trim(),
      sourcePath,
    });
  }

  return loaded;
}

export async function loadPosts(options: PostLoaderOptions = {}) {
  const includeDrafts = options.includeDrafts ?? process.env.NODE_ENV !== "production";
  const posts = await readDirectory("posts", ".mdx", postMetadataSchema, options);

  return posts
    .filter((post) => includeDrafts || !post.metadata.draft)
    .sort(
      (left, right) =>
        right.metadata.publishedAt.localeCompare(left.metadata.publishedAt) ||
        left.slug.localeCompare(right.slug, "en"),
    );
}

export async function getPostBySlug(slug: string, options: PostLoaderOptions = {}) {
  const safeSlug = assertSafeSlug(slug);
  const posts = await loadPosts(options);
  return posts.find((post) => post.slug === safeSlug);
}

export async function loadProjects(options: LoaderOptions = {}) {
  const projects = await readDirectory(
    "projects",
    ".mdx",
    projectMetadataSchema,
    options,
  );

  return projects.sort(
    (left, right) =>
      Number(right.metadata.featured) - Number(left.metadata.featured) ||
      right.metadata.period.localeCompare(left.metadata.period, "zh-CN") ||
      left.metadata.title.localeCompare(right.metadata.title, "zh-CN"),
  );
}

export async function getProjectBySlug(slug: string, options: LoaderOptions = {}) {
  const safeSlug = assertSafeSlug(slug);
  const projects = await loadProjects(options);
  return projects.find((project) => project.slug === safeSlug);
}

export async function loadProfiles(options: ProfileLoaderOptions = {}) {
  const profiles = await readDirectory(
    "profile",
    ".md",
    profileMetadataSchema,
    options,
  );

  return profiles
    .filter((profile) => options.includePrivate || profile.metadata.visibility === "public")
    .sort((left, right) => left.slug.localeCompare(right.slug, "en"));
}

export async function getProfileBySlug(slug: string, options: ProfileLoaderOptions = {}) {
  const safeSlug = assertSafeSlug(slug);
  const profiles = await loadProfiles(options);
  return profiles.find((profile) => profile.slug === safeSlug);
}
