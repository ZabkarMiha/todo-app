import { Toggle } from "@/components/ui/toggle"
import { Label } from "@/components/ui/label"
import { Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { completeTaskToggle, deleteTask } from "@/lib/actions"
import { toast } from "@/hooks/use-toast"
import { CheckIcon } from "@radix-ui/react-icons"

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
      description: result.error ? result.error : JSON.stringify(result.data),
    })
  }

  const completedToggleOnChange = async (completed: boolean) => {
    await completeTaskToggle(task.id, completed)
  }

  return (
    <div className="flex flex-col w-full outline outline-1 outline-neutral-200 dark:outline-neutral-800 rounded-md p-5 bg-neutral-50 dark:bg-neutral-900">
      <div className="flex flex-row items-center gap-2 mb-2">
        <h1 className={"text-4xl font-bold text-ellipsis overflow-hidden"}>
          {task.title}
        </h1>
        <Toggle
          className="ml-auto bg-white data-[state=off]:hover:bg-neutral-300 data-[state=on]:bg-green-400/80 data-[state=on]:hover:bg-green-600/80 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:data-[state=on]:bg-green-600/40 dark:data-[state=on]:hover:bg-green-200/40"
          variant={"outline"}
          pressed={task.completed}
          onPressedChange={completedToggleOnChange}
        >
          <CheckIcon />
        </Toggle>
      </div>
      <p className="break-all hover:overflow-y-auto overflow-hidden mb-5">
        {task.description}
      </p>
      <div className="flex flex-row items-center gap-2 self-center mt-auto w-full">
        <Button variant={"destructive"} onClick={deleteTaskOnClick}>
          Delete
        </Button>
        <Label className={"text-center grow"}>
          {task.dateAdded.toLocaleDateString("en-GB", options)}
        </Label>
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
