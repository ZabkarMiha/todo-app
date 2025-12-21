import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const task = pgTable(
  "task",
  {
    id: uuid().primaryKey().unique().defaultRandom().notNull(),
    userId: text()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    title: text().notNull(),
    description: text(),
    completed: boolean().notNull(),
    dueDate: timestamp({ withTimezone: true }),
    dateAdded: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("title_index").on(table.title)],
);
