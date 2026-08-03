# 内容维护指南

页面内容来自 `content/`，保存后会在开发环境更新，并在构建时接受严格校验。不要把密钥、住址、证件、私人联系方式、客户秘密或未获授权的第三方资料写入仓库；`visibility: private` 不是秘密存储机制。

## 通用规则

- 文件名或显式 `slug` 只使用小写字母、数字和单个连字符，例如 `my-first-post`。
- 同一内容类型的 slug 不得重复。
- 日期使用真实的 `YYYY-MM-DD` 日历日期。
- 外部链接只允许 `https://`。
- 本地资源路径必须以 `/` 开头，不能包含 `..`。
- 正文支持 Markdown 和 GFM；MDX JavaScript 表达式被禁用。
- 派生站如果仍有“示例”或“待填写”标记，不得把对应内容当作真实经历发布；核实后删除标记并同步测试。
- 真实姓名、学校、实习单位、私人联系方式和可反查身份的账号默认不公开；改变边界前先更新规格并再次取得批准。

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
---

## 我的职责

- 写清楚本人实际完成的工作。

## 成果

- 只填写可公开、可核实的结果。
```

`links` 整体可省略；提供时，`links.demo` 和 `links.source` 至少填写一个，且必须使用 HTTPS。没有经过隐私审计与站主再次批准时，不添加 GitHub 账号、组织或仓库链接，也不用占位网址代替。`featured: true` 的作品可进入首页精选区，首页最多展示两个。当前没有作品草稿字段，不准备公开的作品不要提交到此目录。

## 能力档案

在 `content/capabilities/` 新建 `.mdx`：

```mdx
---
title: "能力领域"
summary: "当前判断与领域概述。"
status: learning
updatedAt: 2026-08-03
order: 1
featured: false
branches: [分支一, 分支二]
---

## 我的理解

## 做过的事

## 边界与失败

## 下一步
```

`status` 只能使用 `exploring`（正在了解）、`learning`（做过练习）、`practiced`（做过完整实践）或 `independent`（能独立承担）。`order` 必须为正整数，`updatedAt` 使用有效日期。四个二级标题缺一不可；计划与下一步不能写成已经完成的经历。`featured: true` 的档案进入首页重点能力区，首版最多展示三个。

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

阿竹会同时检索公开个人资料、已发布文章、作品和能力档案。个人问题找不到依据时会拒绝猜测；真实姓名、学校和实习单位等受保护身份问题会在读取资料或调用模型前直接拒答。

## 派生站定制

1. 更新规格中的公开身份、隐私边界、作品与能力口径。
2. 替换文章、作品、能力和公开资料；删除不能核实的断言，而不是补写占位事实。
3. 逐项核对团队贡献、竞赛名次、失败尝试和下一步，避免把参与或研究 fork 写成原创成果。
4. 为每个 `cover` 路径在 `public/images/` 添加实际图片，或同步修改路径。
5. 审计外部链接；账号、组织和仓库路径可能暴露身份，必须单独批准。
6. 确认没有保密项目、私人联系方式、内部地址或第三方秘密。
7. 运行完整质量命令并在 375px、768px、1440px 检查页面。

## 发布前验证

```powershell
npm run typecheck
npm run lint
npm run test -- --run
npm run build
```

另外打开文章、作品、能力、关于页、RSS 和 sitemap，确认标题、摘要、公开状态、锚点与链接正确。
