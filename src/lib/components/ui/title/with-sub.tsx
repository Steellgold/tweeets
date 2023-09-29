import { cn } from "@/lib/utils";
import type { PropsWithChildren, ReactElement } from "react";

type TitleWithtoutSubTitleProps = {
  title: string;
  subtitle?: string;
  subtitleSize?: number;
  type: "error" | "success" | "default";
};

const TitleAndSubTitle = ({ title, subtitle, type = "default", subtitleSize = 75 }: TitleWithtoutSubTitleProps): ReactElement => {
  return (
    <>
      <h1 className={cn(
        "text-2xl font-bold tracking-tighter sm:text-5xl xl:text-6xl bg-clip-text text-transparent",
        "bg-gradient-to-r h-full text-center py-3",
        {
          "from-red-500 via-red-400 to-red-500": type == "error",
          "from-green-500 via-green-400 to-green-500": type == "success",
          "from-zinc-500 via-zinc-300 to-zinc-500": type == "default"
        }
      )}>
        {title}
      </h1>

      <p className={cn("md:text-xl mx-auto text-center", {
        "text-red-400": type == "error",
        "text-green-400": type == "success",
        "text-zinc-400": type == "default"
      })} style={{ width: `${subtitleSize}%` }}>
        {subtitle}
      </p>
    </>
  );
};

export default TitleAndSubTitle;