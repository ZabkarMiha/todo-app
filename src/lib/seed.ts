import { db } from "@/index";
import { task } from "@/schema/task";

async function Seed() {
  const args = process.argv;
  const numberArg = args[2];
  const tasksCount: number = numberArg ? Number(numberArg) : 5;

  for (let i = 1; i <= tasksCount; i++) {
    await db.insert(task).values({
      title: `title${i}`,
      description: `description${i}`,
      completed: false,
      userId: "" //add user id for which tasks are being added
    });
  }
}

Seed();
