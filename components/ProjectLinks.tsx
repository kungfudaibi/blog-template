import type { ProjectMetadata } from "@/lib/content";

type ProjectLinksProps = {
  links: ProjectMetadata["links"];
  className?: string;
};

export function ProjectLinks({ links, className }: ProjectLinksProps) {
  return (
    <div className={className} aria-label="作品外部链接">
      {links.demo ? (
        <a
          href={links.demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="查看演示（新窗口）"
        >
          查看演示<span className="sr-only">（新窗口）</span>
          <span aria-hidden="true"> ↗</span>
        </a>
      ) : null}
      {links.source ? (
        <a
          href={links.source}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="查看源代码（新窗口）"
        >
          查看源代码<span className="sr-only">（新窗口）</span>
          <span aria-hidden="true"> ↗</span>
        </a>
      ) : null}
    </div>
  );
}
