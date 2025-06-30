"use client"

import { Task } from "@/lib/types"
import TodoTaskCard from "@/components/todo-task-card"
import AddTask from "@/components/add-task"
import PaginationBar from "@/components/pagination-bar"
import SortTasks from "@/components/sort-tasks"
import Search from "./search"
import { useSearchParams } from "next/navigation"

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
    <div className="flex flex-col my-10 mx-20 gap-5 h-4/5">
      <div className="flex flex-row w-full">
        <div className="justify-self-start">
          <AddTask />
        </div>
        <div className="justify-self-end ml-auto">
          <Search />
        </div>
        <div className="justify-self-end ml-auto">
          <SortTasks />
        </div>
      </div>
      <div className="grid grid-cols-4 grid-rows-2 gap-5 h-5/6">
        {paginatedTasks.map((task) => (
          <TodoTaskCard key={task.id} task={task} />
        ))}
      </div>
      {filteredTasks.length > tasksPerPage && (
        <PaginationBar
          tasksCount={filteredTasks.length}
          currentPage={currentPage}
          tasksPerPage={tasksPerPage}
        />
      )}
    </div>
  )
}
