
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Slider } from "@nextui-org/slider";
import { BadgeCheck } from "lucide-react";

import { Component } from "@/components/component";

type SliderComponentProps = {
  value: number;
  isDisabled: boolean;
  onChange: ((value: number | number[]) => void) | undefined
}

export const LengthSliderComponent: Component<SliderComponentProps> = ({ value, onChange, isDisabled }) => {
  return (
    <Card className="w-full border-2 border-[#262629]">
      <CardHeader className="flex flex-col items-start border-b border-[#262629]">
        Tweet length
        <span className="text-[#9CA3AF] text-sm">
          The amount of characters that your tweet will have.
        </span>
      </CardHeader>

      <CardBody className="flex flex-col gap-2">
        <Slider
          className="w-full"
          color={"primary"}
          defaultValue={50}
          formatOptions={{ style: "decimal" }}
          isDisabled={isDisabled}
          maxValue={500}
          minValue={15}
          showTooltip={true}
          step={1}
          tooltipProps={{
            placement: "top",
            color: "primary",
            content: (
              <div className="flex items-center gap-1">
                {value > 280 && <BadgeCheck size={12} />}
                <span>
                  {value} characters
                </span>
              </div>
            )
          }}
          value={value}
          onChange={onChange}
        />
      </CardBody>
    </Card>
  );
}