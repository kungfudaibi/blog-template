import Link from "next/link";

import type { LoadedProject } from "@/lib/content";

type FeaturedProjectsProps = {
  projects: LoadedProject[];
};

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section className="home-section" aria-labelledby="featured-projects-title">
      <div className="home-section__heading">
        <div>
          <p className="eyebrow">02 / FEATURED</p>
          <h2 id="featured-projects-title">精选作品</h2>
        </div>
        <Link href="/projects">查看全部作品</Link>
      </div>

      {projects.length > 0 ? (
        <div className="featured-projects">
          {projects.map((project, index) => (
            <article className="featured-project" key={project.slug}>
              <p className="featured-project__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div>
                <p className="featured-project__meta">
                  {project.metadata.period} · {project.metadata.role}
                </p>
                <h3>
                  <Link href={`/projects/${project.slug}`}>
                    {project.metadata.title}
                  </Link>
                </h3>
                <p>{project.metadata.summary}</p>
                <ul aria-label="技术栈">
                  {project.metadata.tech.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="home-section__empty">精选作品稍后补上</p>
      )}
    </section>
  );
}
