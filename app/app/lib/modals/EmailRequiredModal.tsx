"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { cloneElement, ReactElement, useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Mail } from "lucide-react";
import { Input } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { useSession } from "next-auth/react";

import { Component } from "@/components/component";

import { defineMailAction } from "../../actions/email.action";

type Props = {
  button: ReactElement;
};

export const EmailRequiredModal: Component<Props> = ({ button }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { update } = useSession();

  const [email, setEmail] = useState<string>("");
  const [isValidEmail, setIsValidEmail] = useState<boolean | "not-checked">("not-checked");

  const mailAction = defineMailAction.bind(null, email);

  const [state, formAction, isPending] = useFormState(mailAction, {
    isError: false,
    message: "",
    email: ""
  });

  useEffect(() => {
    if (!state.isError && state.email) {
      update({ user: { email: state.email } });
      onClose();
    }
  }, [state]);

  return (
    <>
      {cloneElement(button, { onPress: onOpen })}

      <Modal
        backdrop="blur"
        closeButton={<></>}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Email Required
            <span className="text-sm font-normal -mt-1">Your email is required if in the future you want to purchase credits, we will not send you any spam.</span>
          </ModalHeader>

          <ModalBody className="flex flex-col gap-2">
            {isPending ? (
              <div className="flex flex-col items-center">
                <Spinner color="white" />
              </div>
            ) : (
              <div className="flex flex-col">
                <Input
                  errorMessage={isValidEmail === false ? "Invalid email, please check it again." : ""}
                  isInvalid={isValidEmail === false}
                  placeholder="Email"
                  startContent={<Mail size={16} />}
                  type="email"
                  value={email}

                  onBlur={(e: React.FocusEvent<Element>) => setIsValidEmail(checkIsValidEmail((e.target as HTMLInputElement).value))}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    setIsValidEmail("not-checked");
                  }}
            
                  onFocus={(event: React.FocusEvent<Element>) => setIsValidEmail(checkIsValidEmail((event.target as HTMLInputElement).value))}
                />
              </div>
            )}
          </ModalBody>
          
          <ModalFooter>
            <form action={formAction}>
              <Submit email={email} />
            </form>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

const checkIsValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const Submit: Component<{ email: string }> = ({ email }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      color="primary"
      isDisabled={!checkIsValidEmail(email)}
      isLoading={pending}
      size="sm"
      type="submit"
    >
      Save changes
    </Button>
  );
}
