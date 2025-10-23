"use server"

import { db } from "@/index"
import { z } from "zod"
import { insertTaskSchema, taskFormSchema } from "@/lib/form-schemas"
import { task } from "@/schema/task"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

interface ActionResponse<T> {
  data?: T
  error?: string
}

export async function insertTaskFormValues(
  values: z.infer<typeof insertTaskSchema>
): Promise<
  ActionResponse<{ returnedTitle: string; returnedDescription: string | null }>
> {
  try {
    const data = await db.insert(task).values(values).returning({
      returnedTitle: task.title,
      returnedDescription: task.description,
    })
    revalidatePath("/")
    return { data: data[0] }
  } catch (e) {
    return { error: "Failed to insert task" }
  }
}

export async function getAllTasks(userId: string): Promise<
  ActionResponse<Array<typeof task.$inferSelect>>
> {
  try {
    const tasks = await db.select().from(task).where(eq(task.userId, userId))
    return { data: tasks }
  } catch (e) {
    return { error: "Failed to fetch tasks" }
  }
}

export async function getTasksCount(userId: string): Promise<ActionResponse<number>> {
  try {
    const count = await db.$count(task, eq(task.userId, userId))
    return { data: count }
  } catch (e) {
    return { error: "Failed to fetch tasks count" }
  }
}

export async function deleteTask(
  id: string
): Promise<
  ActionResponse<{ returnedTitle: string; returnedDescription: string | null }>
> {
  if (!id) {
    return { error: "Invalid task ID" }
  }

  try {
    const data = await db.delete(task).where(eq(task.id, id)).returning({
      returnedTitle: task.title,
      returnedDescription: task.description,
    })
    revalidatePath("/")
    return { data: data[0] }
  } catch (e) {
    return { error: "Failed to delete task" }
  }
}

export async function updateTask(
  id: string,
  values: z.infer<typeof taskFormSchema>
): Promise<
  ActionResponse<{ returnedTitle: string; returnedDescription: string | null }>
> {
  try {
    const data = await db
      .update(task)
      .set(values)
      .where(eq(task.id, id))
      .returning({
        returnedTitle: task.title,
        returnedDescription: task.description,
      })
    revalidatePath("/")
    return { data: data[0] }
  } catch (e) {
    return { error: "Failed to update task" }
  }
}

export async function completeTaskToggle(
  id: string,
  completed: boolean
): Promise<ActionResponse<void>> {
  if (!id) {
    return { error: "Invalid task ID" }
  }

  try {
    await db.update(task).set({ completed }).where(eq(task.id, id))
    revalidatePath("/")
    return { data: undefined }
  } catch (e) {
    return { error: "Failed to update task completion status" }
  }
}
