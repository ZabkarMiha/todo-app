import Tasks from "@/components/tasks";
import {getTasksCount, getTasksPerPage} from "@/lib/actions";
import PaginationBar from "@/components/pagination-bar";
import AddTask from "@/components/add-task";

type PageProps = {
    searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: PageProps) {

    const tasksPerPage = 8;

    const currentPage = parseInt(searchParams.page as string) || 1;

    const tasksCount = await getTasksCount();

    const tasks = await getTasksPerPage(currentPage, tasksPerPage);

    return (
        <>
            {
                tasksCount === null ? (
                    <h1>Something went wrong</h1>
                ) : tasksCount === 0 ? (
                    <AddTask/>
                ) : (
                <>
                    <Tasks tasks={tasks}/>
                    <PaginationBar tasksCount={tasksCount} currentPage={currentPage}
                                   tasksPerPage={tasksPerPage}/>
                </>
                )
            }

        </>
    )
}
