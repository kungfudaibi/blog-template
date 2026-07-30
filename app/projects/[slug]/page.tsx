import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MdxContent } from "@/components/MdxContent";
import { ProjectArticle } from "@/components/ProjectArticle";
import {
  ContentSecurityError,
  getProjectBySlug,
  loadProjects,
} from "@/lib/content";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await loadProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

async function findProject(slug: string) {
  try {
    return await getProjectBySlug(slug);
  } catch (error) {
    if (error instanceof ContentSecurityError) return undefined;
    throw error;
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await findProject(slug);

  if (!project) return { title: "作品未找到 | zhujiechong" };

  return {
    title: `${project.metadata.title} | zhujiechong`,
    description: project.metadata.summary,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await findProject(slug);

  if (!project) notFound();

  return (
    <ProjectArticle project={project}>
      <MdxContent source={project.content} />
    </ProjectArticle>
  );
}
