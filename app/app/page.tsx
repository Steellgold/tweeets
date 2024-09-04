"use client";

import { useState } from "react";
import { Tab, Tabs } from "@nextui-org/tabs";

import { useDetectDevice } from "@/lib/hooks/useDetectDevice";

import { GenerationTabPage } from "./lib/tabs/GenerationPage";
import { BillingTabPage } from "./lib/tabs/BillingTabPage";

const Page = () => {  
  const { isMobile } = useDetectDevice();
  const [isVertical] = useState(isMobile);
  const [activeTab, setActiveTab] = useState("generation");

  return (
    <div className="flex w-full flex-col items-center mx-auto gap-2">
      <div className="w-full max-w-[610px]">
        <Tabs
          aria-label="Options"
          defaultSelectedKey={"generation"}
          isVertical={isVertical}
          // @ts-ignore
          onSelectionChange={(key) => setActiveTab(key)}
        >
          <Tab key="generation" title="Generation" />
          <Tab key="billing" title="Billing" />
        </Tabs>
      </div>

      <div className="w-full max-w-[610px]">
        {activeTab === "generation" && <GenerationTabPage />}
        {activeTab === "billing" && <BillingTabPage />}
      </div>
    </div>
  );
}

export default Page;