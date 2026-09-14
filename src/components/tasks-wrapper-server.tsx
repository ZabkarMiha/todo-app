"use server";

import AddTask from "@/components/add-task";
import Dock from "@/components/dock";
import TasksList from "@/components/tasks-list";
import {
  completeTaskToggle,
  deleteTask,
  getPaginatedQueriedSortedTasks,
  getQueriedTasksCount,
  insertTask,
  updateTask,
  userHasTasks,
} from "@/lib/actions/repository";
import { TasksWrapperProps } from "@/lib/types";
import { Suspense } from "react";

export default async function TasksWrapperServer({
  userId,
  page,
  tasksPerPage,
  sortKey,
  sortOrder,
  query,
}: TasksWrapperProps) {
  const userHasTasksResult = await userHasTasks(userId);

  if (userHasTasksResult.error) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <h1>Error: {userHasTasksResult.error.message}</h1>
      </div>
    );
  }

  if (userHasTasksResult.data === 0) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4">
        <p className="text-center text-4xl font-bold">Add your first task!</p>
        <AddTask insertFunction={insertTask.bind(null, userId)} />
      </div>
    );
  }

  const [tasks, tasksCount] = await Promise.all([
    getPaginatedQueriedSortedTasks(
      userId,
      page,
      tasksPerPage,
      sortKey,
      sortOrder,
      query,
    ),
    getQueriedTasksCount(userId, query),
  ]);

  if (tasks.error) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <h1>Error: {tasks.error.message}</h1>
      </div>
    );
  }

  if (tasksCount.error) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <h1>Error: {tasksCount.error.message}</h1>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-28 md:pt-0">
      <div className="mx-5 flex h-full flex-col py-2 sm:mx-10 xl:mx-20">
        <TasksList
          tasks={tasks.data!}
          deleteTask={deleteTask}
          completeTaskToggle={completeTaskToggle}
          updateFunction={updateTask}
        />
        <Suspense fallback={null}>
          <Dock
            tasksCount={tasksCount.data!}
            tasksPerPage={tasksPerPage}
            page={page}
            insertFunction={insertTask.bind(null, userId)}
          />
        </Suspense>
      </div>
    </div>
  );
}
