import {
  pgTable,
  index,
  uuid,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"
import { user } from "./user"

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
    dateAdded: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => {
    return {
      titleIdx: index("title__index").using(
        "btree",
        table.title.asc().nullsLast()
      ),
    }
  }
)
