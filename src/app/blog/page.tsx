import type { ReactElement } from "react";
import type { Prisma } from "@prisma/client";
import BlogPosts from "./lib/cards";

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

const Blog = async(): Promise<ReactElement> => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_URL ?? "https://tweeets.app"}/api/blog`, {
    cache: "no-cache"
  })
    .then(res => res.json()) as BlogPosts[];

  return (
    <BlogPosts data={data} />
  );
};

export default Blog;