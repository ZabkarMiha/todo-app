"use client"

import { useState } from "react"
import TodoTaskCard from "@/components/todo-task-card"
import AddTask from "@/components/add-task"
import { Task } from "@/lib/types"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import PaginationBar from "@/components/pagination-bar"

export default function TaskList({
  tasks,
  currentPage,
  tasksPerPage,
}: {
  tasks: Task[] | null
  currentPage: number
  tasksPerPage: number
}) {
  const [sortOrder, setSortOrder] = useState<"ascending" | "descending">(
    "descending"
  )

  if (!tasks) return null

  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.dateAdded).getTime()
    const dateB = new Date(b.dateAdded).getTime()
    return sortOrder === "ascending" ? dateA - dateB : dateB - dateA
  })

  const startIndex = (currentPage - 1) * tasksPerPage
  const paginatedTasks = sortedTasks.slice(
    startIndex,
    startIndex + tasksPerPage
  )

  return (
    <div className="my-10 mx-20 space-y-5 h-full">
      <div className="flex items-center justify-center w-full ">
        <div className="justify-self-start flex-grow">
          <AddTask />
        </div>
        <div className="flex justify-end items-center space-x-2 outline outline-1 outline-neutral-200 dark:outline-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-md">
          <Label>Sort by date:</Label>
          <RadioGroup
            value={sortOrder}
            onValueChange={(value) =>
              setSortOrder(value as "ascending" | "descending")
            }
            className="flex items-center"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="bg-white dark:bg-neutral-900"
                value="descending"
                id="option-one"
              />
              <Label htmlFor="option-one">Newest first</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ascending" id="option-two" />
              <Label htmlFor="option-two">Oldest first</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className="grid grid-cols-4 grid-rows-2 h-4/5 gap-5">
        {paginatedTasks.map((task) => (
          <TodoTaskCard key={task.id} task={task} />
        ))}
      </div>
      {tasks.length > tasksPerPage && (
        <PaginationBar
          tasksCount={tasks.length}
          currentPage={currentPage}
          tasksPerPage={tasksPerPage}
        />
      )}
    </div>
  )
}
