"use client"

import { Pencil1Icon, PlusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { insertTaskFormValues, updateTask } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import { taskFormSchema } from "@/lib/form-schemas"
import { cn } from "@/lib/utils"
import { Task } from "@/lib/types"
import { authClient } from "../lib/auth/auth-client"

type EditAddTaskProps = {
  className?: string
  taskData?: Task
}

export default function EditAddTask({ className, taskData }: EditAddTaskProps) {
  const { toast } = useToast()

  const { data: session, error } = authClient.useSession()

  const initialValues = taskData
    ? {
        title: taskData.title ?? "",
        description: taskData.description ?? "",
        completed: Boolean(taskData.completed),
      }
    : {
        title: "",
        description: "",
        completed: false,
      }

  const parsed = taskFormSchema.safeParse(initialValues)
  const defaultValues = parsed.success ? parsed.data : initialValues

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  })

  const onSubmit: SubmitHandler<z.infer<typeof taskFormSchema>> = async (
    data: z.infer<typeof taskFormSchema>
  ) => {
    const completeTaskData = {
      ...data,
      userId: session!.user.id,
    }

    const result = taskData
      ? await updateTask(taskData!.id, data)
      : await insertTaskFormValues(completeTaskData)

    const actionText = taskData ? "updated" : "created"

    toast({
      title: result.error
        ? "Uh oh! Something went wrong."
        : `Task ${actionText} successfully`,
      description: result.error ? result.error : JSON.stringify(result.data),
    })

    if (taskData) {
      form.reset(data)
    } else {
      form.reset()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("p-2 space-x-0 xl:space-x-2 xl:p-4", className)}
        >
          {taskData ? (
            <Pencil1Icon className="h-4 w-4" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className={"space-y-6"}>
        <DialogHeader>
          <DialogTitle>
            {taskData ? "Edit task" : "Create new task"}
          </DialogTitle>
          <DialogDescription>
            {taskData ? "To edit a task" : "To create a new task"}
          </DialogDescription>
        </DialogHeader>

        <form
          id="task-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
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
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>The title of your task</FieldDescription>
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
                  <Input
                    {...field}
                    id="task-form-description"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    The description of your task
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="task-form">
            Submit
          </Button>
        </Field>
      </DialogContent>
    </Dialog>
  )
}
