import { insertUpdateTaskSchema } from "@/lib/form-schemas"
import { ActionResponse, InsertUpdateTask, ReturnTask } from "@/lib/types"
import z from "zod"
import TaskForm from "./task-form"

type EditTaskProps = {
    taskData: ReturnTask,
    updateFunction(data: InsertUpdateTask): Promise<ActionResponse<{ title: string }>>,
}

export default function EditTask({taskData, updateFunction} : EditTaskProps){

    const defaultValues: z.infer<typeof insertUpdateTaskSchema> = {
            title: taskData.title,
        description: taskData.description,
        completed: taskData.completed,
        dueDate: taskData.dueDate,
        }

       

    return (<TaskForm defaultValues={defaultValues} onSubmitFunction={updateFunction} editMode={true}/>)
}