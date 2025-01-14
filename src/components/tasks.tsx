"use client";

import {useState} from "react";
import TodoTaskCard from "@/components/todo-task-card";
import AddTask from "@/components/add-task";
import {Task} from "@/lib/types";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";

export default function TaskList({tasks}: { tasks: Task[] | null }) {
    const [sortOrder, setSortOrder] = useState<"ascending" | "descending">("descending");

    const sortedTasks = [...tasks!].sort((a, b) => {
        const dateA = new Date(a.dateAdded).getTime();
        const dateB = new Date(b.dateAdded).getTime();
        return sortOrder === "ascending" ? dateA - dateB : dateB - dateA;
    });

    return (
        <div className="my-10 mx-20 space-y-5">
            <div className="flex items-center justify-center w-full space-x-2">
                <div className="flex justify-start items-center flex-grow">
                    <AddTask/>
                </div>
                <Label>Sort by date:</Label>
                <RadioGroup
                    value={sortOrder}
                    onValueChange={(value) => setSortOrder(value as "ascending" | "descending")}
                    className="flex items-center"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="descending" id="option-one"/>
                        <Label htmlFor="option-one">Newest first</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ascending" id="option-two"/>
                        <Label htmlFor="option-two">Oldest first</Label>
                    </div>
                </RadioGroup>
            </div>
            <div className="grid grid-cols-4 auto-rows-max gap-5 h-full">
                {sortedTasks.map((task) => (
                    <TodoTaskCard key={task.id} task={task}/>
                ))}
            </div>
        </div>
    );
}
