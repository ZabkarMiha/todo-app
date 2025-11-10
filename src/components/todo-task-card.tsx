import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import { ErrorData, Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { completeTaskToggle, deleteTask } from "@/lib/actions/database";
import { toast } from "sonner";
import { CheckIcon, TrashIcon } from "@radix-ui/react-icons";
import EditAddTask from "./edit-add-task";
import { Separator } from "./ui/separator";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TodoTaskCard({ task }: { task: Task }) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;

  const deleteTaskOnClick = async () => {
    toast.promise(deleteTask(task.id), {
      loading: "Loading...",
      success: (data) => `${data.data?.title} has been deleted`,
      error: (error: ErrorData) => `${error.message}, ${error.status}`,
    });
  };

  const completedToggleOnChange = async (completed: boolean) => {
    await completeTaskToggle(task.id, completed);
  };

  return (
    <Card className="max-h-[500px]">
      <CardHeader className="grid-rows-1">
        <CardTitle
          className={
            "overflow-hidden text-2xl font-bold text-ellipsis whitespace-nowrap hover:whitespace-break-spaces hover:overflow-visible xl:text-3xl"
          }
        >
          {task.title}
        </CardTitle>
        <CardAction>
          <Toggle
            className="ml-auto"
            variant={"outline"}
            pressed={task.completed}
            onPressedChange={completedToggleOnChange}
          >
            <CheckIcon />
          </Toggle>
        </CardAction>
      </CardHeader>
      <CardContent>
        <CardDescription>{task.description}</CardDescription>
      </CardContent>
      <Separator className="mt-auto w-full" />
      <CardFooter className="gap-2">
        <Button variant={"destructive"} onClick={deleteTaskOnClick}>
          <TrashIcon className="h-4 w-4" />
        </Button>
        <Label className={"mx-auto text-center"}>
          {task.dateAdded.toLocaleDateString("en-GB", options)}
        </Label>
        <EditAddTask taskData={task} />
      </CardFooter>
    </Card>
  );
}
