# Task Checklist: zhujiechong 个人博客与作品集

## Task 59: 推送并发布已验收版本

**Acceptance criteria:** 当前定制版推送到 `feature/disco-customization`，从该提交创建 GitHub `v0.1.0` 版本；现有 Vercel `blog` 生产部署更新。`www.zhujiechong.org` 的首页、文章、作品、瞬间、RSS、sitemap 和 canonical 均可用且指向正式域名。`main`、DNS 与权限不改变，环境文件、原始角色参考图和设计草稿不提交。

- [x] 测试先确认生产默认站点根地址不应指向 localhost，随后修正并更新部署说明；生产构建实测 canonical、RSS、sitemap 均使用 `www` 域名
- [x] 更新存在高危审计项的生产依赖，检查提交文件与公开内容；typecheck、lint、82 个单测、build 和 29 个浏览器测试通过，生产依赖审计 0 漏洞
- [x] 提交 `bd67669` 并推送定制分支，发布 GitHub `v0.1.0`；Vercel 生产与预览部署均成功，公开域名、四只角色、文章、作品、瞬间、RSS、sitemap 和 canonical 已核对

## Task 58: 统一四只角色的纸感画风

**Acceptance criteria:** 首页四处仍分别出现咕咕嘎嘎、Doro、菲比啾比、弗糯糯；四只均来自站主认可的同一张透明视觉稿。角色没有素材来源外链、独立展区或额外交互按钮。桌面与手机不遮挡正文，减少动态效果时没有位移动画。

- [x] 先更新组件与浏览器断言，确认原图及 Doro 播放控件不满足新要求（聚焦测试先失败）
- [x] 接入本地统一素材，简化角色组件和样式；桌面与 375px 手机截图确认四只独立显示
- [x] 聚焦测试、typecheck、lint、79 个单测、build 和 29 个浏览器测试通过

## Task 57: 全站导航图标与能力页精简

**Acceptance criteria:** 全站导航五个入口显示对应小图标且保留文字和原有链接；图标不重复朗读，手机端无横向滚动。能力页每份档案不再显示标题下摘要或底部“查看相关作品与实践”，正文和目录锚点保持正常。

- [x] 先更新能力页与浏览器断言，确认旧页面不满足要求（旧摘要仍显示）
- [x] 实现导航图标和能力页精简，检查桌面、375px 与 320px 手机实图
- [x] 通过 79 个单测、29 个浏览器测试、typecheck、lint 和 build

## Task 56: 关于页链接识别

**Acceptance criteria:** `/about` 联系方式的邮箱和账号主页链接常显下划线；外部账号链接有小箭头；悬停和键盘聚焦状态清楚。链接目的地不变，手机端无横向滚动。

- [x] 先添加浏览器断言并确认旧样式不满足要求（邮箱和账号链接没有下划线）
- [x] 调整关于页链接样式，检查桌面和手机实图
- [x] 通过定向测试、79 个单测、29 个浏览器测试、typecheck、lint 和 build

## Task 55: 关于页联系方式

**Acceptance criteria:** `/about` 只显示联系方式章节，保留邮箱与微信，不再显示公开介绍或自链接。收到站主明确的 Bilibili 与 GitHub HTTPS 主页后加入并校验；手机端无横向滚动。公开资料过滤仍生效。

- [x] 先更新页面与浏览器测试，确认旧介绍仍显示（定向测试按新要求失败）
- [x] 精简公开资料并更新关于页
- [x] 加入站主确认的 GitHub 与 Bilibili 精确链接；79 个单测、29 个浏览器测试、typecheck、lint 和 build 通过，桌面与手机实图已检查

## Task 54: 每日一言出处文案

**Acceptance criteria:** 每日一言保留原句的 HTTPS 出处链接，显示“出处”而非“核对出处”；作品名称仍通往对应瞬间。空状态不向访客发出查看提示。

- [x] 先调整测试并确认旧文案不满足要求（3 个定向测试按新要求失败）
- [x] 修改文案并保持链接目的地
- [x] 通过定向测试、79 个单测、29 个浏览器测试、typecheck、lint 和 build

