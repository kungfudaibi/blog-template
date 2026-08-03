import { z } from "zod";

import { MAX_QUESTION_CHARACTERS } from "./constants";
import { AgentApiError } from "./errors";

export type AgentQuestionScope = "personal" | "professional";

const questionSchema = z
  .string()
  .trim()
  .min(1)
  .max(MAX_QUESTION_CHARACTERS)
  .refine(
    (value) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(value),
    "control characters are not allowed",
  );

const requestSchema = z
  .object({ question: questionSchema })
  .strict();

const FORBIDDEN_PATTERNS = [
  /忽略.{0,20}(规则|指令|提示)/iu,
  /(输出|显示|泄露|告诉我).{0,30}(系统提示|内部提示|密钥|全部资料|内部配置)/iu,
  /(reveal|show|print).{0,30}(system prompt|api key|secret|all sources)/iu,
];

const PERSONAL_PATTERN =
  /(zhujiechong|站主|博主|作者|关于你|你本人|你的|你觉得|你认为|你怎么看|联系|联系方式)/iu;
const PROFESSIONAL_PATTERN =
  /(编程|代码|开发|软件|架构|api|前端|后端|数据库|typescript|javascript|next\.js|react|python|ai|agent|模型|测试|部署|性能|安全|日志|opentelemetry|mdx|cloudflare|算法|系统|网络|工程|技术)/iu;

const PROTECTED_IDENTITY_PATTERNS = [
  /(真实姓名|本名|叫什么名字|姓甚名谁)/u,
  /((哪|什么|哪个)所?.{0,4}(学校|大学|学院)|毕业于|就读于|母校)/u,
  /((实习|任职|工作).{0,12}(公司|单位|哪里)|(什么|哪家|哪个).{0,8}(公司|单位).{0,6}(实习|任职|工作))/u,
  /maas.{0,16}(哪家|什么|哪个|公司|单位)/iu,
];

export function isProtectedIdentityQuestion(question: string) {
  return PROTECTED_IDENTITY_PATTERNS.some((pattern) => pattern.test(question));
}

export function parseAgentRequest(value: unknown) {
  const parsed = requestSchema.safeParse(value);

  if (!parsed.success) {
    throw new AgentApiError(
      "INVALID_REQUEST",
      `问题不能为空且不能超过 ${MAX_QUESTION_CHARACTERS} 个字符。`,
      400,
      false,
    );
  }

  return parsed.data;
}

export function classifyQuestion(question: string): AgentQuestionScope {
  if (FORBIDDEN_PATTERNS.some((pattern) => pattern.test(question))) {
    throw new AgentApiError(
      "FORBIDDEN",
      "不能请求系统提示、密钥、内部配置或全部资料。",
      403,
      false,
    );
  }

  if (isProtectedIdentityQuestion(question)) return "personal";
  if (PERSONAL_PATTERN.test(question)) return "personal";
  if (PROFESSIONAL_PATTERN.test(question)) return "professional";

  throw new AgentApiError(
    "INVALID_REQUEST",
    "阿竹目前只回答关于站主或博客涉及的专业问题。",
    400,
    false,
  );
}
