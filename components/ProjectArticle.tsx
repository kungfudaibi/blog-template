import type { ReactNode } from "react";
import Link from "next/link";

import type { LoadedProject } from "@/lib/content";

import { ProjectLinks } from "./ProjectLinks";

type ProjectArticleProps = {
  project: LoadedProject;
  children: ReactNode;
};

export function ProjectArticle({ project, children }: ProjectArticleProps) {
  const { metadata } = project;

  return (
    <main id="main-content" className="content-page" tabIndex={-1}>
      <Link className="back-link" href="/projects">
        <span aria-hidden="true">←</span> 返回作品列表
      </Link>
      <article className="project-article">
        <header className="project-article__header">
          <div className="project-article__topline">
            <p className="eyebrow">PROJECT / {project.slug}</p>
            {metadata.featured ? <strong>精选作品</strong> : null}
          </div>
          <h1>{metadata.title}</h1>
          {metadata.summary ? (
            <p className="project-article__summary">{metadata.summary}</p>
          ) : null}
          <dl className="project-article__facts">
            <div>
              <dt>时间</dt>
              <dd>{metadata.period}</dd>
            </div>
            <div>
              <dt>职责</dt>
              <dd>{metadata.role}</dd>
            </div>
            <div>
              <dt>技术栈</dt>
              <dd>{metadata.tech.join(" · ")}</dd>
            </div>
          </dl>
          <ProjectLinks links={metadata.links} className="project-links" />
        </header>
        <div className="prose">{children}</div>
      </article>
    </main>
  );
}