## Task 53: 首页视觉改稿

**Acceptance criteria:** 首页以写作与作品为主，首屏每日一言和咕咕嘎嘎自然融入；文章、作品、能力、瞬间区块具有可区分的节奏。四只角色、AI 标识、原有链接和作品图片比例保留；手机端无横向滚动，键盘与减少动效行为正常。

- [x] 调整首页组件结构与样式，不添加未经确认的内容；移除首页能力状态徽标，保留来源元数据
- [x] 检查桌面、平板、手机实图并修整细节；浏览器截图确认四只角色与瞬间图片加载
- [x] 通过相关测试、typecheck、lint、79 个单测、29 个浏览器测试和 build

## Task 52: 前端结构评审与旧样式清理

**Acceptance criteria:** 用真实桌面/手机页面提出具体视觉评价和可选择的改进方向；删除已确认无引用的旧首页 CSS，保留当前页面视觉、内容和交互。测试、类型检查、lint 与构建通过。

- [x] 检查首页桌面与手机、能力页、文章页截图和依赖、内容加载路径
- [x] 删除 130 行无引用旧样式；首页前后截图尺寸一致，差异仅在角色动画位置
- [x] 通过 79 个单测、typecheck、lint 和 build，记录后续架构优化建议

## Task 51: 关于页引言精简

**Acceptance criteria:** `/about` 仅保留页面标题及已有公开资料章节；截图中的自我说明和资料状态提示不再显示。公开资料过滤、联系方式与手机端排版保持正常。

- [x] 更新页面与浏览器测试，先确认旧文案仍显示（定向测试按新要求失败）
- [x] 删除说明区块及专用样式
- [x] 通过 focused test、typecheck、lint、全量测试、浏览器测试和 build（79 个单测、29 个浏览器测试通过；桌面与手机截图已检查）

## Task 50: 内页统一阅读布局

**Acceptance criteria:** 文章、作品、关于和瞬间内页采用适中标题、细分隔线和单列阅读布局；无英文装饰标签、重复精选徽标、文件名式来源标签或作品大边框卡。首页内容和能力页维持现状；AI 标识、已批准外链、匿名说明与阅读流程保留，手机端无横向滚动。

- [x] 先更新页面测试，确认旧标签仍存在（4 个测试按新要求失败）
- [x] 调整共用样式和页面组件，保持原文与公开边界
- [x] 通过 focused test、typecheck、lint、全量测试、浏览器测试和 build，检查桌面与手机截图（79 个单测、29 个浏览器测试通过）


## Task 49: 能力页引言文案

**Acceptance criteria:** `/capabilities` 标题下方显示“记录我感兴趣的，尝试做的，做过的所有~”。

- [x] 更新页面文案并确认旧句消失
- [x] 运行相关测试、类型检查、lint 和 build，并确认本地页面显示新文案


## Task 48: 能力页标题精简

**Acceptance criteria:** 六份能力档案直接显示标题，详情页无编号、圆点或状态文案；首页状态展示和能力元数据保留。锚点、内容、更新时间及分支不变。

- [x] 先修订测试确认现状不符合要求
- [x] 删除详情页标志与专用样式
- [x] 通过 focused test、typecheck、lint、全量测试、浏览器测试和 build（79 个单测、29 个浏览器测试通过）


## Task 47: 能力页阅读布局

**Acceptance criteria:** 能力页显示简洁标题与横向可换行目录，没有 CAPABILITY / EVIDENCE、FIELD INDEX 或侧边框卡；六份能力原文、状态、时间、分支和锚点均保留。手机端无横向滚动，目录键盘可用。

- [x] 先修订页面测试并确认失败
- [x] 调整能力页结构与专用样式，不修改 MDX 内容
- [x] 运行 focused tests、typecheck、lint、全量测试、浏览器测试和 build，并查看桌面/手机截图（79 个单测、29 个浏览器测试通过）


## Task 46: 角色融入首页内容

