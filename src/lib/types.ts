import { InferSelectModel } from "drizzle-orm";
import { task } from "../../db/drizzle/schema";

type Task = InferSelectModel<typeof task>;

export type InsertUpdateTask = Omit<Task, "id" | "dateAdded" | "userId">;

export type ReturnTask = Omit<Task, "userId">;

export type ErrorData = {
  message: string;
  status: number;
};

export type ActionResponse<T> = {
  data?: T;
  error?: ErrorData;
};

export type TasksWrapperProps = {
  userId: string;
  searchParams: {
    page?: string;
    tasksPerPage?: string;
    sortOrder?: string;
    query?: string;
  };
};
