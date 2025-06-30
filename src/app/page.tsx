"use server"

import Tasks from "@/components/tasks"
import { getAllTasks, getTasksCount } from "@/lib/actions"
import AddTask from "@/components/add-task"

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams
  const tasksCountResult = await getTasksCount()

  if (tasksCountResult.error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)]">
        <h1>Error: {tasksCountResult.error}</h1>
      </div>
    )
  }

  if (tasksCountResult.data === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)]">
        <h1 className="text-5xl font-bold mb-4">Add your first task!</h1>
        <AddTask />
      </div>
    )
  }

  const tasksResult = await getAllTasks()
  if (tasksResult.error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)]">
        <h1>Error: {tasksResult.error}</h1>
      </div>
    )
  }

  const currentPage = Number(searchParams?.page) || 1
  return (
    <Tasks
      tasks={tasksResult.data || null}
      currentPage={currentPage}
      tasksPerPage={8}
    />
  )
}
