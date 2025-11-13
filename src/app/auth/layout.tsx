import AppLogo from "@/components/app-logo";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <Card className="w-[90dvw] md:w-96">
        <AppLogo className="h-12 self-center m-2" />
        <Separator />
        {children}
      </Card>
    </main>
  );
}
