import { SidebarTrigger } from "./ui/sidebar"

export default function TopNav() {
  return (
    <div className={"sticky top-0 backdrop-blur-xl flex flex-row items-center w-full p-3"}>
      <SidebarTrigger className="w-5 h-5"/>
    </div>
  )
}
