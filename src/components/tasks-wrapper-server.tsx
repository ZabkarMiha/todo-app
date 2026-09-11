"use server";

import Dock from "@/components/dock";
import AddTask from "@/components/add-task";
import TasksList from "@/components/tasks-list";
import {
  getPaginatedQueriedSortedTasks,
  getQueriedTasksCount,
  userHasTasks,
  deleteTask,
  completeTaskToggle,
  insertTask,
  updateTask
} from "@/lib/actions/repository";
import { TasksWrapperProps } from "@/lib/types";
import { Suspense } from "react";

export default async function TasksWrapperServer({
  userId,
  searchParams,
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
        <AddTask insertFunction={insertTask.bind(null, userId)}/>
      </div>
    );
  }

  const currentPage = Number(searchParams.page) || 1;

  const tasksPerPage = Number(searchParams.tasksPerPage) || 6;

  const sortOrder = searchParams.sortOrder || "newest";

  const query = searchParams.query || null;

  const [tasks, tasksCount] = await Promise.all([
    getPaginatedQueriedSortedTasks(
      userId,
      currentPage,
      tasksPerPage,
      query,
      sortOrder,
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
        <TasksList tasks={tasks.data!} deleteTask={deleteTask} completeTaskToggle={completeTaskToggle} updateFunction={updateTask}/>
        <Suspense fallback={null}>
          <Dock
            tasksCount={tasksCount.data!}
            tasksPerPage={tasksPerPage}
            currentPage={currentPage}
            insertFunction={insertTask.bind(null, userId)}
          />
        </Suspense>
      </div>
    </div>
  );
}
