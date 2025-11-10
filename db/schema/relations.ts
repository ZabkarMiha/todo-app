import { relations } from "drizzle-orm/relations";
import { task } from "./task";
import { user } from "./user";

export const userRelations = relations(user, ({ many }) => ({
  task: many(task),
}));

export const taskRelations = relations(task, ({ one }) => ({
  user: one(user, {
    fields: [task.userId],
    references: [user.id],
  }),
}));
