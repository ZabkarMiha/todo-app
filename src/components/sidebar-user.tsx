"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/auth-client";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./user-avatar";

export default function SidebarUser() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const { open } = useSidebar();

  const handleUserSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  };

  return (
    <>
      {isPending ? (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuSkeleton size="lg" showIcon={true} />
          </SidebarMenuItem>
        </SidebarMenu>
      ) : (
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <UserAvatar imageString={session?.user.image} />
                  <span className="ml-2">{session?.user.username}</span>
                  <EllipsisVertical className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={`${open ? "top" : "right"}`}
                className="w-(--radix-popper-anchor-width)"
                align="end"
                sideOffset={open ? 5 : 15}
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    handleUserSignOut();
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      )}
    </>
  );
}
