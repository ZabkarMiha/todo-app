import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";

export default function TodoTaskCard({title, description, completed}: Task) {
    return (
        <div>
            <Label>{title}</Label>
            <Label>{description}</Label>
            <Label htmlFor={"completed"}>Completed</Label>
            <Checkbox id={"completed"} checked={completed} />
        </div>
    );
}