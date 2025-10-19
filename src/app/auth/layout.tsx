import AppLogo from "@/components/app-logo"
import { Separator } from "@/components/ui/separator"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex flex-col items-center justify-center h-dvh w-full">
        <div className="h-fit w-fit p-10 border rounded-md space-y-7">
            <AppLogo className="h-[30%]"/>
            <Separator />
            {children}
        </div>
    </main>
  )
}
