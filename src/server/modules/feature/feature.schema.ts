import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { Features } from '../../database/schema'

export const createFeatureSchema = createInsertSchema(Features, {
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  authorName: z.string().max(255).optional(),
  status: z.enum(['open', 'closed', 'in_progress', 'completed']).default('open')
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  votesCount: true
})

export const updateFeatureSchema = createInsertSchema(Features, {
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(['open', 'closed', 'in_progress', 'completed']).optional()
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  votesCount: true,
  authorName: true
}).partial()

export const featureIdParamSchema = z.object({ id: z.string() })

export const selectFeatureSchema = createSelectSchema(Features)

export type CreateFeatureInput = z.infer<typeof createFeatureSchema>
export type UpdateFeatureInput = z.infer<typeof updateFeatureSchema>

