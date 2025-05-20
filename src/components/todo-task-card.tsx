'use client'

import {Input} from "@/components/ui/input";
import {Toggle} from "@/components/ui/toggle";
import {Label} from "@/components/ui/label";
import {Task} from "@/lib/types"
import {Button} from "@/components/ui/button";
import {completeTaskToggle, deleteTask} from "@/lib/actions";
import {toast} from "@/hooks/use-toast";
import {useEffect, useState} from "react";

export default function TodoTaskCard({task}: {task: Task}) {

    const [date, setDate] = useState("")

    useEffect(() => {
        setDate(task.dateAdded.toLocaleDateString() + " " + task.dateAdded.toLocaleTimeString())
    }, [task.dateAdded]);


    const deleteTaskOnClick =  async () => {
        const fetchedData = await deleteTask(task.id);

        toast({
            title: fetchedData === null ? "Uh oh! Something went wrong." : "Task deleted successfully",
            description: fetchedData === null ? "There was a problem with your request." : JSON.stringify(fetchedData),
        })
    }

    const completedToggleOnChange = async (completed: boolean) => {
        const fetchedData = await completeTaskToggle(task.id, completed);

        toast({
            title: fetchedData === null ? "Uh oh! Something went wrong." : "Task completion updated successfully",
            description: fetchedData === null ? "There was a problem with your request." : JSON.stringify(fetchedData),
        })
    }

    return (
        <div className="grid grid-rows-3 h-56 outline outline-1 rounded-md p-5">
            <div className="flex items-center w-full">
                <h1 className={"text-4xl font-bold"}>{task.title}</h1>
                <Toggle className="ml-auto self-center" pressed={task.completed} onPressedChange={completedToggleOnChange}>Completed</Toggle>
            </div>
            <Label>{task.description}</Label>
            <Label className={""}>Date added: {date}</Label>
            <div>
                <Button variant={"destructive"} onClick={deleteTaskOnClick}>Delete</Button>
                <Button variant={"outline"}>Edit</Button>
            </div>
        </div>
    );
}