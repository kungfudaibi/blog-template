# 部署指南

生产站点由现有 Vercel `blog` 项目托管，公开地址为 `https://www.zhujiechong.org`；根域 `https://zhujiechong.org` 重定向到 `www`，DNS 继续由 Cloudflare 管理。`feature/disco-customization` 当前连接到 Vercel 部署。2026-10-06 站主明确授权推送并发布已验收版本。本站不使用 Cloudflare Workers AI，也不需要模型 Token。

## 发布前

```powershell
npm ci
npm run typecheck
npm run lint
npm run test -- --run
npm run build
npx playwright test
npm audit --registry=https://registry.npmjs.org --omit=dev --audit-level=high
```

核对公开内容、项目外链与 `git status --short`；只提交发布所需文件，不提交 `.env.local`、原始角色参考图、设计草稿或敏感资料。

2026-10-06 发布检查：生产依赖审计为 0 漏洞。完整审计仍报告 5 项来自 ESLint → `fast-glob` → `micromatch` → `braces` 的开发工具链高危项；当前兼容版本没有补丁，未纳入生产运行依赖。

`v0.1.0` 已从提交 `bd67669` 创建，Vercel `blog` 生产与 `blog-template` 预览部署均成功。公开域名检查：首页、文章、作品、能力、瞬间、关于、RSS、sitemap 和 robots 均返回 200；首页四只角色素材返回 200，旧 `/api/agent` 返回 404，canonical 与内容索引使用 `https://www.zhujiechong.org`。

`v0.2.0` 记录已验收视觉改版：统一首页和内页风格，更新关于页联系卡片与能力地图。发布从 `feature/disco-customization` 推送触发既有 Vercel 项目，不修改 DNS 或环境变量。设计原型、原始角色参考图和旧动图留在本地；若生产验收失败，回退到上一已验证部署。

## Vercel 与域名

1. 推送 `feature/disco-customization` 后查看 GitHub 上 `Vercel – blog` 的生产部署状态和 `Vercel – blog-template` 的预览部署状态。
2. 生产构建在没有 `SITE_URL` 或误用本机地址时默认使用 `https://www.zhujiechong.org`。若在 Vercel 中显式设置 `SITE_URL`，其值也必须是这个 HTTPS 根地址；变量变更只对下一次部署生效。
3. 现有域名、DNS 和权限保持不变。需要调整域名时，以 Vercel Domains 显示的记录为准，并另行核对 Cloudflare 配置。
4. 部署成功后检查 canonical、Open Graph、RSS、robots、sitemap 以及页面内容；如有问题，从 Vercel 回滚到上一已验证部署。

参考：[Vercel 上的 Next.js](https://vercel.com/docs/frameworks/full-stack/nextjs)、[环境变量](https://vercel.com/docs/environment-variables)、[自定义域名](https://vercel.com/docs/domains/set-up-custom-domain)、[Cloudflare DNS 代理状态](https://developers.cloudflare.com/dns/proxy-status/)。

## 上线验收与回滚

- 检查首页、文章、作品、能力、瞬间和关于页；确认 `/api/agent` 返回 404，站点无访客提问入口。
- 检查 `/robots.txt`、`/sitemap.xml`、`/rss.xml` 的域名，以及无效页面的 404。
- 检查手机和桌面宽度、外链、键盘导航、浏览器控制台和公开资料边界。
- 页面回归时在 Vercel 回滚到上一已验证部署，修复后重新运行质量门。
