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
    publisher: "Tweeets",
    abstract: post.excerpt,
    applicationName: "Tweeets",
    keywords: post.tags.map((tag) => tag.name),
    authors: [{
      name: post.author.username,
      url: `https://x.com/${post.author.arobase}`
    }],
    openGraph: {
      type: "article",
      publishedTime: dayjs(post.publishedAt).toString(),
      modifiedTime: dayjs(post.updatedAt).toString(),
      tags: post.tags.map((tag) => tag.name),
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
    },
    twitter: {
      card: "summary_large_image",
      site: "https://tweeets.app",
      title: post.title,
      description: post.excerpt,
      creator: `@${post.author.arobase}`,
      images: [{
        url: post.coverUrl ?? "/images/placeholder.png",
        width: 900,
        height: 600,
        alt: post.title
      }]
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