**Acceptance criteria:** 首页没有独立「可爱小队」展区；咕咕嘎嘎、Doro、菲比啾比、弗糯糯分散在自述、最新文章、精选作品、瞬间区域的标题附近。图片不带外链，装饰不遮挡正文或链接；Doro 可暂停且减少动态效果时静止；手机端无横向滚动。

- [x] 先修订首页测试使其要求融入式布局，并确认失败
- [x] 替换独立展览组件与样式
- [x] 运行相关单测、类型检查、lint、浏览器验证和 build（79 个单测、29 个浏览器测试通过）


## Task 45: 首页角色小队预览

**Acceptance criteria:** 首页末尾出现咕咕嘎嘎、Doro、菲比啾比、弗糯糯；各卡片展示候选图、角色名和来源链接。图片由站点本地提供，窄屏可换行，减少动态效果设置能停止附加的 CSS 动画。素材标识为预览候选，不暗示原创或授权。

- [x] 先添加失败的组件测试，覆盖四个角色、图片、来源和页面顺序
- [x] 增加本地素材、组件与样式
- [x] 运行 focused test、typecheck、lint、全量测试、浏览器测试和 build，并检查本地预览（79 个单测、28 个全站浏览器测试与 5 个首页浏览器测试通过）


## Task 44: 移除访客问答 Agent

**Description:** 按站主最新决定删去访客提问功能和专用依赖，保持博客、作品、能力、瞬间、关于页及每日一言可用。

- [x] 先写失败测试：全站没有问答入口，`/api/agent` 不存在，关于页仍只展示 public 资料
- [x] 删除 Agent UI、API、模型适配、检索、限流、专用样式与图片；保留专业能力内容
- [x] 清理环境变量、README、隐私和部署文档，保留历史任务验证记录
- [x] 完成 focused test、typecheck、lint、全量测试、浏览器测试和 build

以下已完成任务保留为历史记录，不再要求保留 Agent 功能。

> 历史状态：Tasks 1–25、27 已完成；Task 26 技术验收已完成，等待真实 Cloudflare 冒烟与用户内容终审；未部署
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
- [x] 页面展示标题、更新时间、状态、分支、正文和相关内容入口
- [x] 核心内容无需 hover、拖拽或动画即可读取，键盘顺序清晰
- [x] 无内容时显示稳定空状态，不伪造能力信息

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/capabilities-page.test.tsx`
- [x] 类型与 Lint：`npm run typecheck`、`npm run lint`
- [x] Chrome 检查：375px、768px、1440px 无横向溢出

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
- [x] 六个领域完整出现且 order、featured 与更新时间合法
- [x] 网络安全故事不包含服务器、账号、漏洞或攻击步骤
- [x] Agent、算法和体系结构内容不使用“精通”等无证据表述

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/capabilities-content.test.ts tests/capabilities-page.test.tsx`
- [x] 内容扫描：搜索真实身份、机构、私人联系方式与示例占位符
- [x] 人工检查：每项均有理解、实践、边界/失败和下一步

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
- [x] 作品列表不再包含 `【示例】`、`example.com` 或示例 GitHub 地址
- [x] 三个项目不出现学校、协会全称、真实姓名、实习单位或未批准外链
- [x] 团队项目不声称独立完成，fork 和失败尝试不作为原创成果

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/projects.test.tsx tests/home-content.test.tsx`
- [x] 构建成功：`npm run build`
- [x] 人工来源核对：职责与结果能追溯到用户确认材料或公开仓库

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
- [x] 首页从能力内容源读取三个 featured 领域，不硬编码事实
- [x] 首页和导航均可进入 `/capabilities`，当前页与键盘焦点状态清楚
- [x] 没有 featured 能力时提供稳定空状态

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/home-content.test.tsx tests/site-shell.test.tsx`
- [x] 类型与 Lint：`npm run typecheck`、`npm run lint`
- [x] Chrome 检查：首页各目标视口无溢出且入口可用

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
- [x] 能力问题召回对应档案并提供 `/capabilities` 引用
- [x] 隐藏身份问题在无公开资料时直接拒答，不调用 Provider
- [x] 能力回答保留自我评价和事实边界，不把下一步计划描述成已完成经历

