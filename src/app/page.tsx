import Tasks from "@/app/tasks";
import {getTasks} from "@/lib/actions";
import AddTask from "@/components/add-task";

export default async function Home() {

    const tasks = await getTasks();

    return (
        <>
            {tasks && tasks.length > 0 || tasks !== null ? (
                <Tasks tasks={tasks}/>
            ) : (
                <div className="flex justify-center items-center flex-grow">
                    <AddTask/>
                </div>
            )}
        </>
    );
}
