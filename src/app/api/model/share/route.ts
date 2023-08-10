import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/utils/database";
import { ModelShareInputSchema } from "@/lib/utils/schemas";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const schema = ModelShareInputSchema.safeParse(await request.json());
  if (!schema.success) return NextResponse.json(schema.error, { status: 400 });

  const { modelId, link } = schema.data;
  await prisma.model.update({
    data: { shareLink: link },
    where: { id: modelId }
  });

  return NextResponse.json({ success: true }, { status: 200 });
}