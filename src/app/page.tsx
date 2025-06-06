import Tasks from "@/components/tasks"
import { getAllTasks } from "@/lib/actions"
import AddTask from "@/components/add-task"

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: PageProps) {
  const tasks = await getAllTasks()

  return (
    <>
      {tasks === null ? (
        <h1>Something went wrong</h1>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)]">
          <h1 className="text-5xl font-bold mb-4">Add your first task!</h1>
          <AddTask />
        </div>
      ) : (
        <>
          <Tasks
            tasks={tasks}
            currentPage={parseInt(searchParams.page as string) || 1}
            tasksPerPage={8}
          />
        </>
      )}
    </>
  )
}
