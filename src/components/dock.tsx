import EditAddTask from "./edit-add-task"
import PaginationBar from "./pagination-bar"
import Search from "./search"
import SortTasks from "./sort-tasks"

type DockProps = {
  filteredTasksLength: number
  tasksPerPage: number
  currentPage: number
}

export default function Dock({
  filteredTasksLength,
  tasksPerPage,
  currentPage,
}: DockProps) {
  return (
    <div className="sticky bottom-2 outline outline-1 outline-container-outline backdrop-blur-xl p-2 rounded-md flex flex-col space-y-1 mx-auto md:flex-row md:self-center md:justify-center md:space-y-0 md:space-x-1">
      <div className="flex flex-row space-x-5 p-1 items-center h-auto">
        {filteredTasksLength > tasksPerPage && (
          <PaginationBar
            tasksCount={filteredTasksLength}
            currentPage={currentPage}
            tasksPerPage={tasksPerPage}
            className="self-center h-full"
          />
        )}
        <EditAddTask />
        <Search className="h-full w-full" />
        <SortTasks className="h-full" />
      </div>
    </div>
  )
}
