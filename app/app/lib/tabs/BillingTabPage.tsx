"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { z } from "zod";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Image } from "@nextui-org/image";
import { LifeBuoy, Receipt } from "lucide-react";
import { Link } from "@nextui-org/link";
import { Chip } from "@nextui-org/chip";

import { responseSchema } from "@/lib/types/post.type";
import { stripePortalAction } from "@/lib/actions/stripe-portal.action";
import { paymentsSchema } from "@/lib/types/user.type";
import { priceIdToCredits } from "@/config/stripe";
import { dayJS } from "@/lib/dayjs/day-js";

export type GenerateFormActionState = {
  isError: boolean;
  errorType?: "textarea" | "alert";
  message?: string;
  data: z.infer<typeof responseSchema>;
  newCreditsCount: number;
};

export const BillingTabPage = () => {
  const { data: session, status } = useSession();
  const [dataLoading, setDataLoading] = useState(true);
  const [data, setData] = useState<z.infer<typeof paymentsSchema> | null>(null);

  useEffect(() => {
    if (session) {
      fetch("/api/auth/payments")
        .then((res) => res.json())
        .then((data) => {
          setData(data.payments);
          setDataLoading(false);
        });
    }
  }, [session]);

  return (
    <>
      <Card className="w-full border-2 border-[#393941]">
        <CardHeader className="border-b border-[#393941] flex flex-col items-start p-4">
          Billing
          <span className="text-[#9CA3AF] text-sm">
            Everything about your credits, billing and payments
          </span>
        </CardHeader>

        <CardBody className="p-4">
          {status === "loading" || dataLoading && (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          )}

          {status === "unauthenticated" && (
            <div className="flex justify-center items-center">
              <p className="text-[#9CA3AF] text-sm">Sign in to view your billing</p>
            </div>
          )}

          {status === "authenticated" && (
            <>
              {data?.map((payment) => (
                <Card key={payment.id} className="mb-4">
                  <CardBody className="flex-col">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center hidden sm:flex">
                        <Image
                          alt="Credits"
                          className="object-contain"
                          height={100}
                          src={`https://github.com/Steellgold/tweeets/blob/ui/public/credits/${priceIdToCredits(payment.priceId)}.png?raw=true`}
                          width={100}
                        />
                      </div>

                      <div className="flex items-center">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <p className="text-lg text-[#9CA3AF]">
                              {priceIdToCredits(payment.priceId)} credits
                            </p>

                            <Chip color="default" size="sm" variant="flat">
                              {payment.price == 0.6 ? "0.60" : payment.price}&nbsp;
                              {payment.currency.toUpperCase()}
                            </Chip>
                          </div>
                          
                          <Chip color={
                            payment.status === "PENDING" ? "warning" :
                            payment.status === "FAILED" ? "danger" :
                            payment.status === "SUCCESS" ? "success" :
                            payment.status === "EXPIRED" ? "danger" :
                            payment.status === "REFUNDED" ? "danger" : "default"
                          } size="sm" variant="flat">
                            {
                              payment.status === "PENDING" ? "Payment pending" :
                              payment.status === "FAILED" ? "Payment failed" :
                              payment.status === "SUCCESS" ? "Payment success" :
                              payment.status === "EXPIRED" ? "Payment expired" :
                              payment.status === "REFUNDED" ? "Payment refunded" :
                              "Unknown"
                            }
                          </Chip>
                          
                          {payment.expiresAt && payment.status == "PENDING" && (
                            <p className="text-[#9CA3AF] text-sm">Expires at: {dayJS(payment.expiresAt).format("DD/MM/YYYY [at] HH:mm")}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <p className="text-[#9CA3AF]">
                          {dayJS(payment.createdAt).format("DD/MM/YYYY [at] HH:mm")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {payment.invoiceUrl && (
                          <Button as={Link} color="primary" href={payment.invoiceUrl} size="sm" startContent={<Receipt size={16} />}>View Invoice</Button>
                        )}

                        {payment.checkoutSessionUrl && payment.status === "PENDING" && (
                          <Button as={Link} color="primary" href={payment.checkoutSessionUrl} size="sm">Pay Now</Button>
                        )}

                        {payment.checkoutSessionUrl && payment.status === "SUCCESS" && (
                          <Button color="primary" size="sm" variant="flat">
                            <LifeBuoy size={16} /> Help
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </>
          )}
        </CardBody>

        <CardFooter className="flex justify-end">
          <form action={stripePortalAction}>
            <Button color="primary" size="sm" type="submit" variant="flat">
              Billing Portal
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}