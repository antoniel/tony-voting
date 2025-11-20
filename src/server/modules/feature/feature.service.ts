import { desc, eq } from 'drizzle-orm'
import type { Context } from 'hono'
import { Features } from '../../database/schema'
import type { AppResult } from '../../result'
import { err, ok } from '../../result'
import type { AppVariables } from '../../types'
import type { CreateFeatureInput, UpdateFeatureInput } from './feature.schema'

type FeatureError = { type: 'database_error'; error: unknown } | { type: 'feature_not_found' }

export const getAllFeatures = async (
  c: Context<{ Variables: AppVariables }>
): Promise<AppResult<(typeof Features.$inferSelect)[], FeatureError>> => {
  const dbInstance = c.get('db')
  try {
    const allFeatures = await dbInstance.select().from(Features).orderBy(desc(Features.votesCount), desc(Features.createdAt))

    return ok(allFeatures)
  } catch (error) {
    console.error('Error fetching all features:', error)
    return err({ type: 'database_error', error })
  }
}

export const getFeatureById = async (
  c: Context<{ Variables: AppVariables }>,
  id: string
): Promise<AppResult<typeof Features.$inferSelect, FeatureError>> => {
  const dbInstance = c.get('db')
  try {
    const [feature] = await dbInstance.select().from(Features).where(eq(Features.id, id))

    if (!feature) {
      return err({ type: 'feature_not_found' })
    }

    return ok(feature)
  } catch (error) {
    console.error(`Error fetching feature with ID ${id}:`, error)
    return err({ type: 'database_error', error })
  }
}

export const createFeature = async (
  c: Context<{ Variables: AppVariables }>,
  featureData: CreateFeatureInput
): Promise<AppResult<typeof Features.$inferSelect, FeatureError>> => {
  const dbInstance = c.get('db')

  try {
    const [newFeature] = await dbInstance
      .insert(Features)
      .values({
        title: featureData.title.trim(),
        description: featureData.description.trim(),
        authorName: featureData.authorName?.trim() || null,
        status: featureData.status || 'open',
        votesCount: 0
      })
      .returning()

    if (!newFeature) {
      return err({ type: 'database_error', error: 'Insert operation did not return expected data' })
    }

    return ok(newFeature)
  } catch (error) {
    console.error('Database error during feature creation:', error)
    return err({ type: 'database_error', error })
  }
}

export const updateFeature = async (
  c: Context<{ Variables: AppVariables }>,
  id: string,
  updateData: UpdateFeatureInput
): Promise<AppResult<typeof Features.$inferSelect, FeatureError>> => {
  const dbInstance = c.get('db')

  try {
    const featureCheck = await dbInstance.select({ id: Features.id }).from(Features).where(eq(Features.id, id))

    if (featureCheck.length === 0) {
      return err({ type: 'feature_not_found' })
    }

    const updateValues: any = { updatedAt: new Date() }
    if (updateData.title !== undefined) updateValues.title = updateData.title.trim()
    if (updateData.description !== undefined) updateValues.description = updateData.description.trim()
    if (updateData.status !== undefined) updateValues.status = updateData.status

    const [updatedFeature] = await dbInstance.update(Features).set(updateValues).where(eq(Features.id, id)).returning()

    if (!updatedFeature) {
      return err({ type: 'feature_not_found' })
    }

    return ok(updatedFeature)
  } catch (error) {
    console.error(`Error updating feature with ID ${id}:`, error)
    return err({ type: 'database_error', error })
  }
}

export const deleteFeature = async (
  c: Context<{ Variables: AppVariables }>,
  id: string
): Promise<AppResult<void, FeatureError>> => {
  const dbInstance = c.get('db')

  try {
    const featureCheck = await dbInstance.select({ id: Features.id }).from(Features).where(eq(Features.id, id))

    if (featureCheck.length === 0) {
      return err({ type: 'feature_not_found' })
    }

    await dbInstance.delete(Features).where(eq(Features.id, id))

    return ok(undefined)
  } catch (error) {
    console.error(`Error deleting feature with ID ${id}:`, error)
    return err({ type: 'database_error', error })
  }
}

