# blog-template

一个可直接复用的中文个人博客、作品集与卡通 Agent 模板，使用 Next.js App Router、TypeScript、MDX 和 Cloudflare Workers AI 构建。

演示站点名称是 **zhujiechong**，包含 3 篇文章、3 个作品和公开个人资料的**示例模板**。这些内容不是模板使用者的真实经历，公开发布前必须按[内容维护指南](docs/content-guide.md)替换。

## 使用这个模板

在 GitHub 仓库页面选择 **Use this template**，或使用 GitHub CLI 创建自己的仓库：

```powershell
gh repo create my-blog --template kungfudaibi/blog-template --public --clone
Set-Location my-blog
npm ci
Copy-Item .env.example .env.local
npm run dev
```

macOS/Linux 将复制环境文件的命令替换为：

```bash
cp .env.example .env.local
```

## 首次定制清单

1. 先更新 `docs/spec.md`，写清网站名称、站主定位、公开边界和模型选择。
2. 全仓搜索 `zhujiechong`、`阿竹`、`【示例】`、`【待填写】`，替换品牌文案和占位内容。
3. 按[内容维护指南](docs/content-guide.md)替换 `content/posts/`、`content/projects/`、`content/profile/`。
4. 更新 `app/layout.tsx`、首页、页眉、页脚、Agent 文案和 `public/agent/azhu.png`。
5. 设置 `SITE_URL`；需要 Agent 模型时才配置 Cloudflare 服务端凭据。
6. 运行全部质量门禁并人工检查 375px、768px、1440px 视口。

给编码 Agent 的约束位于 [AGENTS.md](AGENTS.md)。派生项目应先更新规格，再要求 Agent 改变行为或范围。

## 功能

- 首页、博客列表/详情、作品列表/详情和关于页
- RSS、sitemap、robots、分享元数据与品牌化错误页
- 全站像素机器人“阿竹”对话入口
- 只基于公开站内资料回答个人问题；资料不足时拒绝猜测
- Cloudflare Workers AI 服务端适配层，默认模型 `@cf/qwen/qwen3-30b-a3b-fp8`
- 响应式、键盘操作、减少动画和安全响应头

## 本地启动

要求 Node.js 22 或更高版本，以及 npm。

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

打开 `http://localhost:3000`。不填写 Cloudflare 凭据时，内容页面和阿竹入口仍可使用；需要模型的专业问题会显示“模型服务尚未配置”，不会调用其他模型或产生费用。

`.env.local` 只保存在本机，不得提交。要测试真实模型，请按[部署指南](docs/deployment.md)创建最小权限 Token，并确认 Cloudflare 账户保持在 Workers Free。

## 质量命令

```powershell
npm run typecheck
npm run lint
npm run test -- --run
npm run build
npm run start
```

端到端测试默认使用 Playwright 管理的浏览器：

```powershell
npx playwright install chromium
npx playwright test
```

如果要使用本机 Chrome，可在当前终端设置 `PLAYWRIGHT_EXECUTABLE_PATH` 后运行 `npm run test:e2e`。

## 环境变量

| 变量 | 必需 | 用途 |
|---|---:|---|
| `SITE_URL` | 部署时必需 | 生成 canonical、sitemap 和 RSS 的站点根 URL |
| `CLOUDFLARE_ACCOUNT_ID` | 启用模型时必需 | Cloudflare 账户 ID，必须是服务端变量 |
| `CLOUDFLARE_AI_API_TOKEN` | 启用模型时必需 | Workers AI API Token，必须是服务端秘密 |
| `CLOUDFLARE_AI_MODEL` | 否 | 模型 ID；缺省使用 Qwen3 30B |

所有 `CLOUDFLARE_` 变量都不要使用 `NEXT_PUBLIC_` 前缀，尤其不能暴露 Account ID 和 API Token。代码会校验变量格式，缺失或无效时安全失败。

## 内容维护

- `content/posts/*.mdx`：博客文章
- `content/projects/*.mdx`：作品详情
- `content/profile/*.md`：关于页和阿竹可引用的公开资料
- `public/agent/azhu.png`：阿竹透明 PNG 素材

字段、slug、草稿、公开级别和发布前检查见[内容维护指南](docs/content-guide.md)。修改内容无需改页面组件。

## 项目结构

```text
app/                App Router 页面、元数据路由和 Agent API
components/         页面与交互组件
content/            文章、作品和公开资料
lib/agent/          检索、模型适配、安全边界和限流
lib/content/        内容校验与加载
public/             静态资源
tests/              Vitest 与 Playwright 测试
docs/               规格、维护、隐私与部署文档
tasks/              已批准计划和任务清单
```

## 运维边界

- 应用不保存完整访客问题或回答，不包含数据库、Cookie、登录或分析追踪。
- 模型 Token 只在服务端使用，API 响应设置 `no-store`。
- 免费额度耗尽、超时或上游失败时显示稳定错误，不自动升级付费计划。
- 未经单独确认，不执行预览或生产部署。

更多信息见[隐私说明](docs/privacy.md)、[部署指南](docs/deployment.md)和[产品规格](docs/spec.md)。

## License

代码和模板文档采用 [MIT License](LICENSE)。派生站点中的个人内容、商标和第三方素材仍由各自权利人负责。