**Verification:**
- [x] 聚焦测试：`npm run test -- --run tests/retrieval.test.ts tests/agent-api.test.ts`
- [x] 自动化评测：六个领域问题召回正确来源，身份问题全部拒答
- [x] 人工检查：响应不包含未授权身份和机构信息

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
- [x] README 与内容指南准确说明能力文件、匿名规则和无外链作品
- [x] 公开内容、构建产物与 Agent 测试响应不包含禁止公开的信息
- [x] 六个能力、三个作品及首页路径在目标视口和键盘流程完整可用

**Verification:**
- [x] 全量检查：`npm run typecheck`、`npm run lint`、`npm run test -- --run`、`npm run build`
- [x] 全量 E2E：`npx playwright test`
- [x] 技术人工审计：搜索 demo 标识、待填写内容、身份线索、构建产物和外部链接
- [ ] 站主内容终审：确认公开叙事、能力状态、作品职责与隐私口径

**Dependencies:** Tasks 23, 24, 25

**Files likely touched:**
- `README.md`
- `docs/content-guide.md`
- `docs/privacy.md`
- `tests/e2e/capabilities.spec.ts`
- `tests/production-meta.test.ts`

**Estimated scope:** Medium (5 files)

## Task 27: 标注已批准项目外链并补齐自助维护入口

**Description:** 将站主明确批准的项目演示与源码地址加入三个作品，并把常用内容文件、字段和验证方式整理成可直接照做的维护入口。

**Acceptance criteria:**
- [x] 校园开源镜像站显示批准的源码链接
- [x] 开源自学文档显示批准的演示与源码链接
- [x] blog-template 显示批准的源码链接
- [x] 公开内容隐私测试只允许规格中列出的项目 URL，不放宽到任意账号或外链
- [x] README 与内容指南明确文章、作品、能力、关于资料和图片分别在哪里修改

**Verification:**
- [x] RED：作品内容测试在链接尚未写入时失败
- [x] GREEN：`npm run test -- --run tests/projects.test.tsx tests/public-content-privacy.test.ts`
- [x] 质量检查：`npm run typecheck`、`npm run lint`、`npm run test -- --run`、`npm run build`
- [x] 浏览器检查：三个作品的外链标签、地址和安全属性正确

**Dependencies:** Task 26 technical verification

**Files likely touched:**
- `docs/spec.md`
- `tasks/plan.md`
- `tasks/todo.md`
- `content/projects/*.mdx`
- `tests/projects.test.tsx`
- `tests/public-content-privacy.test.ts`
- `README.md`
- `docs/content-guide.md`
- `docs/privacy.md`

**Estimated scope:** Small

## Task 28: 补充 FPGA Verilog 智能小车与第八日餐厅

**Description:** 根据站主确认和公开仓库证据新增两个作品详情，保持首页精选不变，并显式记录团队、fork、参考实现和未完成功能边界。

**Acceptance criteria:**
- [x] `/projects` 从内容源加载五个项目，并可进入两个新增详情页
- [x] FPGA Verilog 智能小车展示 Nexys A7-100T、Verilog/VHDL、外设联调与已知未完成边界
- [x] 第八日餐厅展示 Vue 3/UniApp 前端、Express/PostgreSQL 后端和站主前后端提交
- [x] OctodayMenu 明确标注 fork/团队边界，FPGA 项目不把参考实现写成个人原创
- [x] 两个项目只提供规格批准的源码链接，不新增演示或个人主页链接
- [x] 站主现有未提交内容改动保持不变

**Verification:**
- [x] RED：作品测试在两个内容文件尚未存在时失败
- [x] GREEN：`npm run test -- --run tests/projects.test.tsx`
- [x] 链接白名单测试包含两个新增精确 URL
- [x] 类型、Lint、构建及其余测试运行
- [x] 浏览器检查：五张作品卡、两个详情页及外链标签可访问

**Dependencies:** Task 27

