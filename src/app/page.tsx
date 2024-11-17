import Tasks from "@/app/tasks";
import {getTasks} from "@/lib/actions";

export default async function Home() {

    const tasks = await getTasks();

    return (
        <Tasks tasks={tasks}/>
    );
}
