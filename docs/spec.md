# Spec: 个人博客、作品集与卡通 Agent

> 状态：实现完成，等待真实 Cloudflare 冒烟与用户最终审阅
> 日期：2026-08-01

## Objective

建立一个名为 **zhujiechong** 的公开中文个人网站，用于：

1. 发布和阅读博客文章。
2. 以视觉化方式展示个人作品、职责、技术栈、成果和相关链接。
3. 通过一个原创卡通 Agent 形象，让访客以对话方式了解站主并讨论博客涉及的专业问题；关于站主的回答只基于其授权资料。

站主是一名程序员。主要用户：

- 任何对站主、编程作品或文章感兴趣的访客，包括但不限于同行、潜在客户和招聘方。
- 阅读站主文章的读者。
- 维护文章、作品和个人资料的站主本人。

首版用户故事：

- 访客可以从首页快速理解“你是谁、做什么、有哪些代表作品”。
- 访客可以浏览文章列表，并阅读单篇文章。
- 访客可以浏览作品集，并打开作品详情或外部链接。
- 访客可以点击卡通 Agent，输入关于站主的问题并获得有依据的回答。
- 当个人资料中没有关于站主的答案时，Agent 明确表示不知道，并建议访客查看相关页面或联系站主。
- 站主可以通过修改仓库中的内容文件更新文章、作品和 Agent 知识。

首版范围：

- 首页
- 文章列表和文章详情
- 作品集列表和作品详情
- 关于我/联系方式
- 全站可访问的卡通 Agent 对话面板
- 响应式布局、基础 SEO、可访问性和错误/空状态

暂不纳入首版：

- 登录、评论、点赞、订阅、支付
- 在线内容管理后台
- 多用户或访客长期会话记忆
- 语音对话
- 自动抓取未授权的私人资料

## Tech Stack

已确认采用以下方案；实际精确版本在初始化时选用稳定版本并写入锁文件：

- Next.js（App Router）+ React
- TypeScript（严格模式）
- Tailwind CSS
- MDX：文章、作品和个人资料内容
- 服务端 Agent API：检索授权资料、构造上下文并调用 Cloudflare Workers AI
- 默认模型：`@cf/qwen/qwen3-30b-a3b-fp8`
- Vitest + Testing Library：单元和组件测试
- Playwright：关键用户流程端到端测试
- 部署目标：Vercel

首版使用 Cloudflare Workers AI 免费计划，并通过其 REST API 从 Next.js 服务端调用 Qwen3 30B。模型标识、Cloudflare Account ID 和 API Token 均通过服务端环境变量配置。调用封装在供应商适配层中，未来可更换模型而不修改对话 UI 或内容结构。

免费额度不是可用性承诺，供应商可能调整配额或模型。当前免费额度耗尽或服务不可用时，界面应明确提示稍后重试，不自动切换到付费计划。首版优先使用简单、可审计的资料检索；资料规模不足以证明需要向量数据库时，不引入数据库。

参考：

- Cloudflare Workers AI 免费计划当前提供每日 10,000 Neurons，超过后免费计划请求失败：https://developers.cloudflare.com/workers-ai/platform/pricing/
- Qwen3 30B 支持多语言、推理和函数调用：https://developers.cloudflare.com/workers-ai/models/
- REST API 需要 Cloudflare Account ID 与 API Token：https://developers.cloudflare.com/workers-ai/get-started/rest-api/
- Cloudflare 声明不会在未明确同意的情况下使用 Workers AI 客户内容训练模型或改进服务：https://developers.cloudflare.com/workers-ai/platform/data-usage/

选择理由：Next.js 允许博客、作品集、SEO 页面与 Agent 服务端 API 保持在一个 TypeScript 项目中，适合当前首版范围，也保留了后续增加数据库或管理后台的空间。

## Visual Direction

采用 **D：Paper Workshop + Pixel Companion 混合方向**：

