"use client";

import { Markdown } from "@/lib/components/markdown";
import { LoginWithTwitter } from "@/lib/components/navbar/login-with-twitter";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/lib/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar";
import CardSpotlight from "@/lib/components/ui/card-spotlight";
import TitleAndSubTitle from "@/lib/components/ui/title/with-sub";
import type { Lang } from "@/lib/configs/generation/langs";
import { getLangKeyByNav, isLanguageSupported } from "@/lib/configs/generation/langs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/lib/components/ui/alert-dialog";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { Dot } from "lucide-react";
import { fetcher } from "@/lib/utils/fetcher";
import type { Prisma } from "@prisma/client";
import Image from "next/image";
import { useState, type ReactElement, useEffect } from "react";
import useSWR from "swr";
import dayjs from "dayjs";
import { Textarea } from "@/lib/components/ui/textarea";
import { Button } from "@/lib/components/ui/button";
import { toast } from "@/lib/components/ui/use-toast";

type BlogPostProps = Prisma.PostsGetPayload<{
  include: {
    author: { include: { posts: false } };
    tags: true;
    categories: true;
    comments: { include: { author: { include: { posts: false } } } };
    variants: true;
  };
}>;

type PageProps = {
  params: {
    slug: string;
  };
};

const Blog = ({ params }: PageProps): ReactElement => {
  const { user } = useUserContext();
  const { data, isLoading } = useSWR<BlogPostProps>(`${process.env.NEXT_PUBLIC_URL ?? "https://tweeets.app"}/api/blog?slug=${params.slug}`, fetcher);
  const [browserLanguage, setBrowserLanguage] = useState<Lang | null>(null);
  const [comments, setComments] = useState<BlogPostProps["comments"] | null>(null);
  const [alreadyCommented, setAlreadyCommented] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>("");

  useEffect(() => {
    if (navigator && navigator.language) {
      if (isLanguageSupported(navigator.language)) return setBrowserLanguage(getLangKeyByNav(navigator.language));
      setBrowserLanguage("en-US");
    }
  }, []);

  useEffect(() => {
    if (data) {
      if (user && user !== "loading") {
        const alreadyCommented = data?.comments.find((comment) => comment.author.id == user?.id);
        setAlreadyCommented(alreadyCommented ? true : false);
      }

      const comments = data?.comments.sort((a, b) => dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? 1 : -1);
      setComments(comments);
    }
  }, [data, user]);

  const handleComment = async(): Promise<void> => {
    setAlreadyCommented(true);
    toast({ title: "Posting comment...", description: "Your comment is being posted, it will be available in a few seconds." });

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL ?? "https://tweeets.app"}/api/blog/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postID: data?.id, content: commentContent })
    });

    if (res.status == 200) {
      toast({ title: "Comment posted", description: "It will be available in a few seconds, if you don't see it, you can refresh the page." });
    }
  };

  if (isLoading) return <></>;

  if (!data) return (
    <div className="mx-auto flex flex-col items-center justify-center max-w-screen-2xl mt-10 mb-10" suppressHydrationWarning>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center w-full px-4">
          <TitleAndSubTitle title="404" subtitle="This blog post does not exist." type="error" subtitleSize={100} />
        </div>
      </div>
    </div>
  );

  if (!user && !data.isPublic) return (
    <div className="mx-auto flex flex-col items-center justify-center max-w-screen-2xl mt-10" suppressHydrationWarning>
      <div className="flex flex-col items-center justify-center mb-10 px-4">
        <CardSpotlight hoverEffect={false}>
          <Image src={data?.coverUrl ?? "/images/placeholder.png"} alt="Tweeets Blog" width={900} height={600} className="rounded-md" />
        </CardSpotlight>
        <div className="flex flex-col items-center w-full px-4 mt-3">
          <TitleAndSubTitle
            title={data?.variants
              ? data?.variants.find((variant) => variant.lang == browserLanguage)?.title ?? data?.title ?? "No title"
              : data?.title ?? "No title"
            }

            subtitle={data?.variants
              ? data?.variants.find((variant) => variant.lang == browserLanguage)?.excerpt ?? data?.excerpt ?? "No excerpt"
              : data?.excerpt ?? "No excerpt"
            }
            type="default"
            subtitleSize={100} />
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
      <div className="mx-auto flex flex-col items-center justify-center max-w-screen-2xl mt-10" suppressHydrationWarning>
        <div className="flex flex-col items-center justify-center mb-10 px-4">
          <CardSpotlight hoverEffect={false} className="mb-3">
            <Image src={data?.coverUrl ?? "/images/placeholder.png"} alt="Tweeets Blog" width={900} height={600} className="rounded-md" />
          </CardSpotlight>
          <div className="flex flex-col items-center w-full px-4 mt-3">
            <div className="flex items-center gap-2">
              {/* <span className="text-muted-foreground">
              10 min read
              </span>
              <Dot size={18} className="text-muted-foreground" /> */}
              <span className="flex items-center text-muted-foreground">
                <Avatar className="w-5 h-5">
                  {data?.author.pictureUrl ? (
                    <AvatarImage src={data?.author.pictureUrl} />
                  ) : (
                    <AvatarFallback>@</AvatarFallback>
                  )}
                  <AvatarFallback>@</AvatarFallback>
                </Avatar>
                <span className="ml-2">{data?.author.username}</span>
              </span>
              <Dot size={18} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                {dayjs(data?.createdAt).format("DD MMMM YYYY")}
              </span>
              <Dot size={18} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                {data?.views ?? 0} views
              </span>
            </div>

            <TitleAndSubTitle
              title={data?.variants
                ? data?.variants.find((variant) => variant.lang == browserLanguage)?.title ?? data?.title ?? "No title"
                : data?.title ?? "No title"
              }

              subtitle={data?.variants
                ? data?.variants.find((variant) => variant.lang == browserLanguage)?.excerpt ?? data?.excerpt ?? "No excerpt"
                : data?.excerpt ?? "No excerpt"
              }
              type="default"
              subtitleSize={100} />
          </div>
        </div>

        <div className="flex flex-col items-center w-full px-4 mt-3 mb-10">
          <Markdown
            source={data?.variants.find((variant) => variant.lang == browserLanguage)?.content ?? data?.content ?? "No content"}
            className="prose max-w-none w-[50%]" />
        </div>
      </div>

      <div>
        <div className="mx-auto flex flex-col items-center justify-center max-w-[900px] mb-3 px-4" suppressHydrationWarning>
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
                <div>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription className="text-base">There are currently {comments && comments.length} comments on this post.</CardDescription>
                  {alreadyCommented && <CardDescription className="text-red-500">You have already commented on this post.</CardDescription>}
                  {!user && <CardDescription className="text-red-500">You must be connected to comment.</CardDescription>}
                </div>
                <div>
                  {user == "loading" || !user ? (
                    <LoginWithTwitter />
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild disabled={alreadyCommented}>
                        <Button variant={"default"} disabled={alreadyCommented}>Post a comment</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Post a comment</AlertDialogTitle>
                          <AlertDialogDescription>
                          Please be respectful and polite in your comments.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <Textarea
                          placeholder="Write a comment..."
                          className="w-full"
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)} />

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                            <Button variant={"default"} onClick={() => handleComment()} disabled={
                              alreadyCommented || commentContent.length < 5 || commentContent.length > 280
                            }>
                            Send comment
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="mt-3">
                {comments && comments.length > 0 && (
                  <div className="mt-2">
                    {comments.map((comment) => (
                      <Card className="flex justify-between p-3 mb-3 w-full" key={comment.id}>
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-1">
                            {comment.author.pictureUrl ? (
                              <Avatar className="w-8 h-8 mr-2">
                                <AvatarImage src={comment.author.pictureUrl} />
                                <AvatarFallback>@</AvatarFallback>
                              </Avatar>
                            ) : (
                              <Avatar className="w-8 h-8 mr-2">
                                <AvatarFallback>@</AvatarFallback>
                              </Avatar>
                            )}

                            <div className="flex flex-col">
                              <div>{comment.author.username} <span className="text-gray-400">(@{comment.author.arobase})</span></div>
                              <div className="text-gray-400 text-xs">{dayjs(comment.createdAt).format("DD MMMM YYYY")}</div>
                            </div>
                          </div>

                          <div className="flex text-gray-400">
                            {comment.content}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Blog;