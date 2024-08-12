import { Switch } from "@nextui-org/switch";

import { Component } from "@/components/component";
import { cn } from "@/lib/utils";

type EmojiesSwitchComponentProps = {
  value: boolean;
  onChange: ((value: boolean) => void) | undefined
}

export const EmojiesSwitchComponent: Component<EmojiesSwitchComponentProps> = ({ value, onChange }) => {
  return (
    <Switch
      classNames={{
        base: cn(
          "inline-flex flex-row-reverse w-full max-w-xl bg-content1 hover:bg-content2 items-center",
          "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
        ),
        wrapper: "p-0 h-4 overflow-visible",
        thumb: cn("w-6 h-6 border-2 shadow-lg",
          "group-data-[hover=true]:border-primary",

          "group-data-[selected=true]:ml-6",

          "group-data-[pressed=true]:w-7",
          "group-data-[selected]:group-data-[pressed]:ml-4",
        ),
      }}
      isSelected={value}
      onValueChange={onChange}
    >
      <div className="flex flex-col gap-1">
        <p className="text-medium">Emojies</p>
        <p className="text-tiny text-default-400">
          Do you want to add emojies to your tweet?
        </p>
      </div>
    </Switch>
  );
}