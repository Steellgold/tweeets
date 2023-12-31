"use client";

import { Markdown } from "@/lib/components/markdown";
import { LoginWithTwitter } from "@/lib/components/navbar/login-with-twitter";
import { Card } from "@/lib/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar";
import CardSpotlight from "@/lib/components/ui/card-spotlight";
import TitleAndSubTitle from "@/lib/components/ui/title/with-sub";
import type { Lang } from "@prisma/client";
import { getLangKeyByNav, isLanguageSupported, stringToLang } from "@/lib/configs/generation/langs";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { Dot, Sparkles, Wand2 } from "lucide-react";
import type { Prisma } from "@prisma/client";
import Image from "next/image";
import { useState, type ReactElement, useEffect } from "react";
import dayjs from "dayjs";
import BlogComments from "./comments";
import { Badge } from "@/lib/components/ui/badge";
import { cn } from "@/lib/utils";

type BlogPostProps = Prisma.PostsGetPayload<{
  include: {
    author: { include: { posts: false } };
    tags: true;
    categories: true;
    comments: { include: { author: { include: { posts: false } } } };
    variants: true;
  };
}>;

const BlogContent = ({ post }: { post: BlogPostProps }): ReactElement => {
  const { user } = useUserContext();
  const [browserLanguage, setBrowserLanguage] = useState<Lang | null>(null);
  const [title, setTitle] = useState<string | null>(post.title ?? null);
  const [subtitle, setSubtitle] = useState<string | null>(post.excerpt ?? null);
  const [content, setContent] = useState<string | null>(post.content ?? null);

  useEffect(() => {
    if (navigator && navigator.language) {
      if (
        isLanguageSupported(navigator.language)
        && post.variants
        && post.variants.length > 0
        && post.variants.find((variant) => variant.lang == stringToLang(getLangKeyByNav(navigator.language)))) {
        setBrowserLanguage(stringToLang(getLangKeyByNav(navigator.language)));
        const variant = post.variants.find((variant) => variant.lang == browserLanguage);
        console.log(variant);
        setTitle(variant?.title ?? post.title);
        setSubtitle(variant?.excerpt ?? post.excerpt);
        setContent(variant?.content ?? post.content);

        return setBrowserLanguage(stringToLang(getLangKeyByNav(navigator.language)));
      }
      setBrowserLanguage("en_US");
    }
  }, [post, browserLanguage]);

  if (!post) return <p>Loading (If this takes too long, please refresh the page)</p>;

  if (!user && !post.isPublic) return (
    <div className="mx-auto flex flex-col items-center justify-center max-w-screen-2xl mt-10" suppressHydrationWarning>
      <div className="flex flex-col items-center justify-center mb-10 px-4">
        <CardSpotlight hoverEffect={false}>
          <Image src={post.coverUrl ?? "/images/placeholder.png"} alt="Tweeets Blog" width={900} height={600} className="rounded-md" />
        </CardSpotlight>
        <div className="flex flex-col items-center w-full px-4 mt-3">
          <TitleAndSubTitle title={title ?? "No title"} subtitle={subtitle ?? "No excerpt"} type="default" subtitleSize={100} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mb-10 px-4 w-full">
        <Card className="px-4 py-4">
          <div className="flex flex-col items-center w-full px-4 mt-3">
            <p className="text-center text-gray-500">You must be connected to see this post.</p>
            <LoginWithTwitter />
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      <div className="mx-auto flex flex-col items-center justify-center md:max-w-screen-2xl mt-10" suppressHydrationWarning>
        <div className="flex flex-col items-center justify-center mb-10 px-4">
          <CardSpotlight hoverEffect={false} className="mb-3">
            <Image src={post.coverUrl ?? "/images/placeholder.png"} alt="Tweeets Blog" width={900} height={600} className="rounded-md" />
          </CardSpotlight>
          <div className="flex flex-col items-center w-full px-4 mt-3">
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 items-center">
                {post.tags && post.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={"blogPost"}
                    className={cn({
                      "border-emerald-300 text-emerald-300": tag.id == "release",
                      "border-yellow-300 text-yellow-300": tag.id == "ai"
                    })}>
                    {tag.id == "ai" && <><Sparkles size={18} />&nbsp;<span>{tag.name}</span></>}
                    {tag.id == "release" && <><Wand2 size={18} />&nbsp;<span>{tag.name}</span></>}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              <span className="flex items-center text-muted-foreground">
                <Avatar className="w-5 h-5">
                  {post.author.pictureUrl ? (
                    <AvatarImage src={post.author.pictureUrl} />
                  ) : (
                    <AvatarFallback>@</AvatarFallback>
                  )}
                  <AvatarFallback>@</AvatarFallback>
                </Avatar>
                <span className="ml-2">{post.author.username}</span>
              </span>
              <Dot size={18} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                {dayjs(post.createdAt).format("DD MMMM YYYY")}
              </span>
              <Dot size={18} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                {post.views ?? 0} views
              </span>
            </div>

            <TitleAndSubTitle title={title ?? "No title"} subtitle={subtitle ?? "No subtitle"} type="default" subtitleSize={100} />
          </div>
        </div>

        <div className="flex flex-col items-center w-full px-4 mt-3 mb-10">
          <Markdown source={content ?? "No content"} className="prose max-w-none w-[90%] sm:w-[70%] md:w-[60%] xl:w-[50%]" />
        </div>
      </div>
      <BlogComments slug={post.slug} />
    </>
  );
};

export default BlogContent;