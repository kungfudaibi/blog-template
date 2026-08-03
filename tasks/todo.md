# Task Checklist: zhujiechong 个人博客与卡通 Agent

> 状态：Tasks 1–18 已完成；Tasks 19–26 已批准并进入实施；等待真实 Cloudflare 冒烟与用户最终审阅，未部署
> 详细架构：`tasks/plan.md`  
> 已批准规格：`docs/spec.md`

每项任务只有在其验收条件、验证步骤和统一 Definition of Done 同时满足后才能勾选。

## Phase 1: Foundation

## Task 1: 初始化 Next.js 工程配置

**Description:** 初始化 Git，并建立 Next.js、TypeScript、Tailwind、内容与测试依赖的锁定工程配置，先固定命令和版本边界，不实现产品功能。

**Acceptance criteria:**
- [x] `package.json` 提供规格要求的 dev、build、start、typecheck、lint、test 命令
- [x] TypeScript 严格模式、ESLint 和忽略规则有效
- [x] 依赖安装生成可重复使用的 lockfile

**Verification:**
- [x] 安装通过：`npm ci`
- [x] TypeScript 配置可解析：`npm run typecheck`
- [x] 人工检查：Git 仓库已初始化，且无宽泛版本占位或数据库、认证、分析依赖

**Dependencies:** None

**Files likely touched:**
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `eslint.config.mjs`
- `.gitignore`

**Estimated scope:** Medium (5 files)

## Task 2: 建立最小应用与测试基线

**Description:** 添加可启动的最小 App Router 页面、全局样式入口、Vitest 环境和一个运行时烟雾测试，使后续切片都有稳定基线。

**Acceptance criteria:**
- [x] 根页面可由 Next.js 开发服务器和生产构建渲染
- [x] Vitest + Testing Library 能渲染根页面并执行断言
- [x] 测试失败时命令返回非零退出码

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/smoke.test.tsx`
- [x] 构建成功：`npm run build`
- [x] 手工检查：`npm run dev` 后根页面无运行时错误

**Dependencies:** Task 1

**Files likely touched:**
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `vitest.config.ts`
- `tests/smoke.test.tsx`

**Estimated scope:** Medium (5 files)

## Task 3: 实现响应式全站视觉外壳

**Description:** 落地已确认的 D 视觉方向，提供导航、页脚、设计令牌、跳转链接和响应式页面容器，不提前实现内容或 Agent 功能。

**Acceptance criteria:**
- [x] 暖白纸张、蓝色/珊瑚点缀和终端细节由统一 CSS 令牌控制
- [x] 导航在手机与桌面均可用，当前页面、焦点和跳过导航状态清晰
- [x] 页面外壳尊重 `prefers-reduced-motion` 和系统字体回退

**Verification:**
- [x] 组件测试：`npm run test -- --run tests/site-shell.test.tsx`
- [x] 检查通过：`npm run typecheck && npm run lint`
- [x] 浏览器检查：Chrome 的 375px 与 1440px 视口无横向溢出或控制台错误

**Dependencies:** Task 2

**Files likely touched:**
- `app/layout.tsx`
- `app/globals.css`
- `components/SiteHeader.tsx`
- `components/SiteFooter.tsx`
- `tests/site-shell.test.tsx`

**Estimated scope:** Medium (5 files)

## Checkpoint: Foundation

- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run test -- --run`
- [x] `npm run build`
- [ ] 用户可审阅首页外壳

## Phase 2: Content Slices

## Task 4: 建立内容契约与安全加载器

**Description:** 定义文章、作品和个人资料的元数据契约，安全读取仓库内 MDX，统一草稿过滤、排序、Slug 校验与错误报告。

