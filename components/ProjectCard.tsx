import Link from "next/link";

import type { LoadedProject } from "@/lib/content";

import { ProjectLinks } from "./ProjectLinks";

type ProjectCardProps = {
  project: LoadedProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { metadata, slug } = project;

  return (
    <article className="project-card">
      <div className="project-card__topline">
        <span>{metadata.period}</span>
        {metadata.featured ? <strong>精选作品</strong> : null}
      </div>
      <h2>
        <Link href={`/projects/${slug}`}>{metadata.title}</Link>
      </h2>
      <p className="project-card__summary">{metadata.summary}</p>
      <dl className="project-card__facts">
        <div>
          <dt>职责</dt>
          <dd>{metadata.role}</dd>
        </div>
        <div>
          <dt>技术</dt>
          <dd>
            <ul aria-label="技术栈">
              {metadata.tech.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
      <ProjectLinks links={metadata.links} className="project-links" />
    </article>
  );
}