**Files likely touched:**
- `docs/spec.md`
- `tasks/plan.md`
- `tasks/todo.md`
- `content/projects/fpga-smart-car.mdx`
- `content/projects/octoday-menu.mdx`
- `README.md`
- `docs/privacy.md`
- `tests/projects.test.tsx`
- `tests/public-content-privacy.test.ts`
- `tests/e2e/projects.spec.ts`

**Estimated scope:** Small

## Task 29: 取消能力必需标题并安全接受空草稿

**Description:** 以站主当前编辑内容为事实来源，取消能力正文的固定四标题校验；允许空摘要和空 profile 草稿，同时在公开页面与 Agent 来源中省略空内容。

**Acceptance criteria:**
- [x] 能力正文不再要求“我的理解 / 做过的事 / 边界与失败 / 下一步”
- [x] 文章、作品和能力 `summary: ""` 可以加载，页面不渲染空摘要段落
- [x] 空的公开 profile 文件不出现在关于页或 Agent 来源中
- [x] 不恢复站主删除的 FAQ、正文、标题或措辞
- [x] 结构化安全字段与项目链接白名单继续校验

**Verification:**
- [x] RED：空摘要、自由能力标题和空 profile 的聚焦测试先失败
- [x] GREEN：相关内容加载、页面与 Agent 来源测试通过
- [x] 全量类型、Lint、单元/组件、浏览器与生产构建通过

**Dependencies:** Task 28

**Files likely touched:**
- `docs/spec.md`
- `tasks/plan.md`
- `tasks/todo.md`
- `AGENTS.md`
- `lib/content/schema.ts`
- `lib/content/capability-schema.ts`
- `lib/content/capabilities.ts`
- `lib/content/load.ts`
- `components/PostCard.tsx`
- `components/BlogArticle.tsx`
- `app/blog/[slug]/page.tsx`
- `tests/*.test.tsx`
- `docs/content-guide.md`

**Estimated scope:** Medium

## Task 30: 提交定制分支并更新 `zhujiechong.org` 部署说明

**Description:** 将站主已审核的定制内容、两个新增作品和自由草稿规则提交到当前功能分支，推送同名远程分支，并记录 Cloudflare DNS + Vercel 的部署路径；本任务不执行生产部署。

**Acceptance criteria:**
- [x] 规格记录 `zhujiechong.org` 已购入、Cloudflare 管理 DNS、Vercel 为首选托管平台
- [x] 站主主动标记 public 的联系方式视为明确授权公开，未授权身份信息继续受保护
- [x] 提交前通过类型、Lint、测试、构建、浏览器和秘密检查
- [x] 本地 `feature/disco-customization` 推送到 `origin/feature/disco-customization`
- [x] 部署指南说明 Preview 优先、使用 Vercel 给出的项目专属 DNS 记录及生产 `SITE_URL`
- [x] 不创建 Vercel 预览或生产部署

**Verification:**
- [x] `git diff --cached` 范围和公开内容经过检查
- [x] `git ls-files .env*` 仅包含无秘密的示例文件
- [x] 远程分支已创建并将在本任务收尾提交后再次校验 HEAD

**Dependencies:** Task 29

**Estimated scope:** Small

## Task 31: 以站主最新文本更新 FPGA 小车公开边界

**Description:** 以站主对 FPGA 小车作品页的直接编辑为公开内容事实来源，删除不再希望公开的攻击信号未完成细节，同时保留团队协作与参考实现披露。

**Acceptance criteria:**
- [x] 不恢复站主从 `content/projects/fpga-smart-car.mdx` 删除的文本
- [x] FPGA 小车仍说明团队课程设计边界
- [x] FPGA 小车仍说明摄像头与无线控制参考了外部实现
- [x] 规格不再强制公开被删除的攻击信号细节
- [x] 项目外链、其他作品与隐私边界保持不变

**Verification:**
- [x] RED：旧 E2E 断言因找不到“攻击信号存在问题”而失败
- [x] GREEN：聚焦项目 E2E 通过
- [x] 类型、Lint、测试与构建通过
- [x] 提交内容与敏感信息检查通过

**Dependencies:** Task 30

**Estimated scope:** Small

## Task 32: 将阿竹替换为咕咕嘎嘎企鹅助手

