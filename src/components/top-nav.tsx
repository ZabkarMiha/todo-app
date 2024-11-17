import {ThemeToggleButton} from "@/components/theme-toggle-button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AppLogo from "@/components/app-logo";

export default function TopNav() {
    return (
        <div className={"grid grid-cols-2 justify-items-stretch w-screen p-7 sticky top-0 backdrop-blur-lg"}>
            <AppLogo/>
            <div className={"justify-self-end"}>
                <div className={"flex gap-5"}>
                    <DropdownMenu>
                        <DropdownMenuTrigger>My account</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Log in</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>Register</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ThemeToggleButton/>
                </div>
            </div>
        </div>
    );
}