"use client";

import React, { cloneElement, ReactElement } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { useSession } from "next-auth/react";
import { button as buttonStyles } from "@nextui-org/theme";
import { Link } from "@nextui-org/link";

import { Component } from "../component";

type LoginModalProps = {
  button: ReactElement;
  action: ReactElement;
}

export const LoginModal: Component<LoginModalProps> = ({ button, action }) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <Link className={buttonStyles({ color: "primary" })} href="/app">
        Get started
      </Link>
    )
  }

  return (
    <>
      {cloneElement(button, { onPress: onOpen })}

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Sign in to your account</ModalHeader>
              <ModalBody>
                <p>Sign in or create an account using the sign-in button with Twitter</p>
              </ModalBody>
              <ModalFooter className="w-full">
                {action}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
