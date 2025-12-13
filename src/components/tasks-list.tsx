import TodoTaskCard from "@/components/todo-task-card";
import { Task } from "@/lib/types";

type TasksListProps = {
  tasks: Task[];
};

export default function TasksList({ tasks }: TasksListProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:mx-0 xl:grid-cols-3 2xl:grid-cols-4">
      {tasks.map((task) => (
        <TodoTaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
