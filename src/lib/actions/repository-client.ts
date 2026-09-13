"use client";

import { db } from "../../../db/dexie/index";
import { ActionResponse, InsertUpdateTask, ReturnTask } from "../types";

export async function getAllTasks(): Promise<
  ActionResponse<Array<ReturnTask>>
> {
  try {
    const tasks = await db.tasks.toArray();
    return { data: tasks };
  } catch {
    return { error: { message: "Failed to fetch tasks", status: 500 } };
  }
}

export async function insertTask(
  values: InsertUpdateTask,
): Promise<ActionResponse<{ title: string }>> {
  try {
    await db.tasks.add({
      ...values,
      dateAdded: new Date(),
    });
    return { data: { title: values.title } };
  } catch {
    return { error: { message: "Failed to insert task", status: 500 } };
  }
}

export async function getQueriedTasksCount(
  query: string | null,
): Promise<ActionResponse<number>> {
  try {
    let data = db.tasks.toCollection();

    if (query) {
      const normalizedQuery = query.toLowerCase();

      data = data.filter((task) =>
        task.title.toLowerCase().includes(normalizedQuery),
      );
    }

    const count = await data.count();

    return { data: count };
  } catch {
    return { error: { message: "Failed to fetch tasks count", status: 500 } };
  }
}

export async function getPaginatedQueriedSortedTasks(
  currentPage: number,
  tasksPerPage: number,
  query: string | null,
  sort: string | null,
): Promise<ActionResponse<Array<ReturnTask>>> {
  try {
    let data = db.tasks.orderBy("dateAdded");

    if (sort === "newest") {
      data = data.reverse();
    }

    if (query) {
      const normalizedQuery = query.toLowerCase();

      data = data.filter((task) =>
        task.title.toLowerCase().includes(normalizedQuery),
      );
    }

    const sorted = await data
      .offset((currentPage - 1) * tasksPerPage)
      .limit(tasksPerPage)
      .toArray();

    return { data: sorted };
  } catch {
    return { error: { message: "Failed to fetch tasks", status: 500 } };
  }
}

export async function userHasTasks(): Promise<ActionResponse<number>> {
  try {
    const count = await db.tasks.limit(1).count();
    return { data: count };
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
    const data = await db.transaction("rw", db.tasks, async () => {
      const record = await db.tasks.get(id);

      if (!record) {
        return null;
      }

      await db.tasks.delete(id);
      return { title: record.title };
    });

    if (!data) {
      return { error: { message: "Task not found", status: 404 } };
    }

    return { data };
  } catch {
    return {
      error: { message: "Failed to delete task", status: 500 },
    };
  }
}

export async function updateTask(
  id: string,
  values: InsertUpdateTask,
): Promise<ActionResponse<{ title: string }>> {
  if (!id) {
    return { error: { message: "Invalid task ID", status: 400 } };
  }

  try {
    const updatedCount = await db.tasks.update(id, values);

    if (updatedCount === 0) {
      return { error: { message: "Task not found", status: 404 } };
    }

    return { data: { title: values.title } };
  } catch {
    return {
      error: { message: "Failed to update task", status: 500 },
    };
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
    const data = await db.transaction("rw", db.tasks, async () => {
      const record = await db.tasks.get(id);

      if (!record) {
        return null;
      }

      await db.tasks.update(id, { completed: completed });

      return { title: record.title };
    });

    if (!data) {
      return { error: { message: "Task not found", status: 404 } };
    }

    return { data: data };
  } catch {
    return {
      error: {
        message: "Failed to update task completion status",
        status: 500,
      },
    };
  }
}
