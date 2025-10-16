import { cn } from "@/lib/utils"
import { Pencil2Icon } from "@radix-ui/react-icons"

type AppLogoProps = {
  className?: string
}

export default function AppLogo({ className }: AppLogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <svg
        viewBox="0 0 225 46"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <text
          className="fill-black dark:fill-white"
          fontFamily="Arial"
          fontSize="50px"
          y="40"
        >
          Todo App
        </text>
      </svg>
      <Pencil2Icon className="w-1/3 h-3/5"/>
    </div>
  )
}