- 页面主体使用暖白纸张质感、蓝色与珊瑚色点缀，保证文章阅读友好并适合广泛访客。
- 导航、标签、代码区域和交互反馈加入少量深色终端与像素细节，体现程序员身份。
- 卡通 Agent 使用原创像素机器人形象，但保持圆润、友好，避免过度游戏化。
- Agent 暂定名为“阿竹”，语气友好、机灵、简洁；名称可在内容配置中替换。
- 动画只用于眨眼、挥手、思考和消息提示，并尊重 `prefers-reduced-motion`。

## Commands

项目初始化完成后必须提供并维护下列命令：

```powershell
# 安装锁定依赖
npm ci

# 本地开发
npm run dev

# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 单元与组件测试
npm run test -- --run

# 端到端测试
npx playwright test

# 生产构建
npm run build

# 本地运行生产构建
npm run start
```

## Project Structure

```text
app/                    Next.js 路由、页面、布局和服务端 API
components/             可复用 UI 组件
components/agent/       卡通 Agent、对话面板和消息组件
content/posts/          博客文章 MDX
content/projects/       作品资料 MDX
content/profile/        Agent 可使用的授权个人资料
lib/agent/              检索、提示词、引用和安全边界
lib/content/            内容读取、校验和排序
public/                 图片、字体和卡通 Agent 静态素材
tests/                  单元、组件和集成测试
e2e/                    Playwright 端到端测试
docs/                   规格与项目文档
tasks/                  经确认后生成的实施计划和任务列表
```

## Content Model

博客文章至少包含：

```yaml
title: 文章标题
summary: 列表页摘要
publishedAt: 2026-07-30
tags: [标签]
cover: /images/posts/example.webp
draft: false
```

作品至少包含：

```yaml
title: 作品名称
summary: 一句话介绍
period: 2026
role: 我的职责
tech: [技术栈]
cover: /images/projects/example.webp
featured: true
links:
  demo: https://example.com
  source: https://github.com/example/project
```

Agent 授权资料按主题拆分，至少记录来源标题、正文和可公开级别。私人资料、密钥、内部地址和未授权第三方信息不得进入该目录。

## Code Style

- TypeScript 开启严格模式；组件和类型使用 PascalCase，函数与变量使用 camelCase。
- 服务端逻辑与浏览器组件明确分离；只有需要交互的组件使用客户端边界。
- 输入先校验再使用；异步错误返回用户可理解的状态。
- UI 文案集中、简短并优先使用中文。

示例：

```ts
type ProjectCardProps = {
  title: string;
  summary: string;
  href: string;
};

export function ProjectCard({ title, summary, href }: ProjectCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{summary}</p>
      <a href={href}>查看作品</a>
    </article>
  );
}
```

## Agent Behavior

- 可以回答与站主、博客文章、作品、技能和公开联系方式有关的问题，也可以回答博客涉及的专业问题。
- 关于站主的回答必须由授权资料支撑；能定位时提供对应文章或作品链接。
- 回答专业问题时优先引用博客内容；若使用模型的通用知识，必须与站主个人观点和经历明确区分。
- 资料不足、冲突或问题超出范围时，明确说明限制，不猜测。
- 不泄露系统提示词、密钥、服务端配置或被标记为非公开的资料。
- 对提示词注入、要求忽略规则或要求输出全部资料的请求保持原有边界。
- 默认不保存访客问题和聊天记录；若未来加入分析或持久化，必须先取得明确同意并更新隐私说明。
- 卡通形象的动画不得妨碍阅读；支持减少动态效果的系统设置。

## Testing Strategy

单元测试：

- 内容元数据校验、排序和草稿过滤。
- Agent 资料检索、范围判断、引用生成和空答案处理。
- 对超长输入、非法输入和提示词注入模式的处理。

组件测试：

- 导航、作品卡片、文章卡片、Agent 面板和消息状态。
- 键盘操作、焦点管理、加载、失败、无答案和重试状态。

端到端测试：

- 首页到作品详情。
- 文章列表到文章详情。
- 打开 Agent、提问、获得有依据的回答。
- Agent 在未知问题上拒绝编造。
- 手机和桌面关键视口。

