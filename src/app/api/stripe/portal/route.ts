import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { Database } from "@/lib/utils/supabase";

export const POST = async(/** request: NextRequest **/): Promise<NextResponse> => {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: null });

  return NextResponse.json({ ann: "ann" });
};