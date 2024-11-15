import {task} from "@/schema";
import {db} from "@/index";

async function Seed() {

    for (let i = 1; i <= 5; i++) {
        await db.insert(task).values({ title: `title${i}`, description: `description${i}`, completed: false });
    }
}

Seed();