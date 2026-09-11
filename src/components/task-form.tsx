"use client";

import { insertUpdateTaskSchema } from "@/lib/form-schemas";
import { ActionResponse, InsertUpdateTask } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilLine, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "./ui/button";
import { DateTimePicker } from "./ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

type TaskFormProps = {
  className?: string;
  defaultValues: z.infer<typeof insertUpdateTaskSchema>;
  onSubmitFunction(
    data: InsertUpdateTask,
  ): Promise<ActionResponse<{ title: string }>>;
  editMode: boolean;
};

export default function TaskForm({
  className,
  defaultValues,
  editMode,
  onSubmitFunction,
}: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDate, setIsDate] = useState(!!defaultValues.dueDate);

  const form = useForm<z.infer<typeof insertUpdateTaskSchema>>({
    resolver: zodResolver(insertUpdateTaskSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<
    z.infer<typeof insertUpdateTaskSchema>
  > = async (formData) => {
    if (isDate && formData.dueDate === null) {
      form.setError("dueDate", { message: "Select a date" });
      return;
    }

    setIsSubmitting(true);

    const completeTaskData: InsertUpdateTask = {
      ...formData,
      dueDate: isDate ? formData.dueDate : null,
    };

    const result = await onSubmitFunction(completeTaskData);

    if (result?.error) {
      toast.error(result.error.message, {
        closeButton: true,
        position: "top-center",
      });

      setIsSubmitting(false);
      setOpen(false);

      return;
    }

    toast.success(
      editMode
        ? `${result.data?.title} updated`
        : `${result.data?.title} created`,
      {
        closeButton: true,
        position: "top-center",
      },
    );

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
          {editMode ? (
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
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        showCloseButton={!isSubmitting}
      >
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit task" : "Create new task"}
          </DialogTitle>
          <DialogDescription>
            {editMode
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
                        value={field.value ?? ""}
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
                          form.setValue("dueDate", null, {
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
                {editMode ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