**Description:** 使用站主已确认的企鹅形象预览，统一站点助手名称、图片、无障碍名称、模型提示词、错误文案和维护说明。

**Acceptance criteria:**
- [x] 站点显示已确认的透明企鹅素材，且小尺寸入口可辨认
- [x] 页面、对话和 API 文案统一使用“咕咕嘎嘎”；旧称仅留在历史任务记录
- [x] 原有拒答、引用、隐私、无持久化与免费额度规则保持有效
- [x] README 和模板定制步骤指向新素材与名称

**Verification:**
- [x] 新名称的聚焦测试先失败，再通过
- [x] 类型、Lint、单元/组件、E2E、构建及手机/桌面浏览器检查通过

## Task 33: 文章优先的首页与阅读体验

**Description:** 以简洁的个人站结构重新组织首页，让站主文章成为第一阅读路径，保留作品、能力与助手入口。

**Acceptance criteria:**
- [x] 首页第一屏有明确的写作入口，近期文章先于作品和能力
- [x] 文章列表与正文在手机和桌面均易读，梗元素不打断阅读
- [x] 不复制参考站品牌、文案或具体布局

## Task 34: 支持中文文章文件名

**Description:** 当前内容加载器拒绝站主新增的中文命名文章，导致首页与构建失败。允许安全的汉字 slug，同时保留路径穿越防护。

**Acceptance criteria:**
- [x] 中文文件名文章可加载、链接与生成详情页
- [x] 路径分隔符、点号、百分号等危险 slug 继续被拒绝
- [x] 不改写站主文章正文或文件名（仅将原文中 MDX 无法解析的 `<bmc>` 转义为等效显示）

**Verification:**
- [x] 中文 slug 测试先失败，再通过
- [x] 全量内容测试与构建通过

## Task 35: 同步站主当前作品公开边界

**Description:** 站主确认保留对 FPGA 小车和第八日餐厅说明文字的删除；以当前作品文件为公开文本来源，更新规格与浏览器验收，不补写删除的归属和参考来源句子。Task 31 的勾选记录是当时的验收历史，由本任务的新决定取代其公开文案要求。

**Acceptance criteria:**
- [x] 不恢复站主删除的作品正文
- [x] FPGA 小车页面仍标明团队项目，第八日餐厅仍标明 fork 身份
- [x] 两个作品只显示规格批准的对应源码 HTTPS 链接
- [x] 浏览器测试不再要求已删除的句子

**Verification:**
- [x] 现有浏览器测试因旧句子缺失失败，再按新规格通过
- [x] 全量 E2E 与相关质量门通过

## Task 36: 精简首页描述并改造灵感展览

**Description:** 按站主截图删除首页主标题上的小描述和灵感区的小标签与图片说明；将灵感区标题改为“那些打动我的瞬间”，用可扩展的卡片布局展示现有截图。

**Acceptance criteria:**
- [x] 首页不再显示截图圈出的小描述和灵感标签
- [x] 灵感区标题准确，现有图片在卡片中完整显示，出处与用途仍可供辅助技术读取
- [x] 375px、768px、1440px 布局无溢出，卡片不干扰阅读

**Verification:**
- [x] 相关组件/浏览器测试先失败，改动后通过
- [x] 类型、Lint、测试、构建及浏览器检查通过

## Task 37: 网站只发布两个作品

**Description:** 首页、作品列表、详情路由、站点地图与 Agent 来源只暴露镜像站和 FPGA 小车；其他作品文件继续保存在仓库中作为未发布草稿。

**Acceptance criteria:**
- [x] 镜像站和 FPGA 在首页及作品列表可见，对应详情和已批准链接可访问
- [x] 其余三项不出现在作品列表、详情路由、站点地图或 Agent 来源
- [x] `published: false` 的作品文件保留原正文；新作品默认可发布

**Verification:**
- [x] 公开过滤和详情路由测试先失败，改动后通过
- [x] 全量相关质量门通过

## Task 38: 删除两篇占位文章

**Description:** 删除没有正文的两篇示例文章，保留站主的运维日志，更新文章列表、首页、RSS、站点地图及 Agent 来源的验收口径。

