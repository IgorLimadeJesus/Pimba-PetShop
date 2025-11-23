"use client"

import React from "react"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/lib/auth-context"
import { ClientProvider } from "@/lib/client-context"
import { UserProvider } from "@/lib/user-context"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <UserProvider>
          <ClientProvider>{children}</ClientProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
