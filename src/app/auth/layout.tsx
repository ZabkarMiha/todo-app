import AppLogo from "@/components/app-logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-full w-full items-center justify-center">
      <Card className="h-[90dvh] w-[90dvw] overflow-auto md:mx-4 md:max-h-160 md:min-h-20 md:w-2xl md:flex-row md:px-6">
        <CardHeader className="grid-rows-1 md:w-[35%]">
          <AppLogo className="self-center justify-self-center" />
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">{children}</CardContent>
      </Card>
    </main>
  );
}
