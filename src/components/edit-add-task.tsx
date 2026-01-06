"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { insertTaskFormValues, updateTask } from "@/lib/actions/database";
import { taskFormSchema } from "@/lib/form-schemas";
import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilLine, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "../lib/auth/auth-client";
import { DateTimePicker } from "./ui/date-time-picker";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

type EditAddTaskProps = {
  className?: string;
  taskData?: Task;
};

export default function EditAddTask({ className, taskData }: EditAddTaskProps) {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = useMemo(() => {
    if (taskData) {
      return {
        title: taskData.title ?? "",
        description: taskData.description ?? "",
        completed: Boolean(taskData.completed),
        dueDate: taskData.dueDate ?? undefined,
      };
    }
    return {
      title: "",
      description: "",
      completed: false,
      dueDate: undefined,
    };
  }, [taskData]);

  const [isDate, setIsDate] = useState(!!defaultValues.dueDate);

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof taskFormSchema>> = async (
    data,
  ) => {
    if (isDate && data.dueDate === undefined) {
      form.setError("dueDate", { message: "Select a date" });
      return;
    }

    setIsSubmitting(true);

    const completeTaskData = {
      ...data,
      dueDate: isDate ? data.dueDate : null,
      userId: session!.user.id,
    };

    const result = taskData
      ? await updateTask(taskData.id, completeTaskData)
      : await insertTaskFormValues(completeTaskData);

    if (result?.error) {
      toast.error(result.error.message, {
        closeButton: true,
        position: "top-center",
      });

      return;
    }

    toast.success(taskData ? "Task updated" : "Task created", {
      closeButton: true,
      position: "top-center",
    });

    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      form.reset(defaultValues);
      setIsDate(!!defaultValues.dueDate);
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset(defaultValues);
    setIsDate(!!defaultValues.dueDate);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("space-x-0 p-2 xl:space-x-2 xl:p-4", className)}
        >
          {taskData ? (
            <PencilLine className="h-4 w-4" />
          ) : (
            <div className="flex flex-row items-center justify-center gap-1">
              <Plus className="h-4 w-4" />
              <p className="hidden sm:block">Add task</p>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="space-y-6 sm:max-w-[500px]"
        onInteractOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        showCloseButton={!isSubmitting}
      >
        <DialogHeader>
          <DialogTitle>
            {taskData ? "Edit task" : "Create new task"}
          </DialogTitle>
          <DialogDescription>
            {taskData
              ? "Make changes to your task here."
              : "Fill in the details for your new task."}
          </DialogDescription>
        </DialogHeader>
        {isSubmitting ? (
          <div className="flex h-60 w-full flex-col items-center justify-center space-y-4">
            <Spinner className="size-8" />
            <p className="text-muted-foreground">Saving...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <form
              id="task-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="gap-6"
            >
              <FieldGroup>
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="task-form-title">Title</FieldLabel>
                      <Input
                        {...field}
                        id="task-form-title"
                        placeholder="Buy groceries"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="task-form-description">
                        Description
                      </FieldLabel>
                      <Textarea
                        className="h-24 resize-none"
                        {...field}
                        id="task-form-description"
                        placeholder="Milk, Eggs, Bread..."
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <div className="flex flex-col gap-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isDateSwitch" className="text-base">
                        Due Date
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        Does this task have a deadline?
                      </p>
                    </div>
                    <Switch
                      id="isDateSwitch"
                      checked={isDate}
                      onCheckedChange={(checked) => {
                        setIsDate(checked);
                        if (!checked) {
                          form.setValue("dueDate", undefined, {
                            shouldDirty: true,
                          });
                        }
                      }}
                    />
                  </div>
                  {isDate && (
                    <Controller
                      name="dueDate"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <DateTimePicker
                            className="w-full"
                            value={field.value}
                            onChange={field.onChange}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  )}
                </div>
              </FieldGroup>
            </form>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit" form="task-form">
                {taskData ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
