"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader, CardFooter } from "@nextui-org/card";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Textarea } from "@nextui-org/input";
import { HandMetal, PiggyBank, Presentation } from "lucide-react";
import { useEffect, useState } from "react";
import { useOnborda } from "onborda";
import { useSession } from "next-auth/react";
import { useFormState, useFormStatus } from "react-dom";
import { Chip } from "@nextui-org/chip";
import { z } from "zod";

import { ToneTabsComponent } from "./lib/TabsToneComponent";
import { TONES, TYPE } from "./type/tabs.type";
import { TypeTabsComponent } from "./lib/TabsTypeComponent";
import { LengthSliderComponent } from "./lib/LengthSliderComponent";
import { ThreadLengthSliderComponent } from "./lib/ThreadLengthSliderComponent";
import { EmojiesSwitchComponent } from "./lib/EmojiesSwitchComponent";
import { IndicatorsSwitchComponent } from "./lib/IndicatorsSwitchComponent";
import { generateAction } from "./actions/generate";
import { LanguageSelectComponent } from "./lib/LanguageSelectComponent";
import { GeneratedPostModal } from "./lib/modals/GeneratedPostModal";
import { responseSchema, SingleTweet, Thread } from "./type/post.type";

import { CreditsModal } from "@/components/CreditsModal";
import { Language } from "@/config/prompt";
import { Component } from "@/components/component";
import { cn } from "@/lib/utils";

type State = {
  isError: boolean;
  errorType?: "textarea" | "alert";
  message?: string;
  data: z.infer<typeof responseSchema>;
};

const initialState: State = {
  isError: false,
  errorType: undefined,
  message: "",
  data: {
    event: {
      text: ""
    },
    in: 0
  }
};

const Page = () => {
  const { data: session } = useSession();
  const { startOnborda } = useOnborda();
  
  const [content, setContent] = useState<string>(""); // A string of text (min 10 chars)

  const [tone, setTone] = useState<TONES>("normal"); // normal, positive, negative, neutral
  const [type, setType] = useState<"singleTweet" | "thread">("singleTweet"); // singleTweet, thread
  const [language, setLanguage] = useState<Language>("English");
  const [tweetLength, setTweetLength] = useState(50); // A number between 1 and 500
  const [threadLength, setThreadLength] = useState(2); // A number between 2 and 12
  const [emojies, setEmojies] = useState<boolean>(true); // true, false
  const [indicators, setIndicators] = useState<boolean>(false); // true, false

  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const sendGenerate = generateAction.bind(null, {
    "include-emojis": emojies,
    "include-indicators": indicators,
    "chars": tweetLength,
    "thread-length": type == "thread" ? threadLength : 0,
    "tone": tone,
    "context": content,
    language,
    type
  });

  const [state, formAction] = useFormState(sendGenerate, initialState);

  useEffect(() => {
    const { isError } = state;

    if (isError) {
      setIsInvalid(true);
    }
  }, [state]);

  const handleClear = () => {
    setIsInvalid(false);
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Card className="max-w-[610px] w-full border-2 border-[#393941]">
        <CardHeader className="border-b border-[#393941] flex flex-col items-start p-4">
          Post like a pro
          <span className="text-[#9CA3AF] text-sm">
            Tweeets is a tool for analyzing and creating tweets to make your life easier as a regular Twitter user.
          </span>
        </CardHeader>

        {state && state.isError && state.errorType == "alert" && (
          <div className="px-3 mt-2.5">
            <Card className="py-1 px-1 border-2 border-[#f31260] bg-[#f3126010]">
              <CardHeader className="flex flex-col items-start">
                <Chip color="danger">Oh no!</Chip>
                <p>{state.message}</p>
              </CardHeader>
            </Card>
          </div>
        )}
        
        <CardBody className="flex flex-col gap-2">
          <div id="onborda-step1">
            <Textarea
              required
              className="w-full"
              errorMessage={isInvalid && state.isError && state.errorType == "textarea" ? state.message : ""}
              isInvalid={isInvalid && state.isError && state.errorType == "textarea"}
              label="What is your tweet about?"
              placeholder="Type a context for your tweet"
              value={content}
              variant={isInvalid && state.isError && state.errorType == "textarea" ? "bordered" : "flat"} 
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleClear}
            />
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
            <ToneTabsComponent setType={setTone} type={tone} />
            <TypeTabsComponent setType={setType} type={type} onChange={(value: TYPE) => {
              if (value == "thread") {
                setThreadLength(0);
                setIndicators(false);
              }
            }} />
          </div>
          
          {/* @ts-ignore */}
          <LengthSliderComponent value={tweetLength} onChange={(value) => setTweetLength(value)} />
          
          {/* @ts-ignore */}
          {type == "thread" && <ThreadLengthSliderComponent value={threadLength} onChange={(value) => setThreadLength(value)} />}

          <LanguageSelectComponent value={language} onChange={(e) => setLanguage(e.target.value as Language)} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl" id="onborda-step6">
            <EmojiesSwitchComponent value={emojies} onChange={(value) => setEmojies(value)} />
            <IndicatorsSwitchComponent type={type} value={indicators} onChange={(value) => setIndicators(value)} />
          </div>
        </CardBody>

        <CardFooter className="flex justify-between flex gap-2">
          <div className="flex gap-2">
            <Button color="default" size="sm" onClick={startOnborda}>
              <Presentation size={16} />
              Onboarding
            </Button>

            <div id="onborda-step7">
              <CreditsModal button={
                <Button color="default" size="sm">
                  <PiggyBank size={16} />
                  {session?.user?.credits || 0} credits
                </Button>
              } />
            </div>

            {/* <form action={logout}>
              <Button color="danger" size="sm" type="submit">
                Sign out
              </Button>
            </form> */}
          </div>

          <form action={formAction} id="onborda-step8">
            <Submit context={content} data={state} type={type} />
          </form>
        </CardFooter>
      </Card>
    </section>
  );
}

type SubmitProps = {
  data: State;
  type: TYPE;
  context: string;
};

const Submit: Component<SubmitProps> = ({ data, type, context }) => {
  const { pending } = useFormStatus();

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
              <p className="text-sm">
                {parsed.data.text}</p>
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
        <Button color={"primary"} isDisabled={!context || context.length < 10 || pending} isLoading={pending} size="sm" type="submit">
          {!pending && <HandMetal size={16} />}
          Generate Tweet
        </Button>
      }
      content={renderContent()}
      isError={data.isError}
      isLoading={pending}
      type={type}
    />
  );
}

export default Page;