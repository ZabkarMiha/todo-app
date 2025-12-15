"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
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
        <CardTitle className={"text-wrap text-2xl font-bold xl:text-3xl"}>
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
        <p className="opacity-80 font-extralight">{task.description}</p>
      </CardContent>
      <Separator className="mt-auto w-full" />
      <CardFooter className="gap-2">
        <Button variant={"destructive"} onClick={deleteTaskOnClick}>
          <Trash2 className="h-4 w-4" />
        </Button>
        <div
          className={
            "mx-auto flex flex-col items-center justify-center gap-1 text-center"
          }
        >
          <Label>{task.dateAdded.toLocaleDateString("en-GB", options)}</Label>
          <Label>{task.dateAdded.toLocaleTimeString("en-GB")}</Label>
        </div>
        <EditAddTask taskData={task} />
      </CardFooter>
    </Card>
  );
}
