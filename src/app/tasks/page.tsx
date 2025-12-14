"use server";

import Dock from "@/components/dock";
import AddTask from "@/components/edit-add-task";
import TasksList from "@/components/tasks-list";
import {
  getPaginatedQueriedSortedTasks,
  getQueriedTasksCount,
  isTasks,
} from "@/lib/actions/database";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "../../lib/auth/auth";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const isTasksResult = await isTasks(session!.user.id);

  if (isTasksResult.error) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <h1>Error: {isTasksResult.error.message}</h1>
      </div>
    );
  }

  if (isTasksResult.data === 0) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4">
        <p className="text-center text-4xl font-bold">Add your first task!</p>
        <AddTask />
      </div>
    );
  }

  const currentPage = Number(searchParams?.page) || 1;

  const tasksPerPage = Number(searchParams?.tasksPerPage) || 6;

  const sortOrder = searchParams?.sortOrder || "newest";

  const query = searchParams?.query || null;

  const [tasks, tasksCount] = await Promise.all([
    getPaginatedQueriedSortedTasks(
      session!.user.id,
      currentPage,
      tasksPerPage,
      query,
      sortOrder,
    ),
    getQueriedTasksCount(session!.user.id, query),
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
        <TasksList tasks={tasks.data!} />
        <Suspense fallback={null}>
          <Dock
            tasksCount={tasksCount.data!}
            tasksPerPage={tasksPerPage}
            currentPage={currentPage}
          />
        </Suspense>
      </div>
    </div>
  );
}
