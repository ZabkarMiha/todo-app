import { SidebarTrigger } from "./ui/sidebar"

export default function TopNav() {
  return (
    <div className={"sticky top-0 backdrop-blur-xl flex flex-row items-center w-full pl-7 pt-5 pr-7 pb-2"}>
      <SidebarTrigger className="size-6"/>
    </div>
  )
}
