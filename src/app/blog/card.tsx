import { Badge } from "@/lib/components/ui/badge";
import CardSpotlight from "@/lib/components/ui/card-spotlight";
import { intify } from "@/lib/utils";
import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { AlarmClock, Dot, Glasses, MessagesSquare, Pin, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

type BlogPostProps = Prisma.PostsGetPayload<{
  include: {
    author: {include: { posts: false }};
    tags: true;
    categories: true;
    comments: true;
  };
}>;

const BlogCard = ({ comments, isPinned, slug, title, coverUrl, views, tags, excerpt, publishedAt }: BlogPostProps): ReactElement => {
  const testTime = (): boolean => {
    return dayjs(publishedAt).isAfter(dayjs());
  };

  return (
    <Link href={`/blog/${slug}`}>
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
          {tags && tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={"blogPost"}>
              {tag.name == "AI" && <><Sparkles size={18} className="text-yellow-300" />&nbsp;<span className="text-yellow-300">{tag.name}</span></>}
            </Badge>
          ))}
        </div>
        <Title title={title} slug={slug} isPinned={isPinned} comments={(comments ?? []).length} views={views ?? 0} excerpt={excerpt} />
      </CardSpotlight>
    </Link>
  );
};

type BlogCardTitleProps = {
  title: string;
  slug: string;
  isPinned: boolean;
  excerpt: string;
  comments: number;
  views: number;
};

const Title = ({ title, comments, views, excerpt }: BlogCardTitleProps): ReactElement => {
  return (
    <div className="absolute bottom-4 flex flex-col gap-2">
      <div className="flex flex-col">
        <span className="flex gap-2 font-medium items-center">
          {title}
        </span>
        <span className="flex gap-2 items-center text-sm text-zinc-400 line-clamp-2">
          {excerpt}
        </span>
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
      </div>
    </div>
  );
};

export default BlogCard;