"use client";

import React, { cloneElement, ReactElement, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@nextui-org/modal";
import { useSession } from "next-auth/react";
import { Slider } from "@nextui-org/slider";
import { Button } from "@nextui-org/button";
import { Code } from "@nextui-org/code";
import { CardFooter } from "@nextui-org/card";
import { Zap } from "lucide-react";

import { Component } from "./component";

type CreditsModalProps = {
  button: ReactElement;
}

export const CreditsModal: Component<CreditsModalProps> = ({ button }) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { status } = useSession();
  const [credits, setCredits] = useState(0);

  if (status !== "authenticated") {
    return (
      <Button color="danger" size="sm">
        Buy credits
      </Button>
    )
  }

  const prixBase = parseInt((credits * 0.599).toFixed(2));
  const prixFinal = prixBase + 0.99;
  const prixAffiche = credits >= 10 ? prixFinal.toFixed(2) : (credits * 0.599 + 0.99).toFixed(2);

  return (
    <>
      {cloneElement(button, { onPress: onOpen })}

      <Modal isOpen={isOpen} onOpenChange={(open) => {
        onOpenChange();
        if (!open) setCredits(0);
      }}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Need credits?
          </ModalHeader>

          <ModalBody className="-mt-5">
            <div className="flex flex-col gap-2">
              <p>Each tweet generation will cost you <Code className="text-model4">1 credit</Code>.</p>
              <div className="flex flex-wrap items-center gap-1 -mt-2">
                <p>When</p>
                <Code className="text-model4 flex items-center gap-1">
                  <Zap color="#17c964" fill="#17c964" size={18} />
                  Fast mode
                </Code>
                <p>is enabled, </p>
                <p>it will</p>
                <p> cost you</p>
                <p> one extra credit.</p>
              </div>
            </div>
          </ModalBody>

          <CardFooter className="flex flex-col gap-2 p-5">
            <Slider
              defaultValue={5}
              maxValue={100}
              minValue={5}
              step={5}
              value={credits}
              // @ts-ignore
              onChange={(value: number) => setCredits(value)}
            />
            
            <Button className="w-full" color="primary">
              Buy {credits} credits for ${prixAffiche}
            </Button>
          </CardFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
