"use client";

import { Button } from "@/lib/components/ui/button";
import { CardContent, CardFooter } from "@/lib/components/ui/card";
import { Checkbox } from "@/lib/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/lib/components/ui/dropdown-menu";
import { Input } from "@/lib/components/ui/input";
import { Textarea } from "@/lib/components/ui/textarea";
import { useState, type ReactElement } from "react";
import { SiOpenai } from "@icons-pack/react-simple-icons";

const Generator = (): ReactElement => {
  const [addInstructions, setAddInstructions] = useState(false);
  const [addNegativeInstructions, setAddNegativeInstructions] = useState(false);
  const [gptVersion, setGptVersion] = useState<"3" | "4">("3");

  return (
    <>
      <CardContent>
        <Textarea placeholder="Enter your tweet content here" />

        <div className="flex gap-4 items-center mt-2">
          <Checkbox onCheckedChange={(checked: boolean) => setAddInstructions(checked)} />
          <Input placeholder="Customize the instructions" disabled={!addInstructions} />
        </div>

        <div className="flex gap-4 items-center mt-2">
          <Checkbox onCheckedChange={(checked: boolean) => setAddNegativeInstructions(checked)} />
          <Input placeholder="Customize the negative instructions" disabled={!addNegativeInstructions} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="mt-2" asChild>
            <Button variant={"outline"} size={"sm"}>
              <SiOpenai className="h-4 w-4" />&nbsp;&nbsp;GPT-{gptVersion}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Choose a model</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => void setGptVersion("3")}>
              <SiOpenai className="h-4 w-4" />&nbsp;&nbsp;GPT-3
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => void setGptVersion("4")}>
              <SiOpenai className="h-4 w-4" />&nbsp;&nbsp;GPT-4
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>

      <CardFooter>
        <Button>Generate</Button>
      </CardFooter>
    </>
  );
};

export default Generator;