import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const middleware = async(req: NextRequest): Promise<unknown> => {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
};