
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Slider } from "@nextui-org/slider";
import { ArrowRight } from "lucide-react";

import { Component } from "@/components/component";
import { calculateCredits } from "@/config/credits";

type SliderComponentProps = {
  value: number;
  isDisabled: boolean;
  onChange: ((value: number | number[]) => void) | undefined
}

export const ThreadLengthSliderComponent: Component<SliderComponentProps> = ({ value, onChange, isDisabled }) => {
  return (
    <div id="onborda-step4">
      <Card className="w-full border-2 border-[#262629]">
        <CardHeader className="flex flex-col items-start border-b border-[#262629]">
          Thread length
          <span className="text-[#9CA3AF] text-sm">The amount of sub-tweets that your thread will have.</span>
        </CardHeader>

        <CardBody className="flex flex-col gap-2">
          <Slider 
            className="w-full" 
            color={"primary"}
            defaultValue={50}  
            formatOptions={{ style: "decimal" }}
            isDisabled={isDisabled}
            maxValue={12}
            minValue={2}
            showTooltip={true}
            step={1}
            tooltipProps={{
              placement: "top",
              color: "primary",
              content: (
                <span className="flex items-center gap-1">
                  {value} tweets <ArrowRight size={16} /> {calculateCredits(value)} credits
                </span>
              )
            }}

            value={value}
            onChange={onChange}
          />
        </CardBody>
      </Card>
    </div>
  );
}