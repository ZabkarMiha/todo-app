"use client"

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
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import AppLogo from "@/components/app-logo"
import { GearIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import useLocalStorage from "@/hooks/use-localStorage"

export default function TopNav() {
  const [tasksPerPage, setTasksPerPage] = useLocalStorage<number>(
    "tasksPerPage",
    8
  )

  return (
    <div
      className={
        "sticky top-0 backdrop-blur-xl flex flex-row items-center w-full p-7"
      }
    >
      <AppLogo className="w-32 h-8 md:w-52 md:h-10" />
      <div className={"ml-auto flex gap-5"}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <GearIcon width={20} height={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Preferences</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Tasks per page:
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={String(tasksPerPage)}
                      onChange={(e) => {
                        const next = Math.max(
                          1,
                          Math.min(20, Number(e.target.value) || 1)
                        )
                        setTasksPerPage(next)
                      }}
                    />
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubTheme />
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>My account</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Log in</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Register</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
