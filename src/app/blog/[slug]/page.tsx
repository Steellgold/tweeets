import type { ReactElement } from "react";
import BlogContent from "./content";
import type { Prisma } from "@prisma/client";

type PageProps = {
  params: {
    slug: string;
  };
};

type BlogPostProps = Prisma.PostsGetPayload<{
  include: {
    author: { include: { posts: false } };
    tags: true;
    categories: true;
    comments: { include: { author: { include: { posts: false } } } };
    variants: true;
  };
}>;

const Blog = async({ params }: PageProps): Promise<ReactElement> => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_URL ?? "https://tweeets.app"}/api/blog?slug=${params.slug}`
  ).then(res => res.json()) as BlogPostProps;

  return <BlogContent post={data} />;
};

export default Blog;