# Implementation Plan: zhujiechong 个人博客与卡通 Agent

> 状态：已批准  
> 规格来源：`docs/spec.md`  
> 计划日期：2026-07-30

## Overview

从空仓库建立一个 Next.js + TypeScript 个人博客，交付首页、博客、作品集、关于页、RSS、基础 SEO，以及全站可访问的像素机器人“阿竹”。内容由 Markdown/MDX 文件管理；Agent 对个人问题只基于授权资料回答，对专业问题可补充模型通用知识。模型调用使用 Cloudflare Workers AI 免费计划中的 Qwen3 30B，并通过可替换的服务端适配层接入。

本计划只描述实施，不包含任何生产部署或付费升级授权。

## Architecture Decisions

- **单体全栈应用：** Next.js App Router 同时承载静态内容页面和 `/api/agent` 服务端接口，减少首版部署单元。
- **内容即代码：** `content/` 下的 MDX 文件是文章、作品和个人资料的单一事实来源；元数据进入页面前使用 Zod 校验。
- **轻量检索：** 首版不使用数据库或向量服务。资料加载后按标题、标签、词项与中文字符片段评分，选择有限上下文；小规模资料可审计且无额外服务成本。
- **供应商隔离：** Agent UI 和检索逻辑只依赖内部 `ModelProvider` 接口；Cloudflare REST 实现由环境变量选择模型，便于以后更换。
- **免费额度安全失败：** 429、配额耗尽、上游不可用和超时均转换为稳定错误类型；不自动启用付费能力。
- **基础滥用防护：** 限制问题长度、上下文量、输出量和超时；采用实例内 IP 滑动窗口与客户端冷却。该方案不保证跨所有 Vercel 实例的全局限流，但满足无外部存储的首版“基础限流”。
- **隐私默认：** 不持久化访客问题或回答，不把密钥发送到浏览器，不在应用日志中记录完整对话内容。
- **视觉实现：** 暖白纸张布局、蓝色/珊瑚色点缀，辅以深色终端细节；“阿竹”使用独立可替换的原创像素素材，动画尊重减少动态效果设置。

## Dependency Graph

```text
项目脚手架与测试基线
    │
    ├── 视觉令牌与全站外壳
    │       ├── 首页精选内容
    │       └── Agent 全站入口
    │
    └── 内容模型与加载器
            ├── 博客列表/详情 ── RSS/SEO
            ├── 作品列表/详情 ── 首页精选内容
            └── 个人资料模板 ── 轻量检索
                                      │
Cloudflare Provider 接口与模拟实现 ───┤
                                      ▼
                              Agent API 与安全边界
                                      │
                                      ▼
                              Agent 对话 UI 与 E2E
                                      │
                                      ▼
                         可访问性、性能、文档与发布检查
```

## Task List

### Phase 1: Foundation

- [x] Task 1: 初始化 Next.js 与工程命令
- [x] Task 2: 建立自动化测试基线
- [x] Task 3: 实现 D 视觉方向与响应式全站外壳

### Checkpoint: Foundation

- [x] `npm run typecheck`、`npm run lint`、`npm run test -- --run` 和 `npm run build` 通过
- [x] 首页外壳在桌面与手机视口可用
- [x] 依赖与精确版本锁定在 lockfile

### Phase 2: Content Slices

- [x] Task 4: 建立内容契约与安全加载器
- [x] Task 5: 交付博客列表到详情的完整切片
- [x] Task 6: 补齐博客样例、RSS 与文章元数据
- [ ] Task 7: 交付作品列表到详情的完整切片
- [ ] Task 8: 补齐作品样例与首页精选区
- [ ] Task 9: 交付关于页与授权个人资料模板

### Checkpoint: Content

- [ ] 3 篇示例文章与 3 个示例作品无需页面代码即可替换
- [ ] 文章、作品、关于页、RSS 和分享元数据可访问
- [ ] 草稿与非法元数据不会进入生产页面

### Phase 3: Agent Slice

- [ ] Task 10: 实现授权资料检索与引用
- [ ] Task 11: 实现模型供应商接口及 Cloudflare 适配器
- [ ] Task 12: 实现 Agent API、输入防护与基础限流
- [ ] Task 13: 生成“阿竹”像素素材并实现可访问对话面板
- [ ] Task 14: 串联问答、引用和失败状态的端到端流程

