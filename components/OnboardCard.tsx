"use client";
import type { CardComponentProps } from "onborda";

import React from "react";
import { useOnborda } from "onborda";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import confetti from "canvas-confetti";
import { Code } from "@nextui-org/code";


export const OnboardCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep
}) => {
  const { closeOnborda } = useOnborda();

  function handleConfetti() {
    closeOnborda();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between w-full">
          <div>
            <div className="flex items-center text-sm w-full justify-between">
              <Code>{step.icon}</Code>
            </div>

            <h2 className="mt-1.5 text-lg font-semibold">{step.title}</h2>
          </div>
        </div>
      </CardHeader>

      <CardBody className="-mt-5">{step.content}</CardBody>
      
      <CardFooter>
        <div className="flex justify-between w-full">
          {currentStep !== 0 && (
            <Button radius="md" onClick={() => prevStep()}>Previous</Button>
          )}
          {currentStep + 1 !== totalSteps && (
            <Button className="ml-auto" radius="md" onClick={() => nextStep()}>Next</Button>
          )}
          {currentStep + 1 === totalSteps && (
            <Button className="ml-auto" onClick={() => handleConfetti()}>
              🎉 Finish!
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};