import {z} from "zod";

export const taskFormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }).max(30, {
        message: "Title must not exceed 30 characters."
    }),
    description: z.string().min(2, {
        message: "Description must be at least 3 characters.",
    }).max(300, {
        message: "Description must not exceed 300 characters."
    }).optional(),
    completed: z.boolean()
})