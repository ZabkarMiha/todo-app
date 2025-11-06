"use server"

import AddTask from "@/components/edit-add-task"
import Content from "@/components/content"

import { getAllTasks, getTasksCount } from "@/lib/actions/database"

import { redirect } from "next/navigation"
import { auth } from "../../lib/auth/auth"
import { headers } from "next/headers"

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/auth/login")
  }

  const tasksCountResult = await getTasksCount(session!.user.id)

  if (tasksCountResult.error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
        <h1>Error: {tasksCountResult.error}</h1>
      </div>
    )
  }

  if (tasksCountResult.data === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
        <h1 className="text-5xl font-bold mb-4">Add your first task!</h1>
        <AddTask />
      </div>
    )
  }

  const tasksResult = await getAllTasks(session!.user.id)
  if (tasksResult.error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
        <h1>Error: {tasksResult.error}</h1>
      </div>
    )
  }

  const currentPage = Number(searchParams?.page) || 1
  return (
    <Content
      tasks={tasksResult.data || null}
      currentPage={currentPage}
      tasksPerPage={6}
    />
  )
}
