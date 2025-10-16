import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import TopNav from "@/components/top-nav"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "Todo App",
  description:
    "Todo App project using Next.js, TypeScript, Shadcn, Tailwind, Drizzle, Neon",
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en" className={"h-svh"} suppressHydrationWarning>
      <body
        className={`font-sans antialiased text-base flex flex-col h-fit md:text-md xl:text-lg`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className={"h-full w-full"}>
              <TopNav />
              <Toaster />
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
