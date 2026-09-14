"use server";

import TasksErrorBoundaryClient from "@/components/tasks-error-boundary-client";
import TasksWrapperClient from "@/components/tasks-wrapper-client";
import { SortKeys, SortOrders } from "@/lib/types";
import { headers } from "next/headers";
import TasksWrapperServer from "../../components/tasks-wrapper-server";
import { auth } from "../../lib/auth/auth";

type PageProps = Promise<{
  page: string | null;
  tasksPerPage: string | null;
  sortKey: SortKeys | null;
  sortOrder: SortOrders | null;
  query: string | null;
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

  const page: number = Number(searchParamsResult.page) || 1;

  const tasksPerPage: number = Number(searchParamsResult.tasksPerPage) || 6;

  const sortKey: SortKeys = searchParamsResult.sortKey || "dateAdded";

  const sortOrder: SortOrders = searchParamsResult.sortOrder || "descending";

  const query: string | null = searchParamsResult.query || null;

  return session ? (
    <TasksWrapperServer
      userId={session.user.id}
      page={page}
      tasksPerPage={tasksPerPage}
      sortKey={sortKey}
      sortOrder={sortOrder}
      query={query}
    />
  ) : (
    <TasksErrorBoundaryClient>
      <TasksWrapperClient
        page={page}
        tasksPerPage={tasksPerPage}
        sortKey={sortKey}
        sortOrder={sortOrder}
        query={query}
      />
    </TasksErrorBoundaryClient>
  );
}
