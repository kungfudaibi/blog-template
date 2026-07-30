import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

type MdxContentProps = {
  source: string;
};

export function MdxContent({ source }: MdxContentProps) {
  return (
    <MDXRemote
      source={source}
      options={{
        // Repository content is trusted, but expressions remain disabled by default.
        // Source: https://github.com/hashicorp/next-mdx-remote#javascript-expressions-in-mdx
        blockJS: true,
        mdxOptions: { remarkPlugins: [remarkGfm] },
      }}
    />
  );
}
