"use client";

import { Button } from "@/lib/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/lib/components/ui/sheet";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { fetcher } from "@/lib/utils/fetcher";
import type { Prisma } from "@prisma/client";
import { useState, type ReactElement } from "react";
import useSWR from "swr";
import { Skeleton } from "@/lib/components/ui/skeleton";
import { Textarea } from "@/lib/components/ui/textarea";
import TweetsListClassed from "./tweets-classed";

type UserIncludeAll = Prisma.UserGetPayload<{
  include: { tweets: true };
}>

const TweetsList = (): ReactElement => {
  const { user } = useUserContext();
  const { data, isLoading } = useSWR<UserIncludeAll>("/api/user", fetcher);

  const [filter, setFilter] = useState<string>("");

  return (
    <Sheet>
      <SheetTrigger disabled={!user || isLoading || data?.tweets.length == 0}>
        {isLoading ? (
          <Button variant={"outline"} size={"sm"} className="flex gap-1" disabled={
            !user
            || isLoading
            || data?.tweets.length == 0
          }>
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
          </Button>
        ) : (
          <Button variant={"secondary"} size={"sm"} className="flex gap-1" disabled={!user || isLoading || data?.tweets.length == 0}>
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
          placeholder="Search for a content"
          className="resize-none mt-4 h-10"
          disabled={!user || isLoading || data?.tweets.length == 0}
          onChange={(event) => {
            setFilter(event.target.value);
          }} />

        {!isLoading && data?.tweets && (
          <>
            {filter.length > 0 && (
              <TweetsListClassed data={data?.tweets.filter((tweet) => tweet.generated.includes(filter))} />
            ) || (
              <TweetsListClassed data={data?.tweets} />
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TweetsList;