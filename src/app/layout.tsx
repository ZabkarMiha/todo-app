import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import TopNav from "@/components/top-nav"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Todo App",
  description:
    "Todo App project using Next.js, TypeScript, Shadcn, Tailwind, Drizzle",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={"h-svh"} suppressHydrationWarning>
      <body className={`font-sans antialiased text-base flex flex-col h-fit md:text-md xl:text-lg`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <TopNav />
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
