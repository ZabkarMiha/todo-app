import { Button } from "@/components/ui/button";
import { NotebookPen } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../lib/auth/auth";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/tasks");
  }

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
            <Link href="/auth/login">Proceed to login</Link>
          </Button>
          <p>OR</p>
          <Button className="mt-14 h-16 text-2xl" variant="outline" asChild>
            <Link href="/tasks">Continue as guest</Link>
          </Button>
        </div>
        <div className="w-60 flex-none">
          <NotebookPen height="100%" width="100%" />
        </div>
      </div>
    </div>
  );
}