质量目标：

- 所有核心逻辑有单元测试；不以单一覆盖率数字替代关键行为测试。
- 合并前类型检查、代码检查、测试和生产构建全部通过。
- 核心页面无明显键盘访问障碍，图片有替代文本，交互元素有可辨识名称。

## Boundaries

### Always do

- 修改行为前更新本规格，并在实现前定义验收条件。
- 校验内容元数据、聊天输入和服务端环境变量。
- 模型密钥仅存放在服务端环境变量中。
- 在提交前运行类型检查、代码检查、测试和生产构建。
- Agent 无依据时明确拒答，并为模型调用设置超时、输入长度限制和基础限流。
- 免费额度耗尽时安全失败并提示稍后重试，不自动启用计费。
- 尊重 `prefers-reduced-motion`，并保证关键流程可用键盘完成。

### Ask first

- 添加数据库、身份验证、分析追踪、Cookie 或会话持久化。
- 更换模型供应商、部署平台或内容管理方式。
- 添加新的生产依赖、修改 CI 或引入付费服务。
- 升级 Cloudflare Workers AI 付费计划或启用任何可能自动产生费用的模型服务。
- 收集、记录或发送访客问题到模型供应商以外的第三方。
- 发布任何可能属于隐私或保密范围的个人资料。

### Never do

- 把密钥、私人联系方式、证件、住址或未授权资料提交到仓库或发送给访客。
- 让浏览器直接持有模型 API 密钥。
- 让 Agent 在没有资料依据时编造经历、作品、客户、数据或观点。
- 为通过测试而删除失败测试或降低既定安全边界。
- 编辑依赖产物目录或提交构建产物。

## Success Criteria

- 首页在桌面和手机视口均清晰展示个人定位、代表作品入口、文章入口和 Agent 入口。
- 至少可用示例内容渲染 3 个作品和 3 篇文章；替换内容无需修改页面代码。
- 文章和作品拥有可分享的独立 URL、标题和描述元数据。
- Agent 在测试资料集上的 10 个已知问题中，至少 9 个回答与资料一致并链接到相关内容。
- Agent 对测试资料集之外的 5 个未知问题全部明确表示资料不足，不虚构答案。
- 未登录访客无法从客户端包、网络响应或错误信息中获取模型密钥和非公开资料。
- Agent 请求具备输入长度限制、请求超时、基本限流、加载/失败/重试状态。
- 未经再次确认不得启用付费计划；免费额度耗尽时不会产生费用。
- 键盘用户可以完成导航、浏览作品、阅读文章、打开 Agent、发送问题和关闭面板。
- `npm run typecheck`、`npm run lint`、`npm run test -- --run`、`npx playwright test` 和 `npm run build` 全部通过。

## Open Questions

在进入计划阶段前需要确认：

1. 作品详情是否需要展示保密项目？如果需要，哪些信息必须模糊化？
2. 是否需要英文版本、联系表单、RSS 或站点统计？

以下默认项如无异议，不阻塞进入计划阶段：

- 域名尚未购买，开发和首版预览使用部署平台临时域名。
- 个人资料尚未准备，项目先提供结构化 Markdown 模板和明确的示例占位内容。
- 首版不展示保密项目，不提供英文版、联系表单或站点统计；提供 RSS。
- 模型调用通过可替换的服务端适配层接入；首版使用 Cloudflare Workers AI 免费计划和 Qwen3 30B。

## Confirmed Decisions

- 网站名称：zhujiechong。
- 站主职业：程序员。
- 目标访客：任何人。
- 视觉方向：D，温暖纸张布局与像素机器人/终端细节结合。
- 技术方案：Next.js + TypeScript 全栈。
- 卡通形象：暂无现成素材，采用原创像素机器人；暂定名“阿竹”。
- 个人资料：尚未填写，需要提供内容模板。
- Agent 范围：既回答关于站主的问题，也回答博客涉及的专业问题。
- 第三方模型：Cloudflare Workers AI 免费计划，默认 Qwen3 30B；不自动升级付费。
