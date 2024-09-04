"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader, CardFooter } from "@nextui-org/card";
import { Textarea } from "@nextui-org/input";
import { PiggyBank, Presentation } from "lucide-react";
import { useEffect, useState } from "react";
import { useOnborda } from "onborda";
import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import { Chip } from "@nextui-org/chip";
import { z } from "zod";

import { Language } from "@/config/prompt";
import { generateAction } from "@/lib/actions/generate.action";
import { CreditsModal } from "@/components/modals/CreditsModal";
import { responseSchema } from "@/lib/types/post.type";
import { TONES, TYPE } from "@/lib/types/tabs.type";
import { useDetectDevice } from "@/lib/hooks/useDetectDevice";

import { EmailRequiredComponent } from "../EmailRequiredComponent";
import { TypeTabsComponent } from "../TabsTypeComponent";
import { ToneTabsComponent } from "../TabsToneComponent";
import { LengthSliderComponent } from "../LengthSliderComponent";
import { ThreadLengthSliderComponent } from "../ThreadLengthSliderComponent";
import { LanguageSelectComponent } from "../LanguageSelectComponent";
import { EmojiesSwitchComponent } from "../EmojiesSwitchComponent";
import { IndicatorsSwitchComponent } from "../IndicatorsSwitchComponent";
import { Submit } from "../SubmitButton";

export type GenerateFormActionState = {
  isError: boolean;
  errorType?: "textarea" | "alert";
  message?: string;
  data: z.infer<typeof responseSchema>;
  newCreditsCount: number;
};

const initialState: GenerateFormActionState = {
  isError: false,
  errorType: undefined,
  message: "",
  newCreditsCount: 0,
  data: {
    event: {
      text: ""
    },
    in: 0
  }
};

export const GenerationTabPage = () => {  
  const [content, setContent] = useState<string>("");

  const [tone, setTone] = useState<TONES>("normal");
  const [type, setType] = useState<"singleTweet" | "thread">("singleTweet");
  const [language, setLanguage] = useState<Language>("English");
  const [tweetLength, setTweetLength] = useState(50);
  const [threadLength, setThreadLength] = useState(2);
  const [emojies, setEmojies] = useState<boolean>(true);
  const [indicators, setIndicators] = useState<boolean>(false);

  const [isReset, setReset] = useState<boolean>(false);

  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const { data: session, update } = useSession();
  const { startOnborda } = useOnborda();
  const { isMobile } = useDetectDevice();

  const sendGenerate = generateAction.bind(null, {
    includeEmojis: emojies,
    includeIndicators: indicators,
    chars: tweetLength,
    threadLength: type == "thread" ? threadLength : 1,
    tone,
    context: content,
    language,
    type
  });

  const [state, formAction] = useFormState(sendGenerate, initialState);

  useEffect(() => {
    const { isError, newCreditsCount } = state;

    if (newCreditsCount > 0 && session?.user?.credits !== newCreditsCount) update({ user: { credits: newCreditsCount, } });
    if (isError) setIsInvalid(true);
  }, [state, update]);

  const handleClear = () => {
    setIsInvalid(false);
  };

  return (
    <div className="max-w-[610px] w-full mx-auto flex flex-col gap-4">
      {session && !session?.user.email && <EmailRequiredComponent />}

      <Card className="w-full border-2 border-[#393941]">
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
              isDisabled={!session}
              isInvalid={isInvalid && state.isError && state.errorType == "textarea"}
              label="What is your tweet about?"
              placeholder="Type a context for your tweet"
              value={content} 
              variant={isInvalid && state.isError && state.errorType == "textarea" ? "bordered" : "flat"}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => {
                handleClear();
                setReset(true);
              }}
            />
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
            <div id="onborda-step2">
              <ToneTabsComponent isDisabled={!session} setType={setTone} type={tone} />
            </div>
            
            <div id="onborda-step3">
              <TypeTabsComponent isDisabled={!session} setType={setType} type={type} onChange={(value: TYPE) => {
                if (value == "thread") {
                  setThreadLength(0);
                  setIndicators(false);
                }
              }} />
            </div>
          </div>
          
          <div id="onborda-step4">
            {/* @ts-ignore */}
            <LengthSliderComponent isDisabled={!session} value={tweetLength} onChange={(value) => setTweetLength(value)} />
          </div>

          {/* @ts-ignore */}
          {type == "thread" && <ThreadLengthSliderComponent isDisabled={!session} value={threadLength} onChange={(value) => setThreadLength(value)} />}

          <div id="onborda-step5">
            <LanguageSelectComponent isDisabled={!session} value={language} onChange={(e) => setLanguage(e.target.value as Language)} />
          </div>
            
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl" id="onborda-step6">
            <EmojiesSwitchComponent isDisabled={!session} value={emojies} onChange={(value) => setEmojies(value)} />
            <IndicatorsSwitchComponent isDisabled={!session} type={type} value={indicators} onChange={(value) => setIndicators(value)} />
          </div>
        </CardBody>

        <CardFooter className="flex justify-between flex gap-2">
          <div className="flex gap-2">
            {!isMobile && (
              <Button color="default" size="sm" onClick={() => startOnborda("demo")}>
                <Presentation size={16} />
                Onboarding
              </Button>
            )}

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
            <Submit
              context={content}
              data={state}
              isDisabled={!session}
              isReset={isReset}
              type={type}
              onSubmit={() => setReset(true)}
            />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}