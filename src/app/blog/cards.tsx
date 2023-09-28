"use client";

import { fetcher } from "@/lib/utils/fetcher";
import type { Prisma } from "@prisma/client";
import type { ReactElement } from "react";
import useSWR from "swr";
import BlogCard from "./card";

type BlogPosts = Prisma.PostsGetPayload<{
  include: {
    author: {
      include: {
        posts: false;
      };
    };
    tags: true;
    categories: true;
    comments: true;
  };
}>;

const BlogPosts = (): ReactElement => {
  const { data, isLoading } = useSWR<BlogPosts[]>(`${process.env.NEXT_PUBLIC_URL ?? "https://tweeets.app"}/api/blog`, fetcher);
  if (isLoading) return <></>;

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data && data.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default BlogPosts;