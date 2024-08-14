import { Tabs, Tab } from "@nextui-org/tabs";

import { Component } from "@/components/component";

import { TONES } from "../type/tabs.type";


interface TabsComponentProps {
  type: TONES;
  setType: (value: TONES) => void;
  isDisabled: boolean;
}

export const ToneTabsComponent: Component<TabsComponentProps> = ({ type, setType, isDisabled }) => (
  <div id="onborda-step2"> 
    <Tabs
      aria-label="Generator type"
      className="overflow-x-auto w-full"
      color={"primary"}
      defaultSelectedKey={type}
      isDisabled={isDisabled}
      onSelectionChange={(key) => setType(key as TONES)}
    >
      <Tab key="humorisitc" title="Humoristic" />
      <Tab key="serious" title="Serious" />
      <Tab key="normal" title="Natural" />
      <Tab key="informative" title="Informative" />
    </Tabs>
  </div>
);