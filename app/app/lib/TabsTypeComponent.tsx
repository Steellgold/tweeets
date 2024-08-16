import { Tabs, Tab } from "@nextui-org/tabs";
import { MessageSquare, MessagesSquare } from "lucide-react";

import { Component } from "@/components/component";

import { TYPE } from "../type/tabs.type";


interface TabsComponentProps {
  type: TYPE;
  setType: (value: TYPE) => void;
  onChange: (type: TYPE) => void;
  isDisabled: boolean;
}

export const TypeTabsComponent: Component<TabsComponentProps> = ({ type, setType, onChange, isDisabled }) => {
  return (
    <Tabs
      aria-label="Generator type"
      color={"primary"}
      defaultSelectedKey={type}
      isDisabled={isDisabled}
      onSelectionChange={(key) => {
        setType(key as TYPE)
        onChange(type);
      }}
    >
      <Tab key="singleTweet" title={
        <div className="flex items-center gap-1">
          <MessageSquare size={16} />
          Single
        </div>
      } />

      <Tab key="thread" title={
        <div className="flex items-center gap-1">
          <MessagesSquare size={16} />
          Thread
        </div>
      } />
    </Tabs>
  )
}