"use server";

import { db } from "@/index";
import { insertTaskSchema, taskFormSchema } from "@/lib/form-schemas";
import { task } from "@/schema/task";
import { user } from "@/schema/user";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionResponse } from "../types";

export async function insertTaskFormValues(
  values: z.infer<typeof insertTaskSchema>,
): Promise<ActionResponse<{ title: string }>> {
  try {
    const data = await db
      .insert(task)
      .values(values)
      .returning({ title: task.title });
    revalidatePath("/");
    return { data: data[0] };
  } catch (e) {
    return { error: { message: "Failed to insert task", status: 500 } };
  }
}

export async function getAllTasks(
  userId: string,
): Promise<ActionResponse<Array<typeof task.$inferSelect>>> {
  try {
    const tasks = await db.select().from(task).where(eq(task.userId, userId));
    return { data: tasks };
  } catch (e) {
    return { error: { message: "Failed to fetch tasks", status: 500 } };
  }
}

export async function getTasksCount(
  userId: string,
): Promise<ActionResponse<number>> {
  try {
    const count = await db.$count(task, eq(task.userId, userId));
    return { data: count };
  } catch (e) {
    return { error: { message: "Failed to fetch tasks count", status: 500 } };
  }
}

export async function deleteTask(
  id: string,
): Promise<ActionResponse<{ title: string }>> {
  if (!id) {
    return { error: { message: "Invalid task ID", status: 400 } };
  }

  try {
    const data = await db.delete(task).where(eq(task.id, id)).returning({
      title: task.title,
    });
    revalidatePath("/");
    return { data: data[0] };
  } catch (e) {
    return { error: { message: "Failed to delete task", status: 500 } };
  }
}

export async function updateTask(
  id: string,
  values: z.infer<typeof taskFormSchema>,
): Promise<ActionResponse<{ title: string }>> {
  try {
    const data = await db
      .update(task)
      .set(values)
      .where(eq(task.id, id))
      .returning({
        title: task.title,
      });
    revalidatePath("/");
    return { data: data[0] };
  } catch (e) {
    return { error: { message: "Failed to update task", status: 500 } };
  }
}

export async function completeTaskToggle(
  id: string,
  completed: boolean,
): Promise<ActionResponse<{ id: string }>> {
  if (!id) {
    return { error: { message: "Invalid task ID", status: 400 } };
  }

  try {
    const data = await db
      .update(task)
      .set({ completed })
      .where(eq(task.id, id))
      .returning({ id: task.id });
    revalidatePath("/");
    return { data: data[0] };
  } catch (e) {
    return {
      error: {
        message: "Failed to update task completion status",
        status: 500,
      },
    };
  }
}

export async function isEmailAvailable(
  email: string,
): Promise<ActionResponse<{ available: boolean }>> {
  let available: boolean = false;
  try {
    const isEmailAvailable = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase()))
      .limit(1);
    if (isEmailAvailable.length === 0) {
      available = true;
    }
    return { data: { available } };
  } catch (e) {
    return {
      error: { message: "Failed to check email availability", status: 500 },
    };
  }
}
