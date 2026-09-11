"use server";

import TasksErrorBoundaryClient from "@/components/tasks-error-boundary-client";
import TasksWrapperClient from "@/components/tasks-wrapper-client";
import { headers } from "next/headers";
import TasksWrapperServer from "../../components/tasks-wrapper-server";
import { auth } from "../../lib/auth/auth";

type PageProps = Promise<{
  page?: string;
  tasksPerPage?: string;
  sortOrder?: string;
  query?: string;
}>;

export default async function Page({
  searchParams,
}: {
  searchParams: PageProps;
}) {
  const searchParamsResult = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session ? (
    <TasksWrapperServer
      userId={session.user.id}
      searchParams={searchParamsResult}
    />
  ) : (
    <TasksErrorBoundaryClient>
      <TasksWrapperClient searchParams={searchParamsResult} />
    </TasksErrorBoundaryClient>
  );
}
