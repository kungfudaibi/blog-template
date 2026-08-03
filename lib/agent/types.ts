export type AgentSourceKind = "capability" | "profile" | "post" | "project";

export type AgentSource = {
  id: string;
  kind: AgentSourceKind;
  title: string;
  href: string;
  content: string;
  keywords: string[];
};

export type RetrievedAgentSource = {
  id: string;
  kind: AgentSourceKind;
  title: string;
  href: string;
  snippet: string;
  score: number;
};

export type RetrievalResult = {
  status: "matched" | "insufficient";
  sources: RetrievedAgentSource[];
  totalCharacters: number;
};
