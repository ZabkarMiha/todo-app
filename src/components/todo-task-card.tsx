"use client"

import { Toggle } from "@/components/ui/toggle"
import { Label } from "@/components/ui/label"
import { Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { completeTaskToggle, deleteTask } from "@/lib/actions"
import { toast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { CheckIcon } from "@radix-ui/react-icons"

export default function TodoTaskCard({ task }: { task: Task }) {
  const [date, setDate] = useState("")

  useEffect(() => {
    setDate(
      task.dateAdded.toLocaleDateString() +
        " " +
        task.dateAdded.toLocaleTimeString()
    )
  }, [task.dateAdded])

  const deleteTaskOnClick = async () => {
    const fetchedData = await deleteTask(task.id)

    toast({
      title:
        fetchedData === null
          ? "Uh oh! Something went wrong."
          : "Task deleted successfully",
      description:
        fetchedData === null
          ? "There was a problem with your request."
          : JSON.stringify(fetchedData),
    })
  }

  const completedToggleOnChange = async (completed: boolean) => {
    await completeTaskToggle(task.id, completed)
  }

  return (
    <div className="grid grid-rows-4 outline outline-1 rounded-md p-5 bg-neutral-50 dark:bg-neutral-900">
      <div className="grid grid-cols-5 content-center">
        <h1
          className={
            "text-4xl col-span-4 font-bold text-ellipsis overflow-hidden"
          }
        >
          {task.title}
        </h1>
        <Toggle
          className="ml-auto self-center bg-white data-[state=off]:hover:bg-neutral-300 data-[state=on]:bg-green-400/80 data-[state=on]:hover:bg-green-600/80 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:data-[state=on]:bg-green-600/40 dark:data-[state=on]:hover:bg-green-200/40"
          variant={"outline"}
          pressed={task.completed}
          onPressedChange={completedToggleOnChange}
        >
          <CheckIcon />
        </Toggle>
      </div>
      <p className="row-span-2 break-all overflow-y-auto">{task.description}</p>
      <div className="flex gap-2 items-center">
        <Button variant={"destructive"} onClick={deleteTaskOnClick}>
          Delete
        </Button>
        <Label className={"grow text-center"}>{date}</Label>
        <Button
          className={"hover:bg-neutral-300 dark:hover:bg-neutral-800"}
          variant={"outline"}
        >
          Edit
        </Button>
      </div>
    </div>
  )
}
