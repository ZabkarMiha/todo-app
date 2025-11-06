"use client"

import TasksList from "./tasks-list"
import Dock from "./dock"

import { Task } from "@/lib/types"

import { useSearchParams } from "next/navigation"

type ContentProps = {
  tasks: Task[] | null
  currentPage: number
  tasksPerPage: number
}

export default function Content({
  tasks,
  currentPage,
  tasksPerPage,
}: ContentProps) {
  const searchParams = useSearchParams()

  const sortOrder =
    new URLSearchParams(searchParams).get("sort") === "oldest"
      ? "oldest"
      : "newest"

  const query =
    new URLSearchParams(searchParams).get("query")?.toLowerCase() || ""

  const filteredTasks = query
    ? tasks!.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description?.toLowerCase().includes(query) ?? false)
      )
    : tasks!

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.dateAdded).getTime()
    const dateB = new Date(b.dateAdded).getTime()
    return sortOrder === "oldest" ? dateA - dateB : dateB - dateA
  })

  const startIndex = (currentPage - 1) * tasksPerPage
  const paginatedTasks = sortedTasks.slice(
    startIndex,
    startIndex + tasksPerPage
  )

  return (
    <div className="flex flex-col mx-5 mb-2 mt-2 md:mx-10 xl:mx-20">
      <TasksList paginatedTasks={paginatedTasks} />
      <Dock
        filteredTasksLength={filteredTasks.length}
        tasksPerPage={tasksPerPage}
        currentPage={currentPage}
      />
    </div>
  )
}
