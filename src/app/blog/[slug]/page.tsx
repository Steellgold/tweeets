import type { ReactElement } from "react";
import BlogContent from "./content";
import type { Prisma } from "@prisma/client";
import type { Metadata } from "next";
import dayjs from "dayjs";

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

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetch(
    `${process.env.NEXT_PUBLIC_URL ?? "https://tweeets.app"}/api/blog?slug=${params.slug}`
  ).then((res) => res.json()) as BlogPostProps;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      publishedTime: dayjs(post.publishedAt).toISOString(),
      modifiedTime: dayjs(post.updatedAt).toISOString(),
      title: post.title,
      description: post.excerpt,
      url: `${process.env.NEXT_PUBLIC_URL ?? "https://tweeets.app"}/blog/${post.slug}`,
      images: [
        {
          url: post.coverUrl ?? "/images/placeholder.png",
          width: 900,
          height: 600,
          alt: post.title
        }
      ]
    }
  };
}

const Blog = async({ params }: PageProps): Promise<ReactElement> => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_URL ?? "https://tweeets.app"}/api/blog?slug=${params.slug}`
  ).then(res => res.json()) as BlogPostProps;

  return <BlogContent post={data} />;
};

export default Blog;