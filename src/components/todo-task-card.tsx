'use client'

import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {Task} from "@/lib/types"
import {Button} from "@/components/ui/button";
import {deleteTask} from "@/lib/actions";
import {toast} from "@/hooks/use-toast";
import {useEffect, useState} from "react";

export default function TodoTaskCard({task}: {task: Task}) {

    const [date, setDate] = useState("")

    useEffect(() => {
        setDate(task.dateAdded.toLocaleDateString() + " " + task.dateAdded.toLocaleTimeString())
    }, [task.dateAdded]);


    const deleteTaskOnClick =  async (id: string) => {
        const fetchedData = await deleteTask(id);

        toast({
            title: fetchedData === null ? "Uh oh! Something went wrong." : "Task deleted successfully",
            description: fetchedData === null ? "There was a problem with your request." : JSON.stringify(fetchedData),
        })
    }

    return (
        <div className="grid grid-rows-3 h-56 outline p-5">
            <Label className={""}>{task.title}</Label>
            <Label>{task.description}</Label>
            <div>
                <Label htmlFor={"completed"}>Completed</Label>
                <Checkbox id={"completed"} checked={task.completed} />
            </div>
            <Label className={""}>Date added: {date}</Label>
            <div>
                <Button variant={"destructive"} onClick={async () => deleteTaskOnClick(task.id)}>Delete</Button>
                <Button variant={"outline"}>Edit</Button>
            </div>
        </div>
    );
}