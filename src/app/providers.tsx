"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth/client";
import "@neondatabase/auth-ui/css";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      redirectTo="/dashboard"
      Link={({ href, children, ...props }) => (
        <a href={href} {...props}>{children}</a>
      )}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
