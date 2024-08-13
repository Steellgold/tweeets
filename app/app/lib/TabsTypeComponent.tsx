import { Tabs, Tab } from "@nextui-org/tabs";
import { MessageSquare, MessagesSquare } from "lucide-react";

import { TYPE } from "../type/tabs.type";

import { Component } from "@/components/component";

interface TabsComponentProps {
  type: TYPE;
  setType: (value: TYPE) => void;
  onChange: (type: TYPE) => void;
}

export const TypeTabsComponent: Component<TabsComponentProps> = ({ type, setType, onChange }) => (
  <div id="onborda-step3"> 
    <Tabs
      aria-label="Generator type"
      color={"primary"}
      defaultSelectedKey={type}
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
  </div>
);
