import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { HandMetal } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Component } from "@/components/component";
import { cn } from "@/lib/utils";

import { GenerateFormActionState } from "../page";
import { TYPE } from "../type/tabs.type";
import { SingleTweet, Thread } from "../type/post.type";

import { GeneratedPostModal } from "./modals/GeneratedPostModal";

type SubmitProps = {
  data: GenerateFormActionState;
  type: TYPE;
  context: string;
  isDisabled: boolean;
  isReset: boolean;
  onSubmit?: () => void;
};

export const Submit: Component<SubmitProps> = ({ data, type, context, isDisabled, isReset, onSubmit }) => {
  const { pending } = useFormStatus();

  // const handleSubmit = () => {
  //   console.log("Submit button clicked");
  //   if (onSubmit) {
  //     onSubmit();
  //   }
  // };

  const renderContent = () => {
    if (type === "thread" && !data.isError) {
      const parsed = Thread.safeParse(data.data.event);

      if (parsed.success) {
        return (
          <ScrollShadow hideScrollBar className="h-[330px]">
            <Accordion defaultExpandedKeys={["1"]} variant="splitted">
              {parsed.data.tweets.map((tweet, index) => (
                <AccordionItem key={tweet.id} aria-label="Tweet" className={cn({
                    "mb-4": index == parsed.data.tweets.length - 1
                })} title={`Tweet ${index + 1}`}>
                  {tweet.text}
                </AccordionItem>
              ))}
            </Accordion>
        </ScrollShadow>
        );
      } else {
        return <p>An error occurred while parsing the response.</p>;
      }
    } else {
      const parsed = SingleTweet.safeParse(data.data.event);

      if (parsed.success) {
        return (
          <Card>
            <CardBody>
              <p className="text-sm">{parsed.data.text}</p>
            </CardBody>
            <CardFooter>
              <p className="text-[#9CA3AF] text-sm">Generated in {data.data.in}ms</p>
            </CardFooter>
          </Card>
        );
      } else {
        return <p>An error occurred while parsing the response.</p>;
      }
    }
  };

  return (
    <GeneratedPostModal
      button={
        <Button
          color={"primary"}
          isDisabled={isDisabled || !context || context.length < 10 || pending}
          isLoading={pending}
          size="sm"
          type="submit"
          // onClick={handleSubmit}
        >
          {!pending && <HandMetal size={16} />}
          Generate Tweet
        </Button>
      }
      content={
        data.isError ? (
          <div className="flex flex-col items-center">
            <p className="text-red-500 text-sm">{data.message}</p>
          </div>
        ) : renderContent()
      }
      isError={data.isError && isReset == false}
      isLoading={pending}
      type={type}
    />
  );
}