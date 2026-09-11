import { insertUpdateTaskSchema } from "@/lib/form-schemas";
import { ActionResponse, InsertUpdateTask } from "@/lib/types";
import z from "zod";
import TaskForm from "./task-form";

type AddTaskProps = {
  insertFunction(
    data: InsertUpdateTask,
  ): Promise<ActionResponse<{ title: string }>>;
};

export default function AddTask({ insertFunction }: AddTaskProps) {
  const defaultValues: z.infer<typeof insertUpdateTaskSchema> = {
    title: "",
    description: null,
    completed: false,
    dueDate: null,
  };

  return (
    <TaskForm
      defaultValues={defaultValues}
      onSubmitFunction={insertFunction}
      editMode={false}
    />
  );
}
