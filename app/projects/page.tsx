import type { Metadata } from "next";

import { ProjectCard } from "@/components/ProjectCard";
import { loadProjects, type LoadedProject } from "@/lib/content";

export const metadata: Metadata = {
  title: "作品 | zhujiechong",
  description: "zhujiechong 的项目、职责与技术实践。",
  alternates: { canonical: "/projects" },
};

type ProjectIndexProps = {
  projects: LoadedProject[];
};

export function ProjectIndex({ projects }: ProjectIndexProps) {
  return (
    <main id="main-content" className="content-page" tabIndex={-1}>
      <header className="page-intro">
        <h1>作品</h1>
        <p>这里会放我参与构建的产品、工具与实验，以及每个项目里的具体职责。</p>
      </header>

      {projects.length > 0 ? (
        <div className="project-list">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <section className="empty-state" aria-labelledby="empty-projects-title">
          <p aria-hidden="true">[ empty ]</p>
          <h2 id="empty-projects-title">作品还在整理</h2>
          <p>
            在 <code>content/projects/</code> 添加第一个 MDX，作品会自动出现在这里。
          </p>
        </section>
      )}
    </main>
  );
}

export default async function ProjectsPage() {
  const projects = await loadProjects();
  return <ProjectIndex projects={projects} />;
}
