"use client";

import { fetcher } from "@/lib/utils/fetcher";
import type { Prisma } from "@prisma/client";
import type { ReactElement } from "react";
import useSWR from "swr";
import BlogCard from "./card";
import { cn } from "@/lib/utils";

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

  return (
    <>
      <div className="mx-auto flex flex-col items-center justify-center max-w-screen-2xl" suppressHydrationWarning>
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="flex flex-col items-center w-full px-4">
            <h1 className={cn(
              "text-2xl font-bold tracking-tighter sm:text-5xl xl:text-6xl bg-clip-text text-transparent",
              "bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500 h-full text-center py-3"
            )}>
              Tweeets Blog
            </h1>

            <p className="md:text-xl text-zinc-400 mx-auto text-center">
              Read about the latest updates and news about Tweeets.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isLoading && data && data.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPosts;