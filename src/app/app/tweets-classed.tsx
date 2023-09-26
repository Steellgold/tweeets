"use client";

import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/lib/components/ui/accordion";
import type { ReactElement } from "react";
import Tweet from "./tweet";
import { Badge } from "@/lib/components/ui/badge";

type UserIncludeAll = Prisma.UserGetPayload<{
  include: { tweets: true };
}>;

type AccordionItemProps = {
  title: string;
  tweets: UserIncludeAll["tweets"];
};

const TweetsListClassed = ({ data: tweets }: { data: UserIncludeAll["tweets"] }): ReactElement => {
  const dates: AccordionItemProps[] = [];
  tweets.forEach((tweet) => {
    const date = dayjs(tweet.createdAt).format("dddd DD MMMM YYYY");
    const index = dates.findIndex((item) => item.title == date);
    if (index == -1) {
      dates.push({ title: date, tweets: [tweet] });
    } else {
      dates[index].tweets.push(tweet);
    }
  });

  const today = dayjs().format("dddd DD MMMM YYYY");
  if (dates.findIndex((item) => item.title == today) == -1) dates.unshift({ title: today, tweets: [] });

  return (
    <Accordion type="single" collapsible className="w-full">
      {dates.map(({ title: date, tweets }, index) => (
        <AccordionItem key={index} value={index.toString()} defaultChecked={index == 0}>
          <AccordionTrigger className="flex items-center">
            <p className="flex items-center gap-3">
              {date}{tweets.length > 0 && (<Badge>{tweets.length}</Badge>)}
            </p>
          </AccordionTrigger>
          <AccordionContent>
            {tweets.length == 0 && (
              <p>
                No tweets generated on this day.
              </p>
            ) || (
              <>
                {tweets.map((tweet) => (
                  <Tweet key={tweet.id} {...tweet} first={tweets[0].id == tweet.id} />
                ))}
              </>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default TweetsListClassed;