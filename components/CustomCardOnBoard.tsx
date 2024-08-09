"use client";
import type { CardComponentProps } from "onborda";

import React from "react";
import { useOnborda } from "onborda";
import { XIcon } from "lucide-react";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";


const CustomCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}) => {
  const { closeOnborda } = useOnborda();

  function handleConfetti() {
    closeOnborda();
  }

  return (
    <Card className="border-0 rounded-3xl max-w-vw">
      <CardHeader>
        <div className="flex items-start justify-between w-full">
          <div>
            <h1 className="mb-2 text-lg font-medium">
              {step.icon} {step.title}
            </h1>
            <p>
              {currentStep + 1} of {totalSteps}
            </p>
          </div>

          <Button size="sm" variant="flat" onClick={() => closeOnborda()}>
            <XIcon size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardBody>{step.content}</CardBody>
      
      <CardFooter>
        <div className="flex justify-between w-full">
          {currentStep !== 0 && (
            <Button onClick={() => prevStep()}>Previous</Button>
          )}
          {currentStep + 1 !== totalSteps && (
            <Button className="ml-auto" onClick={() => nextStep()}>
              Next
            </Button>
          )}
          {currentStep + 1 === totalSteps && (
            <Button className="ml-auto" onClick={() => handleConfetti()}>
              🎉 Finish!
            </Button>
          )}
        </div>
      </CardFooter>
      <span className="text-card">{arrow}</span>
    </Card>
  );
};

export default CustomCard;