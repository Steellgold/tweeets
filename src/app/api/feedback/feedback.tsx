import { cn } from "@/lib/utils";
import * as React from "react";

type EmailTemplateProps = {
  email: string;
  feedback: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ email, feedback }) => (
  <div className="mx-auto flex flex-col items-center justify-center max-w-screen-2xl" suppressHydrationWarning>
    <div className="flex flex-col items-center justify-center">
      <h1 className={cn(
        "text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent",
        "bg-gradient-to-b from-yellow-200 to-zinc-300"
      )}>
        Feedback from
      </h1>

      <p className="md:text-xl text-yellow-100 mx-auto">
        {email}
      </p>

      <p className="md:text-xl text-yellow-100 mx-auto">
        {feedback}
      </p>
    </div>
  </div>
);