**Acceptance criteria:**
- [x] 非法 frontmatter、重复 Slug 和目录穿越输入被拒绝
- [x] 生产环境过滤草稿，文章和作品排序稳定
- [x] 加载器只读取允许的 `content/` 子目录

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/content-loader.test.ts`
- [x] 类型检查：`npm run typecheck`
- [x] 检查：错误包含相对文件位置且不含系统绝对路径

**Dependencies:** Task 1

**Files likely touched:**
- `lib/content/schema.ts`
- `lib/content/load.ts`
- `lib/content/index.ts`
- `tests/content-loader.test.ts`

**Estimated scope:** Medium (4 files)

## Task 5: 交付博客列表到详情切片

**Description:** 使用真实 MDX 加载器交付博客列表、文章详情、文章卡片和第一篇显著标为示例的文章。

**Acceptance criteria:**
- [x] `/blog` 展示文章标题、摘要、日期和标签
- [x] `/blog/[slug]` 安全渲染允许的 MDX 内容并处理不存在页面
- [x] 文章卡片可用键盘访问且链接名称明确

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/blog.test.tsx`
- [x] 构建成功：`npm run build`
- [x] Chrome 检查：列表可进入示例文章且缺失 Slug 返回 HTTP 404

**Dependencies:** Tasks 3, 4

**Files likely touched:**
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `components/PostCard.tsx`
- `content/posts/hello-world.mdx`
- `tests/blog.test.tsx`

**Estimated scope:** Medium (5 files)

## Task 6: 补齐博客样例、RSS 与文章元数据

**Description:** 增加两篇示例文章，生成 RSS，并让文章详情输出可分享的标题、描述与规范 URL 元数据。

**Acceptance criteria:**
- [x] 共 3 篇示例文章均来自 MDX 且无需改页面代码即可替换
- [x] `/rss.xml` 只包含已发布文章并输出有效 XML
- [x] 每篇文章具有独立 title、description 和 canonical 路径

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/rss.test.ts`
- [x] 构建成功：`npm run build`
- [x] Chrome 检查：浏览器可打开 RSS，文章元数据与内容一致

**Dependencies:** Task 5

**Files likely touched:**
- `content/posts/building-things.mdx`
- `content/posts/learning-notes.mdx`
- `app/rss.xml/route.ts`
- `lib/content/seo.ts`
- `tests/rss.test.ts`

**Estimated scope:** Medium (5 files)

## Task 7: 交付作品列表到详情切片

**Description:** 使用作品内容契约交付作品集列表、详情、作品卡片和第一个显著标为示例的作品。

**Acceptance criteria:**
- [x] `/projects` 展示作品摘要、角色、技术栈和精选状态
- [x] `/projects/[slug]` 展示职责、成果和经过校验的外部链接
- [x] 无效或缺失作品返回稳定 404

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/projects.test.tsx`
- [x] 构建成功：`npm run build`
- [x] Chrome 检查：外部链接具有清晰标识、`_blank` 与 `noopener noreferrer`

**Dependencies:** Tasks 3, 4

**Files likely touched:**
- `app/projects/page.tsx`
- `app/projects/[slug]/page.tsx`
- `components/ProjectCard.tsx`
- `content/projects/example-platform.mdx`
- `tests/projects.test.tsx`

**Estimated scope:** Medium (5 files)

## Task 8: 补齐作品样例与首页精选区

**Description:** 增加两个示例作品，并让首页从内容源读取精选作品和最新文章，形成完整访客入口。

**Acceptance criteria:**
- [x] 共 3 个示例作品均可由内容文件替换
- [x] 首页展示个人定位、精选作品、最新文章和后续 Agent 入口占位
- [x] 无精选内容时首页提供稳定空状态

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/home-content.test.tsx`
- [x] 构建成功：`npm run build`
- [x] Chrome 检查：首页到作品和文章详情的路径完整，375px 与 1440px 无溢出或控制台错误

**Dependencies:** Tasks 5, 7

**Files likely touched:**
- `content/projects/example-tool.mdx`
- `content/projects/example-experiment.mdx`
- `components/FeaturedProjects.tsx`
- `app/page.tsx`
- `tests/home-content.test.tsx`

**Estimated scope:** Medium (5 files)

## Task 9: 交付关于页与授权资料模板

**Description:** 提供关于页及站主可填写的公开资料模板，将示例内容与真实资料槽位明确区分，并为 Agent 提供授权来源。

**Acceptance criteria:**
- [x] `/about` 展示程序员定位、公开介绍和可替换联系方式占位
- [x] 个人资料按主题记录标题、正文、公开级别和相关站内链接
- [x] 非公开或非法级别资料不会进入 Agent 来源集合

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/profile.test.tsx`
- [x] 构建成功：`npm run build`
- [x] Chrome 检查：所有占位内容均显著标记为示例，375px 与 1440px 无溢出或控制台错误

