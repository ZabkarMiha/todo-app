import { Button } from "@/components/ui/button";
import { Pencil2Icon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="bg-form-background flex h-[70dvh] w-[70dvw] flex-col items-center space-x-6 rounded-md border px-20 py-10 md:flex-row">
        <div className="grow">
          <p className="mb-3 text-6xl font-bold">Welcome!</p>
          <p className="ml-2">
            This app aims to provide a seamless way of tracking your ongoing
            tasks.
          </p>
          <p className="mt-2 ml-2">
            With a simple and intuitive interface, you can add, edit and delete
            tasks. Sign in or register to start tasking!
          </p>
          <Button className="mt-14 h-16 text-2xl" variant="outline" asChild>
            <Link href="/auth/login">Get started</Link>
          </Button>
        </div>
        <div className="w-60 flex-none">
          <Pencil2Icon height="100%" width="100%" />
        </div>
      </div>
    </div>
  );
}
