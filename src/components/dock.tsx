import EditAddTask from "./edit-add-task";
import PaginationBar from "./pagination-bar";
import Search from "./search";
import SortTasks from "./sort-tasks";

type DockProps = {
  filteredTasksLength: number;
  tasksPerPage: number;
  currentPage: number;
};

export default function Dock({
  filteredTasksLength,
  tasksPerPage,
  currentPage,
}: DockProps) {
  return (
    <div className="sticky bottom-4 mx-2 h-fit rounded-md p-2 backdrop-blur-xl outline-1 outline-border sm:mx-0 sm:self-center">
      <div className="flex flex-col space-y-2 p-1 ">
        <div className="flex flex-row space-x-2 self-center">
          <div>
            {filteredTasksLength > tasksPerPage && (
              <PaginationBar
                tasksCount={filteredTasksLength}
                currentPage={currentPage}
                tasksPerPage={tasksPerPage}
                className="h-full self-center"
              />
            )}
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <SortTasks className="h-full" />
          <Search className="h-full w-full" />
          <EditAddTask />
        </div>
      </div>
    </div>
  );
}
