# 内容维护指南

页面内容来自 `content/`，保存后会在开发环境更新，并在构建时接受严格校验。不要把密钥、住址、证件、私人联系方式、客户秘密或未获授权的第三方资料写入仓库；`visibility: private` 不是秘密存储机制。

## 通用规则

- 文件名或显式 `slug` 只使用汉字、小写字母、数字和单个连字符，例如 `my-first-post` 或 `运维日志-救回系统盘`。
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
| `aiCreatedWith` | 可选；文章确由 AI 创作且模型身份已确认时，填写公开署名，例如 `Codex（基于 GPT-6）`。首页、列表和正文页会显示“AI 创作 · …”；其他文章不要填写或推断。 |

## 那些打动我的瞬间

首页展览卡片来自 `content/moments/*.mdx`。点击卡片会打开对应详情页；在文件的第二个 `---` 之后直接写 Markdown/MDX 正文，保存后即可预览。现有 `content/moments/disco-elysium.mdx` 的正文刻意留空，等站主写自己的感受。

新增卡片时，复制一份文件并填写 `title`、`image`、`alt`、`width`、`height` 和 `credit`。`image` 是 `public/` 内图片对应的站点路径；宽高填写图片的原始像素，确保完整显示。`alt` 描述画面内容，`credit` 如实说明素材来源与使用性质。文件名就是详情页 slug；卡片和站点地图会自动更新。不要把未获授权的素材或私人信息放入此目录。

首页“每日一言”来自 `content/daily-quotes.json` 中的作品短句，与你在瞬间详情页写的感受相互独立。你新增喜欢的作品后，可以告诉 Codex 去搜索几句有代表性的原文；核对作品归属与出处后，填写 `text`、`sourceTitle`、`sourceUrl`（HTTPS 核对链接）和对应的 `momentSlug`。首页显示作品名与“核对出处”，按北京时间每天轮换。你无需提供 API 或 MCP；访客打开页面时也不会调用搜索或模型。

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
  demo: https://project.example.com
  source: https://github.com/owner/project
---

## 我的职责

- 写清楚本人实际完成的工作。

## 成果

- 只填写可公开、可核实的结果。
```

`links` 整体可省略；提供时，`links.demo` 和 `links.source` 至少填写一个，且必须使用 HTTPS。没有经过隐私审计与站主再次批准时，不添加其他 GitHub 账号、组织或仓库链接，也不用占位网址代替。关于页已获批准的 GitHub 与 Bilibili 主页，以及当前两个已发布作品的精确外链，均须见 `docs/spec.md` 与 `tests/public-content-privacy.test.ts`。`featured: true` 的已发布作品可进入首页精选区，首页最多展示两个。作品默认发布；暂不展示时设置 `published: false`，文件保留在仓库，但不会进入站点列表、详情或站点地图。未发布文件仍是仓库中的公开材料，不能存放秘密。

## 常用修改位置

| 内容 | 文件或目录 |
|---|---|
| 文章 | `content/posts/*.mdx` |
| 瞬间卡片与感受 | `content/moments/*.mdx` |
| 作品及演示/源码链接 | `content/projects/*.mdx` 的 frontmatter 与正文 |
| 能力状态与经历 | `content/capabilities/*.mdx` |
| 关于页联系方式 | `content/profile/contact.md` |
| 首页固定文案 | `app/page.tsx` |
| 关于页开场文案 | `app/about/page.tsx` |
| 站名与全站元数据 | `app/layout.tsx`，随后全仓搜索旧站名 |
| 项目、文章和灵感图片 | `public/images/` |

修改标题、链接或固定文案后，相关测试可能会提示旧值；同步修改 `tests/` 中对应断言，不要通过删除隐私或安全测试来绕过失败。

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

`status` 只能使用 `exploring`（正在了解）、`learning`（做过练习）、`practiced`（做过完整实践）或 `independent`（能独立承担）。`order` 必须为正整数，`updatedAt` 使用有效日期。正文标题和结构完全由站主决定，可以删改示例中的四个二级标题；系统不会为空白或未完成内容补写事实。`featured: true` 的档案进入首页重点能力区，首版最多展示三个。

文章、作品和能力的 `summary` 可以暂时写成空字符串 `""`；页面会省略空摘要。公开 profile 文件正文为空时会被视为未完成草稿，不出现在关于页。用于路由和安全的标题、日期、slug、状态与链接字段仍不能留空。

## 公开个人资料

在 `content/profile/` 新建 `.md`：

```md
---
title: "公开简介"
visibility: public
relatedPath: /about
---

这里写愿意向访客公开的事实。
```

只有 `visibility: public` 的资料会进入关于页。即使加载器能过滤 `private`，仓库和部署产物也不是私人资料保险箱；真正敏感的内容不要创建或提交。

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
