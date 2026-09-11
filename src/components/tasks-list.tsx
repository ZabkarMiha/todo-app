import TodoTaskCard from "@/components/todo-task-card";
import { ActionResponse, InsertUpdateTask, ReturnTask } from "@/lib/types";

type TasksListProps = {
  tasks: ReturnTask[];
  deleteTask(taskId: string): Promise<ActionResponse<{
      title: string;
  }>>
    completeTaskToggle(id: string, completed: boolean): Promise<ActionResponse<{
      title: string;
  }>>,
  updateFunction(
  id: string,
  values: InsertUpdateTask,
): Promise<ActionResponse<{ title: string }>>
};

export default function TasksList({ tasks, deleteTask, completeTaskToggle, updateFunction }: TasksListProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:mx-0 xl:grid-cols-3 2xl:grid-cols-4">
      {tasks.map((task) => (
        <TodoTaskCard key={task.id} task={task} deleteTask={deleteTask} completeTaskToggle={completeTaskToggle} updateFunction={updateFunction} />
      ))}
    </div>
  );
}
