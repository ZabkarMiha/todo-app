'use server'

import {db} from "@/index";
import {z} from "zod";
import {taskFormSchema} from "@/lib/form-schemas";
import {task} from "@/schema";
import {revalidatePath} from "next/cache";

export async function insertFormValues(values: z.infer<typeof taskFormSchema>){
    try{
        const data = await db.insert(task).values(values).returning({ returnedTitle: task.title, returnedDescription: task.description})
        revalidatePath("/")
        return data
    }
    catch(e){
        console.log(e);
        return null
    }
}

export async function getTasks(){
    try {
        return await db.select().from(task)
    }
    catch(e){
        console.log(e)
        return null
    }
}

export async function deleteTask(id: string){
    try {
        const data = await db.delete(task).where(eq(task.id, id)).returning({ returnedTitle: task.title, returnedDescription: task.description})
        revalidatePath("/")
        console.log(data)
        return data
    }
    catch(e){
        console.log(e);
        return null
    }
}