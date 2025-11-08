import { Toggle } from "@/components/ui/toggle"
import { Label } from "@/components/ui/label"
import { Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { completeTaskToggle, deleteTask } from "@/lib/actions/database"
import { toast } from "@/hooks/use-toast"
import {
  CheckIcon,
  TrashIcon,
} from "@radix-ui/react-icons"
import EditAddTask from "./edit-add-task"
import { Separator } from "./ui/separator"

export default function TodoTaskCard({ task }: { task: Task }) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const

  const deleteTaskOnClick = async () => {
    const result = await deleteTask(task.id)

    toast({
      title: result.error
        ? "Uh oh! Something went wrong."
        : "Task deleted successfully",
      description: result.error ? result.error.message : result.data?.id,
    })
  }

  const completedToggleOnChange = async (completed: boolean) => {
    await completeTaskToggle(task.id, completed)
  }

  return (
    <div className="flex flex-col w-full outline outline-1 outline-task-outline rounded-md p-5 bg-task-background space-y-4 max-h-[500px]">
      <div className="flex flex-row items-center gap-2">
        <span
          className={
            "text-2xl font-bold text-ellipsis overflow-hidden whitespace-nowrap xl:text-3xl"
          }
        >
          {task.title}
        </span>
        <Toggle
          className="ml-auto"
          variant={"outline"}
          pressed={task.completed}
          onPressedChange={completedToggleOnChange}
        >
          <CheckIcon />
        </Toggle>
      </div>
      <p className="h-full overflow-hidden text-pretty overflow-y-auto mb-5">
        {task.description}
      </p>
      <Separator className="w-full" />
      <div className="flex flex-row items-center gap-2 self-center mt-auto w-full">
        <Button variant={"destructive"} onClick={deleteTaskOnClick}>
          <TrashIcon className="h-4 w-4" />
        </Button>
        <Label className={"text-center grow"}>
          {task.dateAdded.toLocaleDateString("en-GB", options)}
        </Label>
        <EditAddTask taskData={task} />
      </div>
    </div>
  )
}
