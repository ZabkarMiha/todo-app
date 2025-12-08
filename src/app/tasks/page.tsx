"use server";

import Content from "@/components/content";
import AddTask from "@/components/edit-add-task";
import { getAllTasks, getTasksCount } from "@/lib/actions/database";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth/auth";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const tasksCountResult = await getTasksCount(session!.user.id);

  if (tasksCountResult.error) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <h1>Error: {tasksCountResult.error.message}</h1>
      </div>
    );
  }

  if (tasksCountResult.data === 0) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4">
        <p className="text-center text-4xl font-bold">Add your first task!</p>
        <AddTask />
      </div>
    );
  }

  const tasksResult = await getAllTasks(session!.user.id);
  if (tasksResult.error) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <h1>Error: {tasksResult.error.message}</h1>
      </div>
    );
  }

  const currentPage = Number(searchParams?.page) || 1;
  return (
    <Content
      tasks={tasksResult.data || null}
      currentPage={currentPage}
      tasksPerPage={6}
    />
  );
}