**Acceptance criteria:**
- [x] 两篇占位 MDX 删除，文章列表与首页仅显示站主现有日志
- [x] 两个旧详情地址返回 404，RSS、站点地图与 Agent 来源不再引用它们

**Verification:**
- [x] 相关测试先失败再通过
- [x] 全量相关质量门通过

## Task 39: 可点击的“那些打动我的瞬间”卡片

**Description:** 建立 `content/moments/*.mdx` 内容源与独立详情页；现有《极乐迪斯科》卡片可打开详情，感受正文留空供站主填写。

**Acceptance criteria:**
- [x] 首页卡片支持鼠标和键盘打开详情，详情可返回展览
- [x] 页面展示既有图片、标题和素材出处；不生成站主感想
- [x] 文件中的后续 MDX 正文可在详情渲染，非法 slug 返回 404
- [x] 详情进入站点地图，新卡片无需改组件即可出现

**Verification:**
- [x] 内容、页面与浏览器测试先失败再通过
- [x] 类型、Lint、单元/组件、E2E、构建及手机/桌面浏览器检查通过

## Task 40: 运维日志 AI 创作署名

**Description:** 站主确认现有运维日志由 Codex 按要求撰写。给该篇文章记录“Codex（基于 GPT-6）”并在所有阅读入口清楚标注 AI 创作。

**Acceptance criteria:**
- [x] 仅该篇文章的 frontmatter 记录 AI 创作模型，其他文章保持未标记
- [x] 首页卡片、文章列表和详情页都显示“AI 创作 · Codex（基于 GPT-6）”
- [x] 标识可被辅助技术读取，正文事实不改写
- [x] 内容维护指南说明如何给今后的 AI 创作文章署名

**Verification:**
- [x] 聚焦测试先失败再通过
- [x] 类型、Lint、单元/组件、E2E、构建及手机/桌面浏览器检查通过

## Task 41: 从瞬间摘录每日一言

**Description:** 用站主从 `content/moments/*.mdx` 亲自挑选的句子替换首页介绍。借鉴续火花项目“一言”的用途，但保持本站内容来源可追溯、无需外部 API。

**Acceptance criteria:**
- [x] 首页原自述移除，改为“每日一言”；尚无句子时只显示空状态及瞬间入口
- [x] `dailyQuotes` 元数据可选；有句子时显示正文原句并链接来源详情，拒绝空白和不在正文中的摘录
- [x] 句子按 Asia/Shanghai 日期稳定轮换，不存访客状态或请求外部 API
- [x] 内容指南说明站主写完正文后如何挑选句子

**Verification:**
- [x] 内容校验、日期选择和首页测试先失败再通过
- [x] 类型、Lint、单元/组件、E2E、构建及手机/桌面浏览器检查通过

## Task 42: 每日一言 AI 审读维护流程

**Description:** 站主写完瞬间正文后，由 Codex 分析并提出原文候选；站主不必自行摘句。现阶段只固定工作流程，正文尚未写完，不提前生成候选。

**Acceptance criteria:**
- [x] 规格与内容指南说明 Codex 提议、站主选择、再写入 `dailyQuotes` 的顺序

## Task 43: 作品引语每日一言

**Description:** 按站主最新要求，从喜欢的作品中搜索可核对的短句；每日一言与站主尚未写的感受解耦。

- [x] 先以失败测试覆盖独立引语源、作品及核对链接，以及北京时间轮换
- [x] 移除瞬间正文摘录限制，建立经核对的静态作品引语清单；首页显示作品归属和出处入口
- [x] 更新内容指南，说明新增作品时的搜索和核对流程，无需 API 或 MCP
- [x] 运行相关测试、类型检查、lint、构建和完整浏览器测试
- [x] 候选必须逐字来自瞬间正文并附对应来源，不创造站主未写的感受
- [x] 网站的每日轮换维持确定性，不在访客请求中实时调用模型

**后续输入：** 站主写完或发送瞬间正文后执行实际审读与摘录；目前没有可审读的正文。
