import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubTheme
} from "@/components/ui/dropdown-menu"
import AppLogo from "@/components/app-logo";
import { GearIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

export default function TopNav() {
    return (
        <div className={"grid grid-cols-2 justify-items-stretch w-screen p-7 sticky top-0 backdrop-blur-lg"}>
            <AppLogo/>
            <div className={"justify-self-end"}>
                <div className={"flex gap-5"}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant={"ghost"}><GearIcon width={20} height={20}/></Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Preferences</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubTheme/>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant={"ghost"}>My account</Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Log in</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>Register</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}