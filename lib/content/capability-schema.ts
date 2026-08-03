import { z } from "zod";

import { contentDateSchema, safeSlugSchema } from "./schema";

const branchSchema = z.string().trim().min(1).max(40);

export const CAPABILITY_STATUS_LABELS = {
  exploring: "正在了解",
  learning: "做过练习",
  practiced: "做过完整实践",
  independent: "能独立承担",
} as const;

export const capabilityStatusSchema = z.enum([
  "exploring",
  "learning",
  "practiced",
  "independent",
]);

export const capabilityMetadataSchema = z
  .object({
    slug: safeSlugSchema.optional(),
    title: z.string().trim().min(1).max(120),
    summary: z.string().trim().min(1).max(240),
    status: capabilityStatusSchema,
    updatedAt: contentDateSchema,
    order: z.number().int().min(1).max(999),
    featured: z.boolean().default(false),
    branches: z
      .array(branchSchema)
      .min(1)
      .max(8)
      .refine(
        (branches) =>
          new Set(branches.map((branch) => branch.toLocaleLowerCase())).size ===
          branches.length,
        "branches 不能重复",
      ),
  })
  .strict();

export type CapabilityMetadata = z.infer<typeof capabilityMetadataSchema>;
export type CapabilityStatus = z.infer<typeof capabilityStatusSchema>;
