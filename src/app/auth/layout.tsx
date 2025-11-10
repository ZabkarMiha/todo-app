import AppLogo from "@/components/app-logo";
import { Separator } from "@/components/ui/separator";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <div className="bg-form-background flex h-fit w-[90dvw] flex-col space-y-7 rounded-md border p-10 md:w-96">
        <AppLogo className="h-10 self-center" />
        <Separator />
        {children}
      </div>
    </main>
  );
}
