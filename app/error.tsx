"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { RefreshCcw } from "lucide-react";

import { Component } from "@/components/component";
import { cn } from "@/lib/utils";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

const Error: Component<ErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  const [clicked, setClicked] = useState(false);

  const handleTryAgain = async () => {
    setClicked(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setClicked(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-1">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <span className="text-gray-500 mb-3">An error occurred while processing your request.</span>
      <Button
        color="danger"
        variant="flat"
        onClick={() => handleTryAgain()}
      >
        <RefreshCcw className={cn({
          "animate-spin": clicked,
        })} size={16} />
        Try again
      </Button>
    </div>
  );
}

export default Error;