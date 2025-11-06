import { Task } from "@/lib/types"
import TodoTaskCard from "@/components/todo-task-card"

type TasksListProps = {
  paginatedTasks: Task[]
}

export default function TasksList({ paginatedTasks }: TasksListProps) {
  return (
    <div className="grid grid-cols-1 flex-1 gap-5 mb-4 md:grid-cols-2 xl:mx-0 xl:grid-cols-3 2xl:grid-cols-4">
      {paginatedTasks.map((tasks) => (
        <TodoTaskCard key={tasks.id} task={tasks} />
      ))}
    </div>
  )
}
