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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { insertTaskFormValues, updateTask } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import { taskFormSchema } from "@/lib/form-schemas"
import { cn } from "@/lib/utils"
import { Task } from "@/lib/types"

type EditAddTaskProps = {
  className?: string
  taskData?: Task
}

export default function EditAddTask({ className, taskData }: EditAddTaskProps) {
  const { toast } = useToast()

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
    data
  ) => {
    const result = taskData
      ? await updateTask(taskData!.id, data)
      : await insertTaskFormValues(data)

    const actionText = taskData ? "updated" : "created"

    toast({
      title: result.error
        ? "Uh oh! Something went wrong."
        : `Task ${actionText} successfully`,
      description: result.error
        ? result.error
        : JSON.stringify(result.data),
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
          {taskData ? <Pencil1Icon className="h-4 w-4"/> : <PlusIcon className="h-4 w-4" />}
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormDescription>The title of your task</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormDescription>
                    The description of your task (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type={"submit"}>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
