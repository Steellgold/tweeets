import type { ReactElement } from "react";
import BlogContent from "./content";
import type { Prisma } from "@prisma/client";
import type { Metadata } from "next";
import { metadata } from "@/app/layout";

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

export const generateMetadata = async({ params }: PageProps): Promise<Metadata> => {
  const { data, error } = await fetch(
    `${process.env.NEXT_PUBLIC_URL ?? "https://tweeets.app"}/api/blog?slug=${params.slug}`
  ).then(res => res.json()) as { data: BlogPostProps; error: string };
  if (!data || error) return metadata;

  return {
    title: data.title,
    description: data.excerpt,

    openGraph: {
      title: data.title,
      description: data.excerpt,
      images: [data.coverUrl ? { url: data.coverUrl } : { url: "/images/placeholder.png" }]
    }
  };
};

const Blog = ({ params }: PageProps): ReactElement => {
  return <BlogContent params={params} />;
};

export default Blog;