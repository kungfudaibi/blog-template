# 内容维护指南

页面内容来自 `content/`，保存后会在开发环境更新，并在构建时接受严格校验。不要把密钥、住址、证件、私人联系方式、客户秘密或未获授权的第三方资料写入仓库；`visibility: private` 不是秘密存储机制。

## 通用规则

- 文件名或显式 `slug` 只使用小写字母、数字和单个连字符，例如 `my-first-post`。
- 同一内容类型的 slug 不得重复。
- 日期使用真实的 `YYYY-MM-DD` 日历日期。
- 外部链接只允许 `https://`。
- 本地资源路径必须以 `/` 开头，不能包含 `..`。
- 正文支持 Markdown 和 GFM；MDX JavaScript 表达式被禁用。
- 保留“示例”或“待填写”标签，直到内容已由站主核实。

## 文章

在 `content/posts/` 新建 `.mdx`：

```mdx
---
title: "文章标题"
summary: "不超过 240 字的列表与分享摘要。"
publishedAt: 2026-08-01
tags: [TypeScript, 工程实践]
cover: /images/posts/article-slug.webp
draft: true
---

正文从这里开始。
```

字段要求：

| 字段 | 要求 |
|---|---|
| `title` | 1–120 字 |
| `summary` | 1–240 字 |
| `publishedAt` | `YYYY-MM-DD` |
| `tags` | 1–12 个不重复标签，每个最多 30 字 |
| `cover` | `public/` 下对应资源的站点路径 |
| `draft` | `true` 不进入公开页面、RSS 或 sitemap；发布时改为 `false` |

## 作品

在 `content/projects/` 新建 `.mdx`：

```mdx
---
title: "作品名称"
summary: "项目解决的问题和价值。"
period: "2026"
role: "我的具体职责"
tech: [Next.js, TypeScript]
cover: /images/projects/project-slug.webp
featured: false
links:
  demo: https://example.com
  source: https://github.com/example/project
---

## 我的职责

- 写清楚本人实际完成的工作。

## 成果

- 只填写可公开、可核实的结果。
```

`links.demo` 和 `links.source` 至少填写一个；链接必须使用 HTTPS。`featured: true` 的作品可进入首页精选区，首页最多展示两个。当前没有作品草稿字段，不准备公开的作品不要提交到此目录。

## 公开个人资料

在 `content/profile/` 新建 `.md`：

```md
---
title: "公开简介"
visibility: public
relatedPath: /about
---

这里写愿意同时展示给访客、并允许阿竹引用的事实。
```

只有 `visibility: public` 的资料会进入关于页和阿竹来源。即使加载器能过滤 `private`，仓库和部署产物也不是私人资料保险箱；真正敏感的内容不要创建或提交。

阿竹会同时检索公开个人资料、已发布文章和作品。个人问题找不到依据时会拒绝猜测；因此技能、经历和联系方式要由站主在这里明确填写，不能依赖模型补全。

## 替换首版样例

1. 逐个替换 3 篇带“【示例】”的文章，保留合法 frontmatter。
2. 逐个替换 3 个示例作品和 `example.com`/示例 GitHub 链接。
3. 更新 `bio.md`、`contact.md`、`faq.md`，删除未确认的提示语。
4. 为每个 `cover` 路径在 `public/images/` 添加实际图片，或同步修改路径。
5. 确认没有保密项目、私人联系方式、内部地址或第三方秘密。
6. 运行完整质量命令并在 375px、768px、1440px 检查页面。

## 发布前验证

```powershell
npm run typecheck
npm run lint
npm run test -- --run
npm run build
```

另外打开文章、作品、关于页、RSS 和 sitemap，确认标题、摘要、公开状态与链接正确。
