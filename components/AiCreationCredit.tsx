type AiCreationCreditProps = {
  model?: string;
};

export function AiCreationCredit({ model }: AiCreationCreditProps) {
  if (!model) return null;

  return <span className="ai-creation-credit">AI 创作 · {model}</span>;
}
