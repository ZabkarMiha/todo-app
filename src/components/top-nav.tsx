import { SidebarTrigger } from "./ui/sidebar";

export default function TopNav() {
  return (
    <div
      className={
        "absolute top-0 flex w-full flex-row items-center py-4 pr-7 pl-7 backdrop-blur-xl md:hidden"
      }
    >
      <SidebarTrigger className="block size-6 md:hidden" />
    </div>
  );
}
