import { SidebarTrigger } from "./ui/sidebar";

export default function TopNav() {
  return (
    <div
      className={
        "sticky top-0 flex w-full flex-row items-center pt-5 pr-7 pb-2 pl-7 backdrop-blur-xl"
      }
    >
      <SidebarTrigger className="size-6" />
    </div>
  );
}
