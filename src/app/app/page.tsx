import { Card, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card";
import type { ReactElement } from "react";
import Generator from "./generator";

const App = (): ReactElement => {
  return (
    <div className="mx-auto flex flex-col items-center justify-center max-w-screen-sm" suppressHydrationWarning>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tweet like a pro</CardTitle>
          <CardDescription>Generate your tweets with AI for a better engagement on Twitter/X</CardDescription>
        </CardHeader>

        <Generator />
      </Card>
    </div>
  );
};

export default App;