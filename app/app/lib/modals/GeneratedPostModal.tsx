"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { cloneElement, ReactElement, useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Link } from "@nextui-org/link";
import { Bird } from "lucide-react";

import { TYPE } from "../../type/tabs.type";

import { Component } from "@/components/component";

type Props = {
  button: ReactElement;
  type: TYPE;
  content: ReactElement;
  
  isLoading?: boolean;
  isError?: boolean;
};

export const GeneratedPostModal: Component<Props> = ({ button, content, isLoading, isError, type }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    if (isError && isModalOpen) {
      onClose();
      setIsModalOpen(false);
    }
  }, [isError, isModalOpen, onClose]);

  const handleOpen = () => {
    if (isError) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
      onOpenChange();
    }
  };
  
  return (
    <>
      {cloneElement(button, { onPress: handleOpen })}

      <Modal
        backdrop="blur"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          onOpenChange();
          setIsModalOpen(open);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isLoading ? "It may take a few seconds" : "Your post has been generated!"}
              </ModalHeader>

              <ModalBody className="flex flex-col gap-2">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <Spinner color="white" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {content}
                  </div>
                )}
              </ModalBody>
              
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>Close</Button>

                {type == "singleTweet" && content && (
                  <Button as={Link} color="primary" href={`https://twitter.com/intent/tweet?text=${content}`} target="_blank" variant="flat">
                    <Bird fill="currentColor" size={16} />
                    Share
                  </Button>
                )}

                <Button color="primary" onPress={onClose}>
                  My Posts
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}