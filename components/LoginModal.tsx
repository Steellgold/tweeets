"use client";

import React, { cloneElement, ReactElement } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/modal";

import { Component } from "./component";

type LoginModalProps = {
  button: ReactElement;
  action: ReactElement;
}

export const LoginModal: Component<LoginModalProps> = ({ button, action }) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      {cloneElement(button, { onPress: onOpen })}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Sign in to your account</ModalHeader>
              <ModalBody>
                <p>If you don&apos;t have an account, one is created for you when you sign in using your Twitter account.</p>
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
