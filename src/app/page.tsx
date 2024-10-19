import TodoTaskCard from "@/components/todo-task-card";
import {task} from "@/schema";
import {db} from "@/index";
import AddTask from "@/components/add-task";

export default async function Home() {
    const tasks = await db.select().from(task);

    return (
        <div className={"flex flex-grow my-10 mx-20 gap-5 flex-wrap"}>
            {tasks.length === 0 ? null :
                (
                    tasks.map((task) => (
                        <TodoTaskCard key={task.id} title={task.title} description={task.description}
                                      completed={task.completed}/>
                    ))
                )
            }
            <div className={"flex justify-center items-center flex-grow"}>
                <AddTask/>
            </div>
        </div>
    );
}
