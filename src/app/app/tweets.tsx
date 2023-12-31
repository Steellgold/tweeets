"use client";

import { Button } from "@/lib/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/lib/components/ui/sheet";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { fetcher } from "@/lib/utils/fetcher";
import type { Prisma } from "@prisma/client";
import { useState, type ReactElement, useEffect } from "react";
import useSWR from "swr";
import { Skeleton } from "@/lib/components/ui/skeleton";
import { Textarea } from "@/lib/components/ui/textarea";
import TweetsListClassed from "./tweets-classed";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/utils/supabase";

type UserIncludeAll = Prisma.UserGetPayload<{
  include: { tweets: true };
}>

const TweetsList = (): ReactElement => {
  const supabase = createClientComponentClient<Database>();
  const { user } = useUserContext();
  const [listTweets, setListTweets] = useState<Prisma.TweetsGetPayload<{ include: { user: false } } | null>[]>([]);

  const { data, isLoading } = useSWR<UserIncludeAll>("/api/user", fetcher);
  useEffect(() => setListTweets(data?.tweets || []), [data]);

  if (user && user !== "loading") {
    supabase.channel(`tweets:${user.id}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "Tweets"
      }, (payload) => {
        // @ts-ignore
        if (payload.eventType === "INSERT" && payload.new.userId == user.id) setListTweets((prev) => [...prev, payload.new]);
        if (payload.eventType === "UPDATE") {
          if (payload.new.userId !== user.id) setListTweets((prev) => prev.filter((tweet) => tweet.id !== payload.old.id));
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          if (payload.new.userId === user.id && !listTweets.map((tweet) => tweet.id).includes(payload.old.id)) {
            // @ts-ignore
            setListTweets((prev) => [...prev, payload.new]);
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          if (payload.new.userId === user.id && listTweets.map((tweet) => tweet.id).includes(payload.old.id)) {
            // @ts-ignore
            setListTweets((prev) => prev.map((tweet) => tweet.id === payload.old.id ? payload.new : tweet));
          }
        }

        if (payload.eventType === "DELETE") {
          if (payload.old.userId !== user.id) return;
          setListTweets((prev) => prev.filter((tweet) => tweet.id !== payload.old.id));
        }
      })
      .subscribe();
  }

  const [filter, setFilter] = useState<string>("");

  return (
    <Sheet>
      <SheetTrigger disabled={!user || isLoading || listTweets.length == 0}>
        {isLoading ? (
          <Button variant={"outline"} size={"sm"} className="flex gap-1" disabled={
            !user
            || isLoading
            || listTweets.length == 0
          }>
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
          </Button>
        ) : (
          <Button variant={"secondary"} size={"sm"} className="flex gap-1" disabled={!user || isLoading || listTweets.length == 0}>
            All generated tweets
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="!overflow-y-scroll !max-w-[600px]">
        <SheetHeader>
          <SheetTitle>List of generated tweets</SheetTitle>
          <SheetDescription>
            Here is the list of all your generated tweets.
          </SheetDescription>
        </SheetHeader>

        <Textarea
          placeholder="Search for a tweet generated by specific keywords in a context or the generated tweet itself."
          className="resize-none mt-4 h-10"
          disabled={!user || isLoading || listTweets.length == 0}
          onChange={(event) => {
            setFilter(event.target.value);
          }} />

        {!isLoading && listTweets && (
          <>
            {filter.length > 0 && (
              <TweetsListClassed
                data={listTweets.filter((tweet) => tweet.generated.toLowerCase().includes(filter.toLowerCase())
                || tweet.context.toLowerCase().includes(filter.toLowerCase()))}
              />
            ) || (
              <TweetsListClassed data={listTweets} />
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TweetsList;