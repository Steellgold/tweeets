"use client";

import React, { cloneElement, ReactElement } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@nextui-org/modal";
import { useSession } from "next-auth/react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Card, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useFormState } from "react-dom";

import { cn } from "@/lib/utils";
import { createCheckoutSessionAction } from "@/lib/actions/stripe.action";
import { getPriceIdToUse } from "@/config/stripe";
import { Component } from "@/components/component";

type CreditsModalProps = {
  button: ReactElement;
}

export const CreditsModal: Component<CreditsModalProps> = ({ button }) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { status } = useSession();

  if (status == "loading") return <Button isLoading color="default" size="sm" />
  if (status == "unauthenticated") return <Button as={Link} color="default" href="/api/auth/signin" size="sm">Need credits?</Button>

  return (
    <>
      {cloneElement(button, { onPress: onOpen })}

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            How much ?
            <p className="text-sm font-normal -mt-1 text-white/80">
              Click on the price of a pack to buy credits, you will be redirected to the payment page.</p>
          </ModalHeader>

          <ModalBody className="flex flex-col gap-2 mb-4">
            <div className="flex flex-row gap-2 items-center">
              <CreditCard nbr={"10"} price={'0.60'} />
              <CreditCard nbr={"50"} price={3} />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <CreditCard nbr={"100"} price={6} />
              <CreditCard nbr={"500"} price={30} />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

type CreditCardProps = {
  nbr: "10" | "50" | "100" | "500";
  price: number | string;
}

const CreditCard: Component<CreditCardProps> = ({ nbr, price }): ReactElement => {
  const initialState = {
    isError: false,
    message: ""
  };

  const sendGenerate = createCheckoutSessionAction.bind(null, getPriceIdToUse(nbr));

  const [state, formAction] = useFormState(sendGenerate, initialState);

  return (
    <Card isFooterBlurred className="border-none" radius="lg">
      <Image alt="Credits" className="object-cover" height={200} src={`/credits/${nbr}.png`} width={200} />

      <CardFooter className={cn(
        "before:bg-white/5 border-white/20 justify-between",
        "border-1 overflow-hidden py-1 absolute before:rounded-xl",
        "rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10"
      )}>
        <p className="text-tiny text-white/90">{nbr} credits</p>
        <form action={formAction}>
          <Button
            className="text-tiny text-white bg-black/20"
            color="default"
            radius="lg"
            size="sm"
            type="submit"
            variant="flat"
          >
            {price}€
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}