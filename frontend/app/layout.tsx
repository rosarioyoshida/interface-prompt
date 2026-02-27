import type { Metadata } from "next"
import Script from "next/script"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Prompt Interface",
  description: "Interface web para envio de prompts para IA",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "(() => { try { const theme = localStorage.getItem('theme'); if (theme === 'dark') { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); } } catch {} })();",
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
