import { z } from "zod";

import { safeSlugSchema } from "./schema";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const updatedDateSchema = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z
    .string()
    .regex(DATE_PATTERN, "日期必须使用 YYYY-MM-DD")
    .refine((value) => {
      const parsed = new Date(`${value}T00:00:00Z`);
      return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
    }, "日期无效"),
);

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
    updatedAt: updatedDateSchema,
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
