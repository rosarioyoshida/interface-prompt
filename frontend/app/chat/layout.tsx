"use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { HistorySidebar } from "@/components/chat/HistorySidebar"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const conversationId = useMemo(() => {
    const match = pathname.match(/^\/chat\/([^/]+)$/)
    return match?.[1]
  }, [pathname])

  return (
    <div className="flex h-screen bg-background">
      <HistorySidebar conversationId={conversationId} />
      <div className="flex min-w-0 flex-1 justify-center">
        <div className="flex h-full w-full flex-col lg:w-[65%]">{children}</div>
      </div>
    </div>
  )
}
