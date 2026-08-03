import {
  ContentValidationError,
  assertSafeContentSlug,
  readContentDirectory,
  type LoadedContent,
} from "./load";
import {
  capabilityMetadataSchema,
  type CapabilityMetadata,
} from "./capability-schema";

export type LoadedCapability = LoadedContent<Omit<CapabilityMetadata, "slug">>;

type CapabilityLoaderOptions = {
  featuredOnly?: boolean;
};

const REQUIRED_SECTIONS = ["我的理解", "做过的事", "边界与失败", "下一步"] as const;

function assertRequiredSections(capability: LoadedCapability) {
  const headings = new Set(
    Array.from(capability.content.matchAll(/^##\s+(.+?)\s*$/gm), (match) => match[1]),
  );
  const missing = REQUIRED_SECTIONS.filter((section) => !headings.has(section));

  if (missing.length > 0) {
    throw new ContentValidationError(
      `Invalid capability content in ${capability.sourcePath}: missing section ${missing.join(
        ", ",
      )}`,
    );
  }
}

export async function loadCapabilities(options: CapabilityLoaderOptions = {}) {
  const capabilities = await readContentDirectory(
    "capabilities",
    ".mdx",
    capabilityMetadataSchema,
  );

  for (const capability of capabilities) {
    assertRequiredSections(capability);
  }

  return capabilities
    .filter((capability) => !options.featuredOnly || capability.metadata.featured)
    .sort(
      (left, right) =>
        left.metadata.order - right.metadata.order ||
        left.slug.localeCompare(right.slug, "en"),
    );
}

export async function getCapabilityBySlug(slug: string) {
  const safeSlug = assertSafeContentSlug(slug);
  const capabilities = await loadCapabilities();
  return capabilities.find((capability) => capability.slug === safeSlug);
}
