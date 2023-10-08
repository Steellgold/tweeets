"use client";

import type { Prisma } from "@prisma/client";
import { useEffect, type ReactElement, useState } from "react";
import BlogCard from "./card";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/configs/generation/langs";
import { getLangKeyByNav, isLanguageSupported } from "@/lib/configs/generation/langs";
import { useFetch } from "usehooks-ts";

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
    variants: true;
  };
}>;

const BlogPosts = (): ReactElement => {
  const { data, error } = useFetch<BlogPosts[]>(`${process.env.NEXT_PUBLIC_URL ?? "https://tweeets.app"}/api/blog`);
  const [browserLanguage, setBrowserLanguage] = useState<Lang | null>(null);

  useEffect(() => {
    if (navigator && navigator.language) {
      if (isLanguageSupported(navigator.language)) return setBrowserLanguage(getLangKeyByNav(navigator.language));
      setBrowserLanguage("en-US");
    }
  }, []);

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

        {!error && data && data.length == 0 && (
          <div className="mx-auto flex flex-col items-center justify-center max-w-screen-2xl mt-10 mb-10" suppressHydrationWarning>
            <div className="flex flex-col items-center w-full px-4">
              <p className="text-white text-center text-xl">
                No blog posts yet.</p>
            </div>
          </div>
        )}

        {!error && data && data.length > 0 && (
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!error && data && data.map((post) => (
                <BlogCard key={post.id} {...post} defaultLang={browserLanguage ?? "en-US"} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogPosts;