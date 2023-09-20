"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { fetcher } from "@/lib/utils/fetcher";
import type { ReactElement } from "react";
import useSWR from "swr";
import TransactionsLoading from "./tr-loading";
import type { TransactionProps } from "./payment";
import Transaction from "./payment";
import Link from "next/link";
import { Undo } from "lucide-react";
import BuyCredits from "../app/credits";
import { buttonVariants } from "@/lib/components/ui/button";

type Props = {
  payments: TransactionProps[];
}

const App = (): ReactElement => {
  const { data, isLoading } = useSWR<Props>("/api/stripe/transactions", fetcher);

  return (
    <div className="mx-auto flex flex-col items-center justify-center max-w-screen-sm" suppressHydrationWarning>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>If you have buyed credits, you can see your transactions here.</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <TransactionsLoading />
          ) : (
            <div className="flex flex-col gap-2">
              {data && data.payments.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2">
                  <p>
                    You don&apos;t have any transactions yet. (😪)
                  </p>
                </div>
              )}

              {data && data.payments.length > 0 && data.payments.map((transaction) => (
                <div key={transaction.id}>
                  <Transaction {...transaction} />
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Link href="/app" className={buttonVariants({ variant: "outline" })}>
            <Undo size={24} />&nbsp;
            Back to app
          </Link>

          <BuyCredits showT={false} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default App;