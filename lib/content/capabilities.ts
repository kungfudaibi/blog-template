import {
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

export async function loadCapabilities(options: CapabilityLoaderOptions = {}) {
  const capabilities = await readContentDirectory(
    "capabilities",
    ".mdx",
    capabilityMetadataSchema,
  );

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
