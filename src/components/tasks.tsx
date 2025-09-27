"use client"

import { Task } from "@/lib/types"
import TodoTaskCard from "@/components/todo-task-card"
import PaginationBar from "@/components/pagination-bar"
import { useSearchParams } from "next/navigation"
import Dock from "./dock"

export default function TaskList({
  tasks,
  currentPage,
  tasksPerPage,
}: {
  tasks: Task[] | null
  currentPage: number
  tasksPerPage: number
}) {
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
    <div className="flex flex-col space-y-10 xl:mt-10 xl:mb-52 xl:mx-20 xl:h-full">
      <div className="grid grid-cols-1 auto-rows-[minmax(0,21rem)] gap-5 mx-5 mb-36 md:mb-28 md:grid-cols-2 xl:mx-0 xl:mb-0 xl:grid-cols-4">
        {paginatedTasks.map((task) => (
          <TodoTaskCard key={task.id} task={task} />
        ))}
      </div>
      <div className="fixed left-0 right-0 bottom-2 z-50 w-[calc(100svw-1rem)] outline outline-1 outline-container-outline backdrop-blur-xl p-2 rounded-md flex flex-col space-y-1 mx-auto md:flex-row md:self-center md:justify-center md:space-y-0 md:space-x-1 xl:w-fit xl:bottom-10">
        {filteredTasks.length > tasksPerPage && (
          <PaginationBar
            tasksCount={filteredTasks.length}
            currentPage={currentPage}
            tasksPerPage={tasksPerPage}
            className="self-center h-full"
          />
        )}
        <Dock/>
      </div>
    </div>
  )
}
