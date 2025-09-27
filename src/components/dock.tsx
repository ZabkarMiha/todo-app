import AddTask from "./add-task"
import Search from "./search"
import SortTasks from "./sort-tasks"

export default function Dock() {
  return (
    <div className="flex flex-row space-x-5 p-1 items-center h-auto">
      <AddTask className="" />
      <Search className="h-full w-full" />
      <SortTasks className="h-full" />
    </div>
  )
}