**Dependencies:** Tasks 4, 8

**Files likely touched:**
- `app/about/page.tsx`
- `content/profile/bio.md`
- `content/profile/faq.md`
- `lib/content/profile.ts`
- `tests/profile.test.ts`

**Estimated scope:** Medium (5 files)

## Checkpoint: Content

- [x] `npm run typecheck && npm run lint`
- [x] `npm run test -- --run`
- [x] `npm run build`
- [x] 3 篇文章、3 个作品、关于页和 RSS 均可访问
- [x] 替换内容不要求修改页面组件

## Phase 3: Agent Slice

## Task 10: 实现授权资料检索与引用

**Description:** 将公开资料、文章和作品转换为可检索来源，用标题/标签/词项/中文字符片段评分，返回有限上下文与站内引用。

**Acceptance criteria:**
- [x] 已知个人问题召回正确资料并附站内引用
- [x] 未知个人问题返回“资料不足”信号而非拼凑答案
- [x] 选择的上下文具有文档数和字符数硬上限

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/retrieval.test.ts`
- [x] 类型检查：`npm run typecheck`
- [x] 自动化评测：10 个已知问题全部召回预期来源，5 个未知问题全部返回资料不足

**Dependencies:** Task 9

**Files likely touched:**
- `lib/agent/types.ts`
- `lib/agent/sources.ts`
- `lib/agent/retrieve.ts`
- `tests/retrieval.test.ts`

**Estimated scope:** Medium (4 files)

## Task 11: 实现 Provider 接口与 Cloudflare 适配器

**Description:** 定义可替换模型接口、确定性测试 Provider 和 Cloudflare Workers AI REST 实现，集中处理环境变量、超时和上游错误。

**Acceptance criteria:**
- [x] 测试可完全使用模拟 Provider 且不访问网络
- [x] Cloudflare 凭据和模型 ID 只从服务端环境变量读取
- [x] 429、超时、认证失败和上游错误映射为稳定内部错误

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/model-provider.test.ts`
- [x] 类型检查：`npm run typecheck`
- [x] 当前无凭据：未发送真实请求；Mock 已验证请求契约，待 Task 14 配置凭据后再做 Qwen3 30B 冒烟

**Dependencies:** Tasks 1, 10

**Files likely touched:**
- `lib/agent/provider.ts`
- `lib/agent/cloudflare-provider.ts`
- `lib/agent/env.ts`
- `.env.example`
- `tests/model-provider.test.ts`

**Estimated scope:** Medium (5 files)

## Task 12: 实现 Agent API 与安全边界

**Description:** 交付 `/api/agent`，组合验证、检索、提示词和 Provider，并增加基础实例内限流、响应上限与不记录完整对话的错误处理。

