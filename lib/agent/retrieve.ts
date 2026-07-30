import type {
  AgentSource,
  RetrievalResult,
  RetrievedAgentSource,
} from "./types";

export const MAX_RETRIEVAL_SOURCES = 3;
export const MAX_RETRIEVAL_CHARACTERS = 2_400;
export const MAX_RETRIEVAL_QUERY_CHARACTERS = 500;

const MAX_CHARACTERS_PER_SOURCE = 900;
const MINIMUM_MATCH_SCORE = 4;
const GENERIC_TERMS = new Set([
  "什么",
  "怎么",
  "如何",
  "怎样",
  "请问",
  "一下",
  "忽略",
  "规则",
  "输出",
  "全部",
  "资料",
  "zhujiechong",
]);

function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("zh-CN")
    .replace(/\s+/g, " ")
    .trim();
}

function queryTerms(query: string) {
  const normalized = normalizeText(
    query.slice(0, MAX_RETRIEVAL_QUERY_CHARACTERS),
  );
  const terms = new Set<string>();

  for (const match of normalized.matchAll(/[a-z0-9][a-z0-9.+#-]+/g)) {
    terms.add(match[0]);
  }

  for (const match of normalized.matchAll(/[\p{Script=Han}]+/gu)) {
    const run = match[0];

    for (let index = 0; index < run.length - 1; index += 1) {
      terms.add(run.slice(index, index + 2));
    }
  }

  if (/(做什么|职业|工作|是谁)/u.test(normalized)) {
    terms.add("程序员");
    terms.add("介绍");
  }

  if (/(联系|邮箱|社交账号)/u.test(normalized)) {
    terms.add("联系");
    terms.add("联系方式");
  }

  if (/(作品|项目)/u.test(normalized)) {
    terms.add("作品");
    terms.add("项目");
  }

  return [...terms].filter((term) => !GENERIC_TERMS.has(term));
}

function scoreSource(source: AgentSource, terms: string[]) {
  const title = normalizeText(source.title);
  const content = normalizeText(source.content);
  const keywords = source.keywords.map(normalizeText);
  let score = 0;

  for (const term of terms) {
    if (title.includes(term)) score += 12;
    if (keywords.some((keyword) => keyword.includes(term))) score += 9;
    if (content.includes(term)) score += term.length >= 5 ? 4 : 2;
  }

  return score;
}

function createSnippet(content: string, terms: string[], maximumLength: number) {
  if (content.length <= maximumLength) return content;

  const normalized = normalizeText(content);
  const firstMatch = terms
    .map((term) => normalized.indexOf(term))
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0];
  const preferredStart = firstMatch === undefined
    ? 0
    : Math.max(0, firstMatch - Math.floor(maximumLength / 4));
  const hasLeadingOmission = preferredStart > 0;
  const leadingCharacters = hasLeadingOmission ? 1 : 0;
  const availableContentLength = maximumLength - leadingCharacters;
  let snippet = content.slice(
    preferredStart,
    preferredStart + availableContentLength,
  );

  if (hasLeadingOmission) snippet = `…${snippet}`;
  if (preferredStart + availableContentLength < content.length) {
    snippet = `${snippet.slice(0, -1)}…`;
  }

  return snippet;
}

export function retrieveAgentSources(
  query: string,
  sources: readonly AgentSource[],
): RetrievalResult {
  const terms = queryTerms(query);

  if (terms.length === 0) {
    return { status: "insufficient", sources: [], totalCharacters: 0 };
  }

  const candidates = sources
    .filter((source) => source.content.trim().length > 0)
    .map((source) => ({ source, score: scoreSource(source, terms) }))
    .filter((candidate) => candidate.score >= MINIMUM_MATCH_SCORE)
    .sort(
      (left, right) =>
        right.score - left.score || left.source.id.localeCompare(right.source.id, "en"),
    );
  const selected: RetrievedAgentSource[] = [];
  let totalCharacters = 0;

  for (const candidate of candidates) {
    if (selected.length >= MAX_RETRIEVAL_SOURCES) break;

    const remaining = MAX_RETRIEVAL_CHARACTERS - totalCharacters;
    if (remaining <= 0) break;

    const snippet = createSnippet(
      candidate.source.content,
      terms,
      Math.min(MAX_CHARACTERS_PER_SOURCE, remaining),
    );

    selected.push({
      id: candidate.source.id,
      kind: candidate.source.kind,
      title: candidate.source.title,
      href: candidate.source.href,
      snippet,
      score: candidate.score,
    });
    totalCharacters += snippet.length;
  }

  return selected.length > 0
    ? { status: "matched", sources: selected, totalCharacters }
    : { status: "insufficient", sources: [], totalCharacters: 0 };
}
