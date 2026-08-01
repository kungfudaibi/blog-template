# 部署指南

目标平台是 Vercel，模型服务是 Cloudflare Workers AI REST API。本文件只记录步骤；当前仓库没有获得预览或生产部署授权，也没有执行部署。

## 1. 发布前检查

```powershell
npm ci
npm run typecheck
npm run lint
npm run test -- --run
npm run build
npx playwright test
```

确认示例内容已替换、没有真实密钥进入 Git，并从 `git status --short` 检查工作区范围。

## 2. 准备 Cloudflare Workers AI Free

1. 在 Cloudflare Dashboard 打开 Workers AI，确认账户保持在 **Workers Free**，不要升级 Workers Paid。
2. 选择 **Use REST API**，创建 Workers AI API Token。官方模板需要 Workers AI Read 和 Edit 权限。
3. 复制 32 位 Account ID 和只显示一次的 Token，存入密码管理器；不要写进聊天、Issue、日志或仓库。
4. 保持模型为 `@cf/qwen/qwen3-30b-a3b-fp8`，除非规格已更新并重新评审。

官方参考：[Workers AI REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/)、[Qwen3 30B 模型](https://developers.cloudflare.com/workers-ai/models/qwen3-30b-a3b-fp8/)。

截至 2026-07-08，Cloudflare 文档列出的免费分配为每日 10,000 Neurons，00:00 UTC 重置；Workers Free 超额后请求失败。Workers Paid 才会对免费分配以上用量计费。该额度可能变化，部署前必须重新查看[官方价格页](https://developers.cloudflare.com/workers-ai/platform/pricing/)。本应用只把 429/配额/上游错误转为安全失败，不具备切换计划或自动计费的代码。

## 3. 配置 Vercel

1. 把仓库导入 Vercel，Framework Preset 选择 Next.js；安装和构建使用仓库默认命令。
2. 在 Project Settings → Environment Variables 中添加：
   - `SITE_URL=https://<项目>.vercel.app`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_AI_API_TOKEN`
   - `CLOUDFLARE_AI_MODEL=@cf/qwen/qwen3-30b-a3b-fp8`（可省略，代码有同值默认项）
3. 将 Cloudflare 凭据只配置给确实需要的 Vercel 环境；变量名不要添加 `NEXT_PUBLIC_`。
4. 域名尚未购买时，先使用稳定的 Vercel 项目域名作为 `SITE_URL`。以后绑定自定义域名时，同步更新 `SITE_URL` 并重新部署。
5. 获得站主单独授权后再创建部署；用户评审通过前不要把预览提升为生产。

参考：[Vercel 上的 Next.js](https://vercel.com/docs/frameworks/full-stack/nextjs)、[Vercel 环境变量](https://vercel.com/docs/environment-variables)。

## 4. 部署后冒烟检查

- `/`、`/blog`、一篇文章、`/projects`、一个作品和 `/about` 返回 200。
- `/robots.txt`、`/sitemap.xml`、`/rss.xml` 使用正确的公开域名，且 sitemap 不含 `/api/` 或资料文件路径。
- 一个不存在的 URL 返回品牌化 404。
- 浏览器静态资源和网络响应不出现 Cloudflare Token。
- 未知个人问题明确表示资料不足，且不调用模型。
- 已知个人问题带站内引用；专业问题标明“通用技术知识”。
- 配额耗尽或临时撤销 Token 后，Agent 显示稳定错误，内容页面仍正常。
- 用真实凭据完成一次 Cloudflare 冒烟后立即检查 Workers AI 用量面板。

## 5. 回滚与密钥事件

- 页面或 API 回归：在 Vercel 回滚到上一个已验证部署，再修复并重新跑质量门禁。
- Token 疑似泄露：立即在 Cloudflare 撤销并重新创建 Token，更新 Vercel 环境变量，重新部署；不要仅从 Git 历史删除后继续使用旧 Token。
- 意外启用付费：先停用或撤销模型 Token，并回到 Workers Free，再调查账户设置。本项目不会代表用户更改计费计划。
