import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";

export default function AddTask() {
    return (
        <Dialog>
            <DialogTrigger><Button variant="ghost" className={"h-fit"}><Plus size={50}/></Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new task</DialogTitle>
                </DialogHeader>
                <div className={"grid grid-flow-col grid-rows-6 gap-2 my-5"}>
                    <Input placeholder={"Title"}></Input>
                    <Input placeholder={"Description"} className={"h-full row-span-4"}></Input>
                    <div className={"h-full flex items-center gap-2"}>
                        <Checkbox id={"completed"}/>
                        <Label htmlFor={"completed"}>Completed</Label>
                    </div>
                </div>
                <DialogFooter>
                    <div className={"flex-1"}><Button>Save</Button></div>
                    <Button variant={"outline"} className={""}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}