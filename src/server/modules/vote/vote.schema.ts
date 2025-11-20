import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { Votes } from '../../database/schema'

export const createVoteSchema = createInsertSchema(Votes, {
  voterIp: z.string().optional() // Will be set from headers if not provided
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const voteIdParamSchema = z.object({ id: z.string() })
export const featureIdParamSchema = z.object({ featureId: z.string() })

export type CreateVoteInput = z.infer<typeof createVoteSchema>

