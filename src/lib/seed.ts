import { db } from "@/index";
import { task } from "@/schema";

async function Seed() {
  const args = process.argv.slice(2);
  const numberArg = args.find((arg) => arg.startsWith("taskCount="));
  const tasksCount: number = numberArg ? Number(numberArg.split("=")[1]) : 5;

  for (let i = 1; i <= tasksCount; i++) {
    await db.insert(task).values({
      title: `title${i}`,
      description: `description${i}`,
      completed: false,
    });
  }
}

Seed();
