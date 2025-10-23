import { cn } from "@/lib/utils"
import { Pencil2Icon } from "@radix-ui/react-icons"

type AppLogoProps = {
  className?: string
}

export default function AppLogo({ className }: AppLogoProps) {
  return (
    <div className={cn("flex flex-row items-center w-fit", className)}>
      <svg
        viewBox="0 0 225 45"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="grow"
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
      <Pencil2Icon height="100%" width="15%"/>
    </div>
  )
}
