import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";

export default function TodoTaskCard({title, description, completed}: Task) {
    return (
        <div className="grid grid-rows-3 outline p-5">
            <Label className={""}>{title}</Label>
            <Label>{description}</Label>
            <div>
                <Label htmlFor={"completed"}>Completed</Label>
                <Checkbox id={"completed"} checked={completed} />
            </div>
        </div>
    );
}