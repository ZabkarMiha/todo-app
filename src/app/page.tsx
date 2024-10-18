import {Button} from "@/components/ui/button";
import TodoTaskCard from "@/components/todo-task-card";
import {Plus} from "lucide-react";
import {task} from "@/schema";
import {db} from "@/index";

export default async function Home() {
    const tasks = await db.select().from(task);

    return (
        <div>
            {tasks.length === 0 ?
                (<Button variant="ghost"><Plus/></Button>) :
                (tasks.map((task) => (
                    <TodoTaskCard key={task.id} title={task.title} description={task.description}
                                  completed={task.completed}/>
                )))
            }
        </div>
    );
}
