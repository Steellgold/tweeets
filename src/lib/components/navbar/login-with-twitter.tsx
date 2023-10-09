/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Button } from "../ui/button";
import { Twitter } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserContext } from "@/lib/contexts/UserProvider";
import type { ReactElement } from "react";

export const LoginWithTwitter = (): ReactElement => {
  const supabase = createClientComponentClient();
  const { user } = useUserContext();

  if (user) return <></>;

  return (
    <Button variant={"twitter"} onClick={() => {
      void supabase.auth.signInWithOAuth({ provider: "twitter", options: {
        redirectTo: `${window.location.origin}/auth/callback`
      } });
    }}>
      <Twitter size={20} className="mr-2 text-white fill-current" />
      &nbsp;Login with Twitter
    </Button>
  );
};