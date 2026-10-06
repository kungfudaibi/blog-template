# blog-template

一个可复用的中文个人博客与作品集模板，使用 Next.js App Router、TypeScript 和 MDX 构建。

当前定制分支使用公开笔名 **zhujiechong**，展示文章、校园开源镜像站与 FPGA 小车两个作品、能力档案、关于页和“那些打动我的瞬间”。访客问答功能已移除。模板使用者须先替换身份、内容与链接，并重新确认公开边界。

## 本地运行

需要 Node.js 22 或更高版本。

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

访问 `http://localhost:3000`。`.env.local` 仅用于本机配置，不要提交。部署时把 `SITE_URL` 设置为站点的 HTTPS 根地址，用于 canonical、RSS 和 sitemap；本站不需要模型 API 密钥。

## 首次定制

1. 先更新 [产品规格](docs/spec.md)，确认公开身份、内容和项目链接。
2. 搜索 `zhujiechong`、`咕咕嘎嘎`、`【示例】`、`【待填写】`，替换演示身份和占位内容。首页角色点缀使用根据四张参考图生成的二创视觉稿；发布派生站前须检查 `components/CharacterAccent.tsx`、`public/images/characters/` 中的素材及其使用边界。
3. 按 [内容维护指南](docs/content-guide.md)修改 `content/posts/`、`content/moments/`、`content/daily-quotes.json`、`content/projects/`、`content/capabilities/` 和 `content/profile/`。
4. 更新站名、页面元数据、页眉与页脚，运行质量检查，再决定是否部署。模板发布不代表授权部署派生站。

## 内容位置

| 内容 | 文件 |
|---|---|
| 文章 | `content/posts/*.mdx` |
| 作品 | `content/projects/*.mdx` |
| 能力档案 | `content/capabilities/*.mdx` |
| 瞬间卡片与感受 | `content/moments/*.mdx` |
| 每日一言的作品短句与出处 | `content/daily-quotes.json` |
| 关于页联系方式 | `content/profile/contact.md` |
| 站点元数据 | `app/layout.tsx` |
| 首页角色点缀 | `components/CharacterAccent.tsx`、`public/images/characters/four-companions-v2.png` |

`content/profile/` 中的 `visibility: private` 只用于页面过滤，不是秘密存储。不要把密钥、真实身份资料或其他敏感信息提交到仓库。账号主页与项目外链只添加 [产品规格](docs/spec.md)批准的精确 HTTPS 地址。

## 质量检查

```powershell
npm run typecheck
npm run lint
npm run test -- --run
npm run build
npx playwright test
```

Playwright 默认启动独立的本地开发服务。部署步骤和边界见 [部署指南](docs/deployment.md)，公开资料边界见 [隐私说明](docs/privacy.md)。
