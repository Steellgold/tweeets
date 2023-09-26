import { Badge } from "@/lib/components/ui/badge";
import { Button, buttonVariants } from "@/lib/components/ui/button";
import { Card } from "@/lib/components/ui/card";
import dayjs from "dayjs";
import { Receipt } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

export type TransactionProps = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  amount: number;
  clientReferenceId: string;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  email: string;
  invoiceUrl: string;
}

export const pricesToCredits = (price: number): number => {
  if (price === 4) return 50;
  if (price === 9) return 100;
  if (price === 14) return 300;
  return 0;
};

const Transaction = ({ createdAt,  amount, currency, status, invoiceUrl }: TransactionProps): ReactElement => {
  return (
    <Card className="flex justify-between items-center gap-2">
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">{amount},99 {currency.toUpperCase()}</span>
          <span className="text-muted">•</span>
          <Badge variant={status === "COMPLETED" ? "green" : status === "PENDING" ? "blue" : "red"}>
            {status === "COMPLETED" ? "Completed" : status === "PENDING" ? "Pending payment" : "Failed"}
          </Badge>
        </div>
        <span className="text-muted-foreground text-sm">{dayjs(createdAt).format("DD/MM/YYYY")}</span>
      </div>

      <div className="flex items-center gap-2 p-4">
        {!invoiceUrl ? (
          <Button variant={"outline"} disabled>
            <Receipt size={18} className="mr-2" />
            Invoice not available
          </Button>
        ) : (
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={invoiceUrl}
            target="_blank">
            <Receipt size={18} />&nbsp;
            Invoice
          </Link>
        )}
      </div>
    </Card>
  );
};

export default Transaction;