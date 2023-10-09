"use client";

import { LoginWithTwitter } from "@/lib/components/navbar/login-with-twitter";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/lib/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar";
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
import { Trash2 } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { useState, type ReactElement, useEffect } from "react";
import dayjs from "dayjs";
import { Textarea } from "@/lib/components/ui/textarea";
import { Button } from "@/lib/components/ui/button";
import { toast } from "@/lib/components/ui/use-toast";
import { useFetch } from "usehooks-ts";

type BlogPostProps = Prisma.PostsGetPayload<{
  include: {
    author: { include: { posts: false } };
    tags: true;
    categories: true;
    comments: { include: { author: { include: { posts: false } } } };
    variants: true;
  };
}>;

type CommentsProps = {
  slug: string;
};

const BlogComments = ({ slug }: CommentsProps): ReactElement => {
  const { user } = useUserContext();
  const { data } = useFetch<BlogPostProps>(`${process.env.NEXT_PUBLIC_URL ?? "https://tweeets.app"}/api/blog?slug=${slug}&eai=true`);
  const [comments, setComments] = useState<BlogPostProps["comments"] | null>(null);
  const [alreadyCommented, setAlreadyCommented] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>("");
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

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

  const handleDeleteComment = async(commentID: string): Promise<void> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL ?? "https://tweeets.app"}/api/blog/comments`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentID })
    });

    if (res.status == 200) {
      toast({ title: "Comment deleted", description: "It will be deleted in a few seconds, if you don't see it, you can refresh the page." });
    }
  };

  if (!data) return <></>;

  if (!user && !data.isPublic) return (
    <div className="flex flex-col items-center justify-center mb-10 px-4 w-full">
      <Card className="px-4 py-4">
        <div className="flex flex-col items-center w-full px-4 mt-3">
          <p className="text-center text-gray-500">You must be connected to see this post.</p>
          <LoginWithTwitter />
        </div>
      </Card>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center justify-center max-w-[900px] mb-3 px-4" suppressHydrationWarning>
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
              <div>
                <CardTitle>Comments</CardTitle>
                <CardDescription className="text-base">There are currently {comments && comments.length} comments on this post.</CardDescription>
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
                          <br />The comment must be between 5 and 2800 characters.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <Textarea
                        placeholder="Write a comment..."
                        maxLength={2800}
                        minLength={5}
                        className="w-full"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)} />

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button variant={"default"} onClick={() => void handleComment()} disabled={
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
                    <>
                      {!isDeleted && user !== "loading" && comment.author.id == user?.id && (
                        <Card className="flex justify-between p-3 mb-3" key={comment.id}>
                          <div className="flex flex-col w-full space-y-1">
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

                              <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col">
                                  <div>{comment.author.username} <span className="text-gray-400">(@{comment.author.arobase})</span></div>
                                  <div className="text-gray-400 text-xs">{dayjs(comment.createdAt).format("DD MMMM YYYY")}</div>
                                </div>

                                {user && user.id == comment.author.id && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Trash2 size={18} className="text-gray-400 cursor-pointer hover:text-red-500" />
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete comment</AlertDialogTitle>
                                        <AlertDialogDescription>Are you sure you want to delete this comment?</AlertDialogDescription>
                                      </AlertDialogHeader>

                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                          <Button onClick={() => {
                                            setIsDeleted(true);
                                            void handleDeleteComment(comment.id);
                                          }}>Delete</Button>
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </div>

                            <div className="flex text-gray-400">
                              {comment.content}
                            </div>
                          </div>
                        </Card>
                      )}
                    </>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogComments;