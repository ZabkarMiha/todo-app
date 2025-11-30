import AppLogo from "@/components/app-logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-full w-full items-center justify-center">
      <Card className="w-[90dvw] h-[90dvh] md:w-2xl md:max-h-160 md:min-h-20 md:flex-row md:px-6 md:mx-4 overflow-auto">
        <CardHeader className="md:w-[35%] grid-rows-1">
          <AppLogo className="self-center justify-self-center" />
        </CardHeader>
        <CardContent className="flex flex-col flex-1">{children}</CardContent>
      </Card>
    </main>
  );
}
