import AppLogo from "@/components/app-logo"
import { Button } from "@/components/ui/button"
import { Pencil2Icon } from "@radix-ui/react-icons"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col h-[70dvh] w-[70dvw] items-center px-20 py-10 border rounded-md space-x-6 bg-form-background md:flex-row">
        <div className="grow">
          <p className="text-6xl font-bold mb-3">Welcome!</p>
          <p className="ml-2">
            This app aims to provide a seamless way of tracking your ongoing
            tasks. 
          </p>
          <p className="ml-2 mt-2">With a simple and intuitive interface, you can add, edit and
            delete tasks. Sign in or register to start tasking!</p>
          <Button className="text-2xl h-16 mt-14" variant="outline" asChild>
            <Link href="/auth/login">Get started</Link>
          </Button>
        </div>
        <div className="flex-none w-60"><Pencil2Icon height="100%" width="100%"/></div>
      </div>
    </div>
  )
}
