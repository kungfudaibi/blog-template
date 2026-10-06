import Link from "next/link";

import type { LoadedProject } from "@/lib/content";
import { CharacterAccent } from "./CharacterAccent";

type FeaturedProjectsProps = {
  projects: LoadedProject[];
};

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section className="home-section home-projects" aria-labelledby="featured-projects-title">
      <div className="home-section__heading">
        <h2 id="featured-projects-title">做过的东西</h2>
        <Link href="/projects">全部作品 ↗</Link>
      </div>
      <span className="home-section__mascot"><CharacterAccent character="phoebe" /></span>

      {projects.length > 0 ? (
        <div className="featured-projects">
          {projects.map((project) => (
            <article className="featured-project" key={project.slug}>
              <p className="featured-project__meta">{project.metadata.period} · {project.metadata.role}</p>
              <h3><Link href={`/projects/${project.slug}`}>{project.metadata.title}</Link><span aria-hidden="true">↗</span></h3>
              {project.metadata.summary ? <p>{project.metadata.summary}</p> : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="home-section__empty">作品稍后补上</p>
      )}
    </section>
  );
}
