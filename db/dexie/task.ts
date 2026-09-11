import { Entity } from "dexie"
import type Schema from "./schema"

export default class Task extends Entity<Schema> {
    id!: string
    title!: string
    description!: string | null
    completed!: boolean
    dueDate!: Date | null
    dateAdded!: Date
}