import { relations } from "drizzle-orm/relations";
import { user} from "./user";
import { task } from "./task";

export const userRelations = relations(user, ({ many }) => ({
    task: many(task)
}))

export const taskRelations = relations(task, ({ one }) => ({
    user: one(user, {
        fields: [task.userId],
        references: [user.id],
    }),
}))