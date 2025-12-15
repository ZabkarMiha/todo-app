import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

import { ChevronUp, Hash } from "lucide-react";
import { SidebarMenuButton, useSidebar } from "./ui/sidebar";

import { useRouter, useSearchParams } from "next/navigation";

export default function SidebarTasksPerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open, isMobile } = useSidebar();

  const handleTaskCountChange = async (value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("tasksPerPage", value);
    router.replace(`?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton>
          <Hash />
          <span className="text-nowrap">Tasks per page</span>
          <ChevronUp className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={`${isMobile ? "top" : open ? "top" : "right"}`}
        className="w-(--radix-popper-anchor-width)"
        align="end"
        sideOffset={isMobile ? 5 : open ? 5 : 15}
      >
        <DropdownMenuItem>
          <Input
            type="number"
            onClick={(e) => {
              e.preventDefault();
            }}
            defaultValue={searchParams.get("tasksPerPage") || 6}
            onChange={(e) => handleTaskCountChange(e.target.value)}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
