import TodoTaskCard from "@/components/todo-task-card";
import AddTask from "@/components/add-task";
import {getTasks} from "@/lib/actions";

export default async function Tasks() {

    const tasks = await getTasks();

    return (
        <div className={"grid grid-cols-4 auto-rows-max gap-5 h-full my-10 mx-20"}>
            {tasks === null ? null :
                (
                    tasks.map((task) => (
                        <TodoTaskCard key={task.id} task={task}/>
                    ))
                )
            }
            <div className={"flex justify-center items-center flex-grow"}>
                <AddTask/>
            </div>
        </div>
    );
}
