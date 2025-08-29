import { uuidv7 } from "uuidv7"
import { bigint, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const links = pgTable('links', {
    id: text('id').primaryKey().$defaultFn(() => uuidv7()),
    original: text('original').notNull(),
    short: text('short').notNull().unique(),
    accesses: bigint('accesses', { mode: 'number'}).notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow()
})