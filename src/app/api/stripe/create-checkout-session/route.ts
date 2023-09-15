import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createPaymentLink } from "@/lib/utils/stripe";

export const GET = async(request: NextRequest): Promise<NextResponse> => {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const requestUrl = new URL(request.url);
  const credits = requestUrl.searchParams.get("count");

  let ctg: 50 | 100 | 300;
  if (!credits || credits !== "50" && credits !== "100" && credits !== "300") ctg = 50;
  else ctg = parseInt(credits) as 50 | 100 | 300;

  if (!user) return NextResponse.json({ error: "User is undefined" });

  const url = await createPaymentLink(ctg, {
    email: user.email || "",
    id: user.id
  });

  if (!url) return NextResponse.json({ error: "Stripe session url is undefined" });
  return NextResponse.json({ url });
};