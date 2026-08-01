export function AgentPreview() {
  return (
    <section className="agent-preview" aria-labelledby="agent-preview-title">
      <div className="agent-preview__avatar" aria-hidden="true">
        <span>&gt;</span>
        <span>_</span>
      </div>
      <div>
        <p className="eyebrow">05 / AGENT · COMING SOON</p>
        <h2 id="agent-preview-title">阿竹正在准备中</h2>
        <p>
          之后可以向它询问我的公开资料、作品和文章。现在尚未连接模型，也不会假装回答。
        </p>
      </div>
      <span className="agent-preview__status">离线准备</span>
    </section>
  );
}
