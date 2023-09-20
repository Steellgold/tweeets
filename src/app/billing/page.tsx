"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { fetcher } from "@/lib/utils/fetcher";
import type { ReactElement } from "react";
import useSWR from "swr";
import TransactionsLoading from "./tr-loading";
import type { TransactionProps } from "./payment";
import Transaction from "./payment";

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
              {data && data.payments.length > 0 && data.payments.map((transaction) => (
                <div key={transaction.id}>
                  <Transaction {...transaction} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default App;