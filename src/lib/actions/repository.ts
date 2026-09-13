"use server";

import { db } from "@/drizzle/index";
import { task, user } from "@/drizzle/schema";
import { and, asc, desc, eq, ilike, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ActionResponse, InsertUpdateTask, ReturnTask } from "../types";

//Currently not in use (maybe later???)
export async function getAllTasks(
  userId: string,
): Promise<ActionResponse<Array<ReturnTask>>> {
  try {
    const tasks = await db.select().from(task).where(eq(task.userId, userId));
    return { data: tasks };
  } catch {
    return { error: { message: "Failed to fetch tasks", status: 500 } };
  }
}

export async function insertTask(
  userId: string,
  values: InsertUpdateTask,
): Promise<ActionResponse<{ title: string }>> {
  try {
    const data = await db
      .insert(task)
      .values({ ...values, userId })
      .returning({ title: task.title });
    revalidatePath("/");
    return { data: data[0] };
  } catch {
    return { error: { message: "Failed to insert task", status: 500 } };
  }
}

export async function insertUserClientTasks(
  userId: string,
  values: Omit<ReturnTask, "id">[],
): Promise<ActionResponse<{ title: string }[]>> {
  try {
    const data = await db
      .insert(task)
      .values(
        values.map((value) => ({
          ...value,
          userId,
        })),
      )
      .returning({ title: task.title });
    revalidatePath("/");
    return { data: data };
  } catch (error) {
    return {
      error: { message: "Failed to insert client tasks " + error, status: 500 },
    };
  }
}

export async function getQueriedTasksCount(
  userId: string,
  query: string | null,
): Promise<ActionResponse<number>> {
  const filters: SQL[] = [];

  if (query) filters.push(ilike(task.title, `%${query}%`));

  try {
    const count = await db.$count(
      task,
      and(eq(task.userId, userId), ...filters),
    );
    return { data: count };
  } catch {
    return { error: { message: "Failed to fetch tasks count", status: 500 } };
  }
}

export async function getPaginatedQueriedSortedTasks(
  userId: string,
  currentPage: number,
  tasksPerPage: number,
  query: string | null,
  sort: string | null,
): Promise<ActionResponse<Array<ReturnTask>>> {
  const filters: SQL[] = [];

  if (query) filters.push(ilike(task.title, `%${query}%`));

  try {
    const data = await db
      .select()
      .from(task)
      .where(and(eq(task.userId, userId), ...filters))
      .orderBy(sort === "newest" ? desc(task.dateAdded) : asc(task.dateAdded))
      .limit(tasksPerPage)
      .offset((currentPage - 1) * tasksPerPage);
    return { data: data };
  } catch {
    return { error: { message: "Failed to fetch tasks", status: 500 } };
  }
}

export async function userHasTasks(
  userId: string,
): Promise<ActionResponse<number>> {
  try {
    const count = await db
      .select()
      .from(task)
      .where(eq(task.userId, userId))
      .limit(1);
    return { data: count.length };
  } catch {
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
  } catch {
    return { error: { message: "Failed to delete task", status: 500 } };
  }
}

export async function updateTask(
  id: string,
  values: InsertUpdateTask,
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
): Promise<ActionResponse<{ title: string }>> {
  if (!id) {
    return { error: { message: "Invalid task ID", status: 400 } };
  }

  try {
    const data = await db
      .update(task)
      .set({ completed })
      .where(eq(task.id, id))
      .returning({ title: task.title });
    revalidatePath("/");
    return { data: data[0] };
  } catch {
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
    const data = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase()))
      .limit(1);
    if (data.length === 0) {
      available = true;
    }
    return { data: { available } };
  } catch {
    return {
      error: { message: "Failed to check email availability", status: 500 },
    };
  }
}
