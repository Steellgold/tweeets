"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader, CardFooter } from "@nextui-org/card";
import { Textarea } from "@nextui-org/input";
import { HandMetal, PiggyBank, Presentation } from "lucide-react";
import { ReactElement, useEffect, useState } from "react";
import { useOnborda } from "onborda";
import { useSession } from "next-auth/react";
import { useFormState, useFormStatus } from "react-dom";
import { Chip } from "@nextui-org/chip";

import { ToneTabsComponent } from "./lib/TabsToneComponent";
import { TONES } from "./type/tabs.type";
import { TypeTabsComponent } from "./lib/TabsTypeComponent";
import { LengthSliderComponent } from "./lib/LengthSliderComponent";
import { ThreadLengthSliderComponent } from "./lib/ThreadLengthSliderComponent";
import { EmojiesSwitchComponent } from "./lib/EmojiesSwitchComponent";
import { IndicatorsSwitchComponent } from "./lib/IndicatorsSwitchComponent";
import { generateAction } from "./actions/generate";
import { LanguageSelectComponent } from "./lib/LanguageSelectComponent";

import { CreditsModal } from "@/components/CreditsModal";
import { Language } from "@/config/prompt";

type State = {
  isError: boolean;
  errorType?: "textarea" | "alert";
  message: string;
};

const initialState: State = {
  isError: false,
  errorType: undefined,
  message: "",
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
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    const { isError, message } = state;

    if (isError) {
      setIsInvalid(true);
      setErrorMessage(message);
    } else {
      setIsInvalid(false);
      setErrorMessage("");
    }
  }, [state]);

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
          <div className="px-2 mt-2.5">
            <Card className="py-2 px-1 border-2 border-[#f31260] bg-[#f3126010]">
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
            />
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
            <ToneTabsComponent setType={setTone} type={tone} />
            <TypeTabsComponent setType={setType} type={type} onChange={() => {
              if (type == "singleTweet") {
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl" id="onborda-step5">
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

            <div id="onborda-step6">
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

          <form action={formAction} id="onborda-step7">
            <Submit />
          </form>
        </CardFooter>
      </Card>
    </section>
  );
}

const Submit = (): ReactElement => {
  const { pending } = useFormStatus();

  return (
    <Button color={"primary"} isLoading={pending} size="sm" type="submit">
      {!pending && <HandMetal size={16} />}
      Generate Tweet
    </Button>
  );
}

export default Page;