**Acceptance criteria:**
- [x] 非法、超长、越权和高频请求被稳定拒绝
- [x] 个人问题无资料时不调用模型编造；专业问题标明通用知识边界
- [x] API 响应只包含回答、允许的引用和稳定错误码

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/agent-api.test.ts tests/rate-limit.test.ts`
- [x] 类型与 Lint：`npm run typecheck && npm run lint`
- [x] 代码与 Chrome API 检查：未记录完整问题、回答、密钥或授权资料正文；无凭据与越权路径安全失败

**Dependencies:** Tasks 10, 11

**Files likely touched:**
- `app/api/agent/route.ts`
- `lib/agent/validation.ts`
- `lib/agent/rate-limit.ts`
- `lib/agent/errors.ts`
- `tests/agent-api.test.ts`

**Estimated scope:** Medium (5 files)

## Task 13: 生成“阿竹”素材并实现对话面板

**Description:** 按 D 视觉方向生成原创像素机器人资产，构建全站悬浮入口、模态对话面板、焦点管理和减少动画状态。

**Acceptance criteria:**
- [x] “阿竹”素材原创、可替换且与暖白纸张/终端视觉协调
- [x] 对话面板可用键盘打开、发送、关闭并恢复焦点
- [x] 加载、空状态和减少动画模式清晰可辨

**Verification:**
- [x] 组件测试：`npm run test -- --run tests/agent-dialog.test.tsx`
- [x] 类型与 Lint：`npm run typecheck && npm run lint`
- [x] Chrome 检查：375px 与 1440px 不遮挡关键内容，透明 PNG 四角 alpha 为 0

**Dependencies:** Task 3

**Files likely touched:**
- `public/agent/azhu.png`
- `components/agent/AgentLauncher.tsx`
- `components/agent/AgentDialog.tsx`
- `components/agent/PixelAgent.tsx`
- `tests/agent-dialog.test.tsx`

**Estimated scope:** Medium (5 files)

## Task 14: 串联 Agent 问答与引用流程

**Description:** 将对话面板连接到 API，渲染引用、失败与重试状态，并覆盖已知、未知、专业和提示词注入路径。

**Acceptance criteria:**
- [x] 访客可以发送问题、看到流畅状态变化并打开允许的站内引用
- [x] 未知个人问题、限流、配额耗尽和上游失败都有明确可恢复提示
- [x] 提示词注入无法获得系统提示、密钥或全部资料

**Verification:**
- [x] 集成测试：`npm run test -- --run tests/agent-flow.test.tsx`
- [x] E2E：`npm run test:e2e -- tests/e2e/agent.spec.ts tests/e2e/agent-api.spec.ts`
- [x] 当前无凭据：真实 API 已验证安全失败；有凭据时的 Qwen3 30B 冒烟保留在阶段检查点

**Dependencies:** Tasks 12, 13

**Files likely touched:**
- `components/agent/useAgentChat.ts`
- `components/agent/AgentMessages.tsx`
- `components/agent/AgentDialog.tsx`
- `app/layout.tsx`
- `e2e/agent.spec.ts`

**Estimated scope:** Medium (5 files)

## Checkpoint: Agent

- [x] `npm run typecheck && npm run lint`
- [x] `npm run test -- --run`
- [x] `npm run build`
- [x] `npm run test:e2e -- tests/e2e/agent.spec.ts tests/e2e/agent-api.spec.ts`
- [x] Cloudflare 缺失凭据、配额耗尽和上游错误均不会使网站崩溃或自动切换付费

## Phase 4: Production Readiness

## Task 15: 完成 SEO、错误边界与安全响应头

**Description:** 为站点增加 sitemap、robots、404/错误体验和合理安全响应头，确保内容可分享且客户端不泄露配置。

**Acceptance criteria:**
- [x] 首页、文章和作品具有正确元数据，sitemap/robots 只暴露公开页面
- [x] 404 与应用错误保持品牌风格并提供恢复入口
- [x] 响应头限制不必要的能力且不破坏 Next.js 或 Agent 请求

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/production-meta.test.ts`
- [x] 构建成功：`npm run build`
- [x] 人工检查：客户端包与网络响应不含服务端 Token

**Dependencies:** Tasks 6, 8, 14

**Files likely touched:**
- `next.config.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/not-found.tsx`
- `tests/production-meta.test.ts`

**Estimated scope:** Medium (5 files)

## Task 16: 完成浏览器可访问性与响应式验收

**Description:** 使用 Playwright 覆盖内容主路径、键盘 Agent 流程、手机/桌面视口和减少动画设置，并修复发现的阻塞问题。

**Acceptance criteria:**
- [x] 首页到文章/作品详情及 Agent 主流程在目标视口通过
- [x] 键盘用户可完成导航、打开/关闭 Agent、发送问题和访问引用
- [x] 关键页面无控制台错误、明显横向溢出或焦点丢失

