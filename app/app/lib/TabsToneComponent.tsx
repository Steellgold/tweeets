import { Tabs, Tab } from "@nextui-org/tabs";

import { TONES } from "../type/tabs.type";

import { Component } from "@/components/component";

interface TabsComponentProps {
  type: TONES;
  setType: (value: TONES) => void;
}

export const ToneTabsComponent: Component<TabsComponentProps> = ({ type, setType }) => (
  <div id="onborda-step2"> 
    <Tabs
      aria-label="Generator type"
      color={"primary"}
      defaultSelectedKey={type}
      onSelectionChange={(key) => setType(key as TONES)}
    >
      <Tab key="humorisitc" title="Humoristic" />
      <Tab key="serious" title="Serious" />
      <Tab key="informative" title="Informative" />
      <Tab key="normal" title="Normal" />
    </Tabs>
  </div>
);