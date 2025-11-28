"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { ClerkProvider, useUser, ClerkLoaded } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";
import axios from "axios";
import UserDetailsContext from "@/context/UserDetailsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkThemeWrapper>{children}</ClerkThemeWrapper>
    </ThemeProvider>
  );
}

function ClerkThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState<string>();
  const [userDetails, setUserDetails] = useState<any>();
  // Wait until theme is ready to prevent hydration mismatch
  useEffect(() => {
    if (theme) setResolvedTheme(theme);
  }, [theme]);

  if (!resolvedTheme) return null; // Avoids flicker

  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : "simple",
      }}
    >
      <ClerkLoaded>
        <UserSync />
        <UserDetailsContext.Provider value={{userDetails, setUserDetails}}>
        {children}
        </UserDetailsContext.Provider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

function UserSync() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    const syncUser = async () => {
      try {
        const result = await axios.post("/api/users",{

        });
        console.log("User synced:", result.data);
      } catch (err) {
        console.error("Sync failed:", err);
      }
    };
    syncUser();
  }, [user]);

  return null; // doesn’t render anything
}
