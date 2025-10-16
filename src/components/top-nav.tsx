import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubTheme,
} from "@/components/ui/dropdown-menu"
import { GearIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import { SidebarTrigger } from "./ui/sidebar"

export default function TopNav() {
  return (
    <div className={"sticky top-0 backdrop-blur-xl flex flex-row items-center w-full p-5"}>
      <SidebarTrigger className="w-5 h-5"/>
      <div className={"ml-auto flex gap-5"}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <GearIcon width={20} height={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubTheme />
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
