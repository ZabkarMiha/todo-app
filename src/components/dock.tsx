import EditAddTask from "./edit-add-task";
import PaginationBar from "./pagination-bar";
import Search from "./search";
import SortTasks from "./sort-tasks";

type DockProps = {
  tasksCount: number;
  tasksPerPage: number;
  currentPage: number;
};

export default function Dock({
  tasksCount,
  tasksPerPage,
  currentPage,
}: DockProps) {
  return (
    <div className="outline-border fixed bottom-2 mx-2 self-center rounded-md p-2 outline-1 backdrop-blur-xl">
      <div className="flex flex-col p-1">
        <div className="mb-2 self-center">
          <PaginationBar
            tasksCount={tasksCount}
            currentPage={currentPage}
            tasksPerPage={tasksPerPage}
            className="h-full self-center"
          />
        </div>
        <div className="flex flex-row gap-2">
          <SortTasks className="h-full" />
          <Search className="h-full w-full" />
          <EditAddTask />
        </div>
      </div>
    </div>
  );
}
