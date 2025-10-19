import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: "Todo App",
  description:
    "Todo App project using Next.js, TypeScript, Shadcn, Tailwind, Drizzle, Neon",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
