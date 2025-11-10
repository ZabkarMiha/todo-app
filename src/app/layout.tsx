import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Todo App",
  description:
    "Todo App project using Next.js, TypeScript, Shadcn, Tailwind, Drizzle, Neon and BetterAuth",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={"h-dvh"} suppressHydrationWarning>
      <body
        className={`md:text-md flex h-full flex-col font-sans text-base antialiased xl:text-lg`}
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
  );
}
