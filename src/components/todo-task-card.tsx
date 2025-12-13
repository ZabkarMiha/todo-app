"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { completeTaskToggle, deleteTask } from "@/lib/actions/database";
import { ErrorData, Task } from "@/lib/types";
import { Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import EditAddTask from "./edit-add-task";
import { Separator } from "./ui/separator";

export default function TodoTaskCard({ task }: { task: Task }) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;

  const deleteTaskOnClick = async () => {
    toast.promise(deleteTask(task.id), {
      closeButton: true,
      position: "top-center",
      loading: "Loading...",
      success: (data) => `${data.data?.title} has been deleted`,
      error: (error: ErrorData) => `${error.message}, ${error.status}`,
    });
  };

  const completedToggleOnChange = async (completed: boolean) => {
    toast.promise(completeTaskToggle(task.id, completed), {
      closeButton: true,
      position: "top-center",
      loading: "Loading...",
      success: (data) => `${data.data?.title} completion has been updated`,
      error: (error: ErrorData) => `${error.message}, ${error.status}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={
            "overflow-hidden text-2xl font-bold text-ellipsis whitespace-nowrap hover:overflow-visible hover:whitespace-break-spaces xl:text-3xl"
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
            <Check />
          </Toggle>
        </CardAction>
      </CardHeader>
      <CardContent>
        <CardDescription>{task.description}</CardDescription>
      </CardContent>
      <Separator className="mt-auto w-full" />
      <CardFooter className="gap-2">
        <Button variant={"destructive"} onClick={deleteTaskOnClick}>
          <Trash2 className="h-4 w-4" />
        </Button>
        <Label className={"mx-auto text-center"}>
          {task.dateAdded.toLocaleDateString("en-GB", options)}
        </Label>
        <EditAddTask taskData={task} />
      </CardFooter>
    </Card>
  );
}
