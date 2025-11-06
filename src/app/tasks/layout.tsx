import TopNav from "@/components/top-nav"
import AppSidebar from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

export default async function TasksLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className={"h-fit min-h-full w-full"}>
        <TopNav />
        <Toaster />
        {children}
      </main>
    </SidebarProvider>
  )
}
