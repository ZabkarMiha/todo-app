"use client";

import TasksLoading from "@/components/tasks-loading";
import {
  completeTaskToggle,
  deleteTask,
  getPaginatedQueriedSortedTasks,
  getQueriedTasksCount,
  insertTask,
  updateTask,
  userHasTasks,
} from "@/lib/actions/repository-client";
import { TasksWrapperProps } from "@/lib/types";
import { useLiveQuery } from "dexie-react-hooks";
import { Suspense } from "react";
import AddTask from "./add-task";
import Dock from "./dock";
import TasksList from "./tasks-list";

export default function TasksWrapperClient({
  page,
  tasksPerPage,
  sortKey,
  sortOrder,
  query,
}: Omit<TasksWrapperProps, "userId">) {
  const userHasTasksResult = useLiveQuery(() => userHasTasks());

  const tasks = useLiveQuery(
    () =>
      getPaginatedQueriedSortedTasks(
        page,
        tasksPerPage,
        sortKey,
        sortOrder,
        query,
      ),
    [page, tasksPerPage, query, sortKey, sortOrder],
  );

  const tasksCount = useLiveQuery(() => getQueriedTasksCount(query), [query]);

  if (userHasTasksResult === undefined) {
    return <TasksLoading />;
  }

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
        <AddTask insertFunction={insertTask} />
      </div>
    );
  }

  if (tasks === undefined) {
    return <TasksLoading />;
  }

  if (tasksCount === undefined) {
    return <TasksLoading />;
  }

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
            insertFunction={insertTask}
          />
        </Suspense>
      </div>
    </div>
  );
}
