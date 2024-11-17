'use client'

import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Dialog, DialogClose,
    DialogContent, DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm, SubmitHandler} from "react-hook-form"
import {insertFormValues} from "@/lib/actions";
import {useToast} from "@/hooks/use-toast";
import {z} from "zod"
import {taskFormSchema} from "@/lib/form-schemas";
import {Label} from "@/components/ui/label";

export default function AddTask() {

    const {toast} = useToast();

    const form = useForm<z.infer<typeof taskFormSchema>>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: "",
            description: "",
            completed: false,
        },
    })

    const onSubmit: SubmitHandler<z.infer<typeof taskFormSchema>> = async (data) => {
        const fetchedData = await insertFormValues(data)

        toast({
            title: fetchedData === null ? "Uh oh! Something went wrong." : "Task successfully added",
            description: fetchedData === null ? "There was a problem with your request." : JSON.stringify(fetchedData),
        })

        form.reset()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className={"h-fit space-x-1"}><Label>Add Task</Label><Plus size={30}/></Button>
            </DialogTrigger>
            <DialogContent className={"space-y-6"}>
                <DialogHeader>
                    <DialogTitle>Create new task</DialogTitle>
                    <DialogDescription>To create a new task</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The title of your task
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The description of your task (optional).
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="completed"
                            render={({field}) => (
                                <FormItem className={"flex flex-row items-center space-x-4 space-y-0"}>
                                    <FormLabel>Completed</FormLabel>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Whether your task is completed or not
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <DialogClose asChild>
                            <Button type={"submit"}>Save</Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}