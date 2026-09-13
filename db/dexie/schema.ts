import { Dexie, type EntityTable } from "dexie";
import Task from "./task";

export default class Schema extends Dexie {
  tasks!: EntityTable<Task, "id">;

  constructor() {
    super("TasksDB");
    this.version(1).stores({
      tasks: "id, title, description, dateAdded",
    });
    this.tasks.mapToClass(Task);
  }
}
