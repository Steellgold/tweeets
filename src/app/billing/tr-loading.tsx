import { Skeleton } from "@/lib/components/ui/skeleton";
import type { ReactElement } from "react";

const TransactionsLoading = (): ReactElement => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
    </div>
  );
};

export default TransactionsLoading;