import TodoTaskCard from "@/components/todo-task-card";
import { Task } from "@/lib/types";

type TasksListProps = {
  paginatedTasks: Task[];
};

export default function TasksList({ paginatedTasks }: TasksListProps) {
  return (
    <div className="mb-4 grid flex-1 grid-cols-1 gap-5 md:grid-cols-2 xl:mx-0 xl:grid-cols-3 2xl:grid-cols-4">
      {paginatedTasks.map((tasks) => (
        <TodoTaskCard key={tasks.id} task={tasks} />
      ))}
    </div>
  );
}