### Checkpoint: Agent

- [ ] 模拟 Provider 下已知、未知、专业与注入型问题测试通过
- [ ] 有凭据时完成一次 Cloudflare Workers AI 真实冒烟测试
- [ ] 无凭据、免费额度耗尽或上游失败时网站仍安全可用

### Phase 4: Production Readiness

- [ ] Task 15: 完成站点 SEO、错误边界与安全响应头
- [ ] Task 16: 完成跨视口、键盘和减少动画的浏览器验收
- [ ] Task 17: 完成维护、环境变量与部署文档

### Checkpoint: Complete

- [ ] 规格中的全部成功标准有测试或人工验证证据
- [ ] 全量类型检查、Lint、单元/组件测试、E2E 和生产构建通过
- [ ] 未配置任何自动付费或对话持久化能力
- [ ] 用户评审通过后才进入预览或生产部署

## Verification Strategy

- **每个任务：** 运行聚焦测试，并执行与改动相关的类型检查或构建。
- **每个阶段：** 运行 `npm run typecheck`、`npm run lint`、`npm run test -- --run`、`npm run build`。
- **Agent 阶段：** 默认用确定性的模拟 Provider 测试；真实 Cloudflare 调用只作为凭据就绪后的冒烟测试，不让测试套件依赖外网。
- **最终阶段：** 运行 `npx playwright test`，并在真实浏览器中检查控制台、网络错误、键盘导航和关键响应式视口。
- **完成标准：** 每个任务同时满足其验收条件和项目统一 Definition of Done；任何未验证的行为不得标记完成。

## Parallelization Opportunities

在基础契约稳定后，以下工作理论上可并行：

- Task 5–6（博客）与 Task 7–8（作品集），共享内容契约但不共享页面实现。
- Task 10（检索）与 Task 11（Provider），在 `ModelProvider` 输入输出契约固定后可独立完成。
- Task 13 的像素素材生成可与 Task 12 的 API 实现并行。

以下必须顺序执行：

- Task 1–4 是后续工作的基础。
- Task 12 依赖 Task 10 和 Task 11。
- Task 14 依赖 Agent API 与 UI。
- Task 16–17 依赖所有核心功能稳定。

不会自动启动并行 Agent；只有用户明确要求委派或并行 Agent 工作时才启用。

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Cloudflare 免费配额或模型可用性变化 | 高 | Provider 适配层、环境变量模型 ID、模拟回退和明确错误状态；不自动付费 |
| 免费额度被公开访客滥用 | 高 | 输入/输出上限、实例内 IP 限流、客户端冷却；上线流量增长后再批准外部全局限流存储 |
| 空白个人资料导致 Agent 无法回答 | 中 | 提供结构化模板、示例资料和“不知道”路径；上线前由站主替换 |
| 小规模关键词检索漏掉中文语义 | 中 | 中文字符片段评分、标题/标签加权、检索单测；资料增长后用评测决定是否引入向量检索 |
| MDX 内容包含危险元素 | 中 | 不允许任意动态导入或脚本；限制可用组件并校验 frontmatter |
| `next-mdx-remote` 已归档 | 中 | 首版锁定 v6、仅渲染仓库内可信内容且保持 JavaScript 阻断；发布前技术复核是否迁移到核心 MDX 库 |
| 生成的卡通素材与页面风格不一致 | 低 | 先按已确认的 D 方向生成单一角色资产，人工视觉检查后再接入 |
| Vercel 多实例使内存限流不一致 | 中 | 明确其为首版基础防护且不会产生费用；若需要全局强限流，另行批准外部存储 |

## External Inputs Needed During Implementation

- Cloudflare Account ID 与 Workers AI API Token：仅在 Task 11/14 的真实冒烟测试和最终部署时需要；不得提交仓库。
- 真实个人资料、作品和文章：不阻塞技术实现，首版使用显著标注的示例内容和填写模板。
- Vercel 账号与部署授权：只在用户要求实际部署时需要。

## Open Questions

无阻塞计划评审的问题。以下默认值已记录，改变时先更新规格：

- 首版不展示保密项目。
- 首版为中文，不含联系表单和站点统计，提供 RSS。
- 首版只做实例内基础限流，不引入外部数据库或限流服务。
- 实际生产部署需单独得到用户授权并取得所需账号配置。
