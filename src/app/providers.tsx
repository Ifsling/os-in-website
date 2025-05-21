// app/providers.tsx
"use client"

import { HeroUIProvider } from "@heroui/react"
import { ToastProvider } from "@heroui/toast"
import { Provider } from "react-redux"
import { store } from "src/redux/store"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      <Provider store={store}>{children}</Provider>
    </HeroUIProvider>
  )
}