**Verification:**
- [x] 全量 E2E：`npx playwright test`
- [x] 全量检查：`npm run typecheck && npm run lint && npm run test -- --run && npm run build`
- [x] 人工浏览器检查：375px、768px、1440px 与减少动画模式

**Dependencies:** Task 15

**Files likely touched:**
- `playwright.config.ts`
- `e2e/content.spec.ts`
- `e2e/agent.spec.ts`
- `e2e/accessibility.spec.ts`

**Estimated scope:** Medium (4 files)

## Task 17: 完成维护、隐私与部署文档

**Description:** 记录本地开发、内容填写、Agent 环境变量、隐私边界、免费配额失败行为和 Vercel/Cloudflare 配置步骤。

**Acceptance criteria:**
- [x] 新维护者可仅按 README 启动、测试和构建项目
- [x] 站主可按内容指南替换全部示例资料而无需改组件
- [x] 部署文档明确凭据、免费额度、无持久化和禁止自动付费边界

**Verification:**
- [x] 文档命令逐项核对：`npm ci && npm run typecheck && npm run lint && npm run test -- --run && npm run build`
- [x] 人工检查：README 不含真实密钥、绝对本机路径或过时变更日志语言
- [x] 最终评审：对照 `docs/spec.md` 逐项确认成功标准

**Dependencies:** Task 16

**Files likely touched:**
- `README.md`
- `docs/content-guide.md`
- `docs/deployment.md`
- `docs/privacy.md`
- `.env.example`

**Estimated scope:** Medium (5 files)

## Checkpoint: Complete

- [x] 所有任务验收条件完成
- [x] 全量类型检查、Lint、测试、E2E 和构建通过
- [x] 规格、计划、实际行为和维护文档一致
- [x] 安全、隐私、可访问性和免费额度失败路径已审查
- [ ] 用户完成最终审阅；未获得单独授权前不生产部署

## Phase 5: Owner Customization

## Task 18: 加入《极乐迪斯科》视觉灵感展示

**Description:** 将站主提供的游戏截图作为首页独立视觉灵感内容，在不仿制游戏完整界面的前提下融入现有纸张/终端视觉体系。

**Acceptance criteria:**
- [x] 首页存在名称为“视觉灵感”的语义区域和明确标题
- [x] 完整图片带有中文替代文本、作品说明与非原创用途声明
- [x] 桌面采用编辑部式图文布局，手机改为单列且无横向溢出

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/home-content.test.tsx`
- [x] 全量检查：`npm run typecheck`、`npm run lint`、`npm run test -- --run`、`npm run build`
- [x] Chrome 检查：375px 与 1440px 无控制台错误、失败请求或布局溢出

**Dependencies:** Task 17

**Files likely touched:**
- `public/images/inspiration/disco-elysium-scene.png`
- `components/InspirationFeature.tsx`
- `components/InspirationFeature.module.css`
- `app/page.tsx`
- `playwright.config.ts`
- `tests/home-content.test.tsx`
- `tests/e2e/home.spec.ts`

**Estimated scope:** Medium (6 files)

## Phase 6: Anonymous Portfolio and Capability Map（已批准，实施中）

## Task 19: 放宽作品外链要求并建立匿名内容边界

**Description:** 让匿名作品可以不提供外部链接，更新内容指南，并用测试固定“无链接可发布、无虚构占位链接”的行为。

**Acceptance criteria:**
- [x] `links` 可省略，但存在时仍必须是经过校验的 HTTPS 地址
- [x] 作品卡与详情在没有外部链接时不渲染空容器或诱导性文案
- [x] 内容指南记录 GitHub 外链的隐私审计与再次批准要求

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/content-loader.test.ts tests/projects.test.tsx`
- [x] 类型检查：`npm run typecheck`
- [x] 人工检查：没有为满足 schema 添加 `example.com` 或身份暴露链接

**Dependencies:** Task 18

