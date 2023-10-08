import { Badge } from "@/lib/components/ui/badge";
import CardSpotlight from "@/lib/components/ui/card-spotlight";
import type { Lang } from "@/lib/configs/generation/langs";
import { cn, intify } from "@/lib/utils";
import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { AlarmClock, Dot, Glasses, Lock, MessagesSquare, Pin, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

type BlogPostProps = Prisma.PostsGetPayload<{
  include: {
    author: { include: { posts: false } };
    tags: true;
    categories: true;
    comments: true;
    variants: true;
  };
}> & {
  defaultLang: Lang;
};

const BlogCard = ({
  comments, isPinned, isPublic, slug, title, coverUrl, views, tags, excerpt, publishedAt, defaultLang, variants }: BlogPostProps): ReactElement => {
  const testTime = (): boolean => {
    return dayjs(publishedAt).isAfter(dayjs());
  };

  return (
    <Link href={`/blog/${slug}`} prefetch>
      <CardSpotlight
        className="w-full aspect-[8/5] bg-center"
        style={{ backgroundImage: `url(${coverUrl ?? "/images/placeholder.png"})` }}>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            {(!publishedAt || !testTime()) && isPinned && <Pin size={18} className="text-[#2da1e3]" fill="#2da1e3" />}
            {publishedAt && testTime() && (
              <div className="flex gap-1 items-center">
                <AlarmClock size={18} className="text-zinc-500" />
                <span className="text-zinc-500 text-xs">{dayjs(publishedAt).format("DD MMMM YYYY")}</span>
              </div>
            )}
          </div>
          {tags && tags.length > 0 && (
            <div className="flex gap-2 items-center">
              {tags && tags.slice(0, 2).map((tag) => (
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
              {tags && tags.length > 2 && <span className="text-zinc-500 text-xs">+{tags.length - 2}</span>}
            </div>
          )}
        </div>
        <Title
          title={variants?.find((variant) => variant.lang == defaultLang)?.title ?? title}
          comments={(comments ?? []).length}
          views={views ?? 0}
          isPublic={isPublic}
          excerpt={variants?.find((variant) => variant.lang == defaultLang)?.excerpt ?? excerpt} />
      </CardSpotlight>
    </Link>
  );
};

type BlogCardTitleProps = {
  title: string;
  excerpt: string;
  comments: number;
  views: number;
  isPublic?: boolean;
};

const Title = ({ title, comments, views, excerpt, isPublic  }: BlogCardTitleProps): ReactElement => {
  return (
    <div className="absolute bottom-4 flex flex-col px-2 gap-2">
      <div className="flex flex-col">
        <span className="flex font-medium items-center text-sm md:text-base">{title}</span>
        <span className="flex items-center text-xs md:text-sm text-zinc-400 line-clamp-2">{excerpt}</span>
      </div>
      <div className="flex gap-2 text-sm text-zinc-400 items-center">
        <span className="flex gap-1 items-center">
          <MessagesSquare size={18} className="text-zinc-500" />&nbsp;
          {comments} comments
        </span>
        <Dot size={16} className="text-zinc-500" />
        <span className="flex gap-1 items-center">
          <Glasses size={18} className="text-zinc-500" />&nbsp;
          {intify(views)} views
        </span>
        {!isPublic && (
          <>
            <Dot size={16} className="text-zinc-500" />
            <span className="flex gap-1 items-center">
              <Lock size={16} className="text-zinc-500" />&nbsp;
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogCard;