import { cn } from "@/lib/utils";
import type { PropsWithChildren, ReactElement } from "react";

type TitleProps = PropsWithChildren & {
  type: "error" | "success" | "default";
};

const Title = ({ children, type = "default" }: TitleProps): ReactElement => {
  return (
    <h1 className={cn(
      "text-2xl font-bold tracking-tighter sm:text-5xl xl:text-6xl bg-clip-text text-transparent",
      "bg-gradient-to-r h-full text-center py-3",
      {
        "from-red-500 via-red-400 to-red-500": type == "error",
        "from-green-500 via-green-400 to-green-500": type == "success",
        "from-zinc-500 via-zinc-300 to-zinc-500": type == "default"
      }
    )}>
      {children}
    </h1>
  );
};

export default Title;