**Files likely touched:**
- `lib/content/schema.ts`
- `components/ProjectLinks.tsx`
- `docs/content-guide.md`
- `tests/content-loader.test.ts`
- `tests/projects.test.tsx`

**Estimated scope:** Medium (5 files)

## Task 20: 建立能力内容契约、加载器与首个超算切片

**Description:** 定义能力元数据、四级状态与安全加载器，并以“超算与 AI Infra”内容完成第一个可测试的数据切片。

**Acceptance criteria:**
- [x] 非法状态、日期、排序、重复 slug 和目录穿越输入被拒绝
- [x] 能力按 `order` 稳定排序，`featured` 可筛选且状态映射为固定中文
- [x] 超算内容包含理解、实践、失败边界与下一步，不夸大失败尝试

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/capabilities-content.test.ts`
- [x] 类型检查：`npm run typecheck`
- [x] 人工检查：竞赛写“2024 IndySCC 线上赛第三名、2025 ASC 二等奖”，且没有学校、队名和队员身份

**Dependencies:** Task 19

**Files likely touched:**
- `lib/content/capability-schema.ts`
- `lib/content/capabilities.ts`
- `lib/content/index.ts`
- `content/capabilities/hpc-ai-infra.mdx`
- `tests/capabilities-content.test.ts`

**Estimated scope:** Medium (5 files)

## Task 21: 交付完整能力地图页面

**Description:** 建立 `/capabilities` 页面、能力档案卡和状态标签，用首个内容切片验证桌面导航、移动端线性阅读和空状态。

**Acceptance criteria:**
- [ ] 页面展示标题、更新时间、状态、分支、正文和相关内容入口
- [ ] 核心内容无需 hover、拖拽或动画即可读取，键盘顺序清晰
- [ ] 无内容时显示稳定空状态，不伪造能力信息

**Verification:**
- [ ] 聚焦测试：`npm run test -- --run tests/capabilities-page.test.tsx`
- [ ] 类型与 Lint：`npm run typecheck`、`npm run lint`
- [ ] Chrome 检查：375px、768px、1440px 无横向溢出

**Dependencies:** Task 20

**Files likely touched:**
- `app/capabilities/page.tsx`
- `components/CapabilityCard.tsx`
- `components/CapabilityStatus.tsx`
- `components/CapabilityMap.module.css`
- `tests/capabilities-page.test.tsx`

**Estimated scope:** Medium (5 files)

## Task 22: 补齐其余五个能力领域内容

**Description:** 加入 Agent、网络安全、体系结构与操作系统、电子与嵌入式、算法五个匿名能力档案，并保证每项都有边界与下一步。

**Acceptance criteria:**
- [ ] 六个领域完整出现且 order、featured 与更新时间合法
- [ ] 网络安全故事不包含服务器、账号、漏洞或攻击步骤
- [ ] Agent、算法和体系结构内容不使用“精通”等无证据表述

**Verification:**
- [ ] 聚焦测试：`npm run test -- --run tests/capabilities-content.test.ts tests/capabilities-page.test.tsx`
- [ ] 内容扫描：搜索真实身份、机构、私人联系方式与示例占位符
- [ ] 人工检查：每项均有理解、实践、边界/失败和下一步

**Dependencies:** Task 21

**Files likely touched:**
- `content/capabilities/agent-development.mdx`
- `content/capabilities/security.mdx`
- `content/capabilities/systems.mdx`
- `content/capabilities/embedded.mdx`
- `content/capabilities/algorithms.mdx`

**Estimated scope:** Medium (5 files)

## Task 23: 用三个匿名真实项目替换示例作品

**Description:** 删除三个示例项目，加入校园开源镜像站、开源自学文档和 blog-template，明确个人职责、团队边界和可核实结果。

**Acceptance criteria:**
- [ ] 作品列表不再包含 `【示例】`、`example.com` 或示例 GitHub 地址
- [ ] 三个项目不出现学校、协会全称、真实姓名、实习单位或未批准外链
- [ ] 团队项目不声称独立完成，fork 和失败尝试不作为原创成果

**Verification:**
- [ ] 聚焦测试：`npm run test -- --run tests/projects.test.tsx tests/home-content.test.tsx`
- [ ] 构建成功：`npm run build`
- [ ] 人工来源核对：职责与结果能追溯到用户确认材料或公开仓库

**Dependencies:** Tasks 19, 21

**Files likely touched:**
- `content/projects/example-data-pipeline.mdx` → `content/projects/campus-mirror.mdx`
- `content/projects/example-dev-workbench.mdx` → `content/projects/open-learning-docs.mdx`
- `content/projects/example-observability-console.mdx` → `content/projects/blog-template.mdx`
- `tests/projects.test.tsx`
- `tests/home-content.test.tsx`

**Estimated scope:** Medium (5 files)

## Task 24: 在首页与导航加入能力地图入口

**Description:** 首页展示三个重点能力摘要，并在全站导航加入“能力”入口，形成作品、文章、能力和 Agent 的访客路径。

**Acceptance criteria:**
- [ ] 首页从能力内容源读取三个 featured 领域，不硬编码事实
- [ ] 首页和导航均可进入 `/capabilities`，当前页与键盘焦点状态清楚
- [ ] 没有 featured 能力时提供稳定空状态

**Verification:**
- [ ] 聚焦测试：`npm run test -- --run tests/home-content.test.tsx tests/site-shell.test.tsx`
- [ ] 类型与 Lint：`npm run typecheck`、`npm run lint`
- [ ] Chrome 检查：首页各目标视口无溢出且入口可用

**Dependencies:** Tasks 22, 23

**Files likely touched:**
- `app/page.tsx`
- `components/FeaturedCapabilities.tsx`
- `components/SiteHeader.tsx`
- `tests/home-content.test.tsx`
- `tests/site-shell.test.tsx`

**Estimated scope:** Medium (5 files)

## Task 25: 让 Agent 检索能力资料并拒绝身份猜测

**Description:** 把能力内容加入授权来源，并为真实身份、学校和实习单位问题建立不调用模型的安全拒答路径。

**Acceptance criteria:**
- [ ] 能力问题召回对应档案并提供 `/capabilities` 引用
- [ ] 隐藏身份问题在无公开资料时直接拒答，不调用 Provider
- [ ] 能力回答保留自我评价和事实边界，不把下一步计划描述成已完成经历

**Verification:**
- [ ] 聚焦测试：`npm run test -- --run tests/retrieval.test.ts tests/agent-api.test.ts`
- [ ] 自动化评测：六个领域问题召回正确来源，身份问题全部拒答
- [ ] 人工检查：响应不包含未授权身份和机构信息

**Dependencies:** Task 22

**Files likely touched:**
- `lib/agent/sources.ts`
- `lib/agent/retrieve.ts`
- `app/api/agent/route.ts`
- `tests/retrieval.test.ts`
- `tests/agent-api.test.ts`

**Estimated scope:** Medium (5 files)

## Task 26: 完成匿名化、响应式与发布前验收

**Description:** 更新维护和隐私文档，执行仓库内容审计与完整浏览器回归，确保第二轮定制达到 Definition of Done。

**Acceptance criteria:**
- [ ] README 与内容指南准确说明能力文件、匿名规则和无外链作品
- [ ] 公开内容、构建产物与 Agent 测试响应不包含禁止公开的信息
- [ ] 六个能力、三个作品及首页路径在目标视口和键盘流程完整可用

**Verification:**
- [ ] 全量检查：`npm run typecheck`、`npm run lint`、`npm run test -- --run`、`npm run build`
- [ ] 全量 E2E：`npx playwright test`
- [ ] 人工终审：搜索 demo 标识、待填写内容、身份线索和外部链接；用户完成内容确认

**Dependencies:** Tasks 23, 24, 25

**Files likely touched:**
- `README.md`
- `docs/content-guide.md`
- `docs/privacy.md`
- `tests/e2e/capabilities.spec.ts`
- `tests/production-meta.test.ts`

**Estimated scope:** Medium (5 files)
