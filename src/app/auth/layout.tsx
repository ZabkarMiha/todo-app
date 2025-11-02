import AppLogo from "@/components/app-logo"
import { Separator } from "@/components/ui/separator"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex flex-col h-fit w-[90dvw] md:w-96 p-10 border rounded-md space-y-7 bg-form-background">
        <AppLogo className="h-10 self-center" />
        <Separator />
        {children}
      </div>
    </main>
  )
}
