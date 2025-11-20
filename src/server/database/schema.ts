import { index, integer, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz', 16)

const prefixes = {
  feature: 'feat',
  vote: 'vote'
} as const

const defaultColumn = (prefix: keyof typeof prefixes) => ({
  id: text('id')
    .primaryKey()
    .$defaultFn(() => newId(prefix)),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
    .notNull()
})

export function newId(prefix: keyof typeof prefixes): string {
  return [prefixes[prefix], nanoid()].join('_')
}

export const Features = pgTable('features', {
  ...defaultColumn('feature'),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  authorName: varchar('author_name', { length: 255 }),
  votesCount: integer('votes_count').default(0).notNull(),
  status: varchar('status', { length: 50 }).default('open').notNull()
})

export const Votes = pgTable(
  'votes',
  {
    ...defaultColumn('vote'),
    featureId: text('feature_id')
      .notNull()
      .references(() => Features.id, { onDelete: 'cascade' }),
    voterIp: varchar('voter_ip', { length: 45 }).notNull()
  },
  (table) => ({
    featureIdIdx: index('votes_feature_id_idx').on(table.featureId),
    voterIpFeatureIdx: uniqueIndex('votes_voter_ip_feature_idx').on(table.voterIp, table.featureId)
  })
)
