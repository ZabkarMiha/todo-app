"use client"

import { useState } from "react"
import TodoTaskCard from "@/components/todo-task-card"
import AddTask from "@/components/add-task"
import { Task } from "@/lib/types"
import PaginationBar from "@/components/pagination-bar"
import SortTasks from "@/components/sort-tasks"

export default function TaskList({
  tasks,
  currentPage,
  tasksPerPage,
}: {
  tasks: Task[] | null
  currentPage: number
  tasksPerPage: number
}) {
  const [sortOrder, setSortOrder] = useState<"oldest" | "newest">(
    "newest"
  )

  const sortedTasks = [...tasks!].sort((a, b) => {
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
          <SortTasks sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </div>
      </div>
      <div className="grid grid-cols-4 grid-rows-2 gap-5 h-5/6">
        {paginatedTasks.map((task) => (
          <TodoTaskCard key={task.id} task={task} />
        ))}
      </div>
      {tasks!.length > tasksPerPage && (
        <PaginationBar
          tasksCount={tasks!.length}
          currentPage={currentPage}
          tasksPerPage={tasksPerPage}
        />
      )}
    </div>
  )
}
