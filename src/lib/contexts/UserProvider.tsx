"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import type { Component } from "../utils/component";
import type { User } from "@supabase/supabase-js";

type ContextType = {
  user: User | null;
  setUser: (value: User | null) => void;
};

const UserContext = createContext<ContextType | null>(null);

export const useUserContext = (): ContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a DateProvider");
  }

  return context;
};

export const UserProvider: Component<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const values = { user, setUser };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};