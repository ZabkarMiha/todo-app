import AppLogo from "@/components/app-logo"
import { Separator } from "@/components/ui/separator"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex flex-col items-center justify-center h-dvh w-full">
      <div className="flex flex-col items-center h-fit w-[30%] p-10 border rounded-md space-y-7 bg-form-background">
        <AppLogo className="h-10" />
        <Separator />
        {children}
      </div>
    </main>
  )
}
