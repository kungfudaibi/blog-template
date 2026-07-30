import { z } from "zod";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const safeSlugSchema = z
  .string()
  .trim()
  .min(1, "slug 不能为空")
  .max(100, "slug 不能超过 100 个字符")
  .regex(SLUG_PATTERN, "slug 只能包含小写字母、数字和单个连字符");

const contentTitleSchema = z.string().trim().min(1).max(120);
const summarySchema = z.string().trim().min(1).max(240);
const tagSchema = z.string().trim().min(1).max(30);
const tagListSchema = z
  .array(tagSchema)
  .min(1)
  .max(12)
  .refine(
    (tags) => new Set(tags.map((tag) => tag.toLocaleLowerCase())).size === tags.length,
    "tags 不能重复",
  );

const localPathSchema = z
  .string()
  .trim()
  .startsWith("/", "路径必须从 / 开始")
  .refine((value) => !value.startsWith("//"), "路径不能是协议相对地址")
  .refine(
    (value) => !value.split("/").some((segment) => segment === ".."),
    "路径不能包含目录穿越片段",
  );

const publishedDateSchema = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z
    .string()
    .regex(DATE_PATTERN, "日期必须使用 YYYY-MM-DD")
    .refine((value) => {
      const parsed = new Date(`${value}T00:00:00Z`);

      return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
    }, "日期无效"),
);

const httpsUrlSchema = z
  .url()
  .refine((value) => new URL(value).protocol === "https:", "外部链接必须使用 HTTPS");

const optionalSlug = { slug: safeSlugSchema.optional() };

export const postMetadataSchema = z
  .object({
    ...optionalSlug,
    title: contentTitleSchema,
    summary: summarySchema,
    publishedAt: publishedDateSchema,
    tags: tagListSchema,
    cover: localPathSchema,
    draft: z.boolean().default(false),
  })
  .strict();

export const projectMetadataSchema = z
  .object({
    ...optionalSlug,
    title: contentTitleSchema,
    summary: summarySchema,
    period: z.preprocess(
      (value) => (typeof value === "number" ? String(value) : value),
      z.string().trim().min(1).max(40),
    ),
    role: z.string().trim().min(1).max(120),
    tech: tagListSchema,
    cover: localPathSchema,
    featured: z.boolean().default(false),
    links: z
      .object({
        demo: httpsUrlSchema.optional(),
        source: httpsUrlSchema.optional(),
      })
      .strict()
      .refine((links) => Boolean(links.demo || links.source), "至少提供一个作品链接"),
  })
  .strict();

export const profileMetadataSchema = z
  .object({
    ...optionalSlug,
    title: contentTitleSchema,
    visibility: z.enum(["public", "private"]),
    relatedPath: localPathSchema.optional(),
  })
  .strict();

export type PostMetadata = z.infer<typeof postMetadataSchema>;
export type ProjectMetadata = z.infer<typeof projectMetadataSchema>;
export type ProfileMetadata = z.infer<typeof profileMetadataSchema>;
