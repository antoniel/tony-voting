import { and, count, eq } from 'drizzle-orm'
import type { Context } from 'hono'
import { Features, Votes } from '../../database/schema'
import type { AppResult } from '../../result'
import { err, ok } from '../../result'
import type { AppVariables } from '../../types'
import type { CreateVoteInput } from './vote.schema'

type VoteError =
  | { type: 'database_error'; error: unknown }
  | { type: 'feature_not_found' }
  | { type: 'vote_not_found' }
  | { type: 'already_voted' }

export const createVote = async (
  c: Context<{ Variables: AppVariables }>,
  voteData: CreateVoteInput
): Promise<AppResult<typeof Votes.$inferSelect, VoteError>> => {
  const dbInstance = c.get('db')

  try {
    // Check if feature exists
    const [feature] = await dbInstance.select({ id: Features.id }).from(Features).where(eq(Features.id, voteData.featureId))

    if (!feature) {
      return err({ type: 'feature_not_found' })
    }

    // Check if user already voted (by IP)
    const existingVotes = await dbInstance
      .select()
      .from(Votes)
      .where(and(eq(Votes.featureId, voteData.featureId), eq(Votes.voterIp, voteData.voterIp)))
    
    const [existingVote] = existingVotes

    if (existingVote) {
      return err({ type: 'already_voted' })
    }

    // Create vote
    const [newVote] = await dbInstance
      .insert(Votes)
      .values({
        featureId: voteData.featureId,
        voterIp: voteData.voterIp
      })
      .returning()

    if (!newVote) {
      return err({ type: 'database_error', error: 'Insert operation did not return expected data' })
    }

    // Update feature vote count
    const [voteCountResult] = await dbInstance
      .select({ count: count() })
      .from(Votes)
      .where(eq(Votes.featureId, voteData.featureId))

    await dbInstance
      .update(Features)
      .set({ votesCount: voteCountResult.count })
      .where(eq(Features.id, voteData.featureId))

    return ok(newVote)
  } catch (error) {
    console.error('Database error during vote creation:', error)
    return err({ type: 'database_error', error })
  }
}

export const deleteVote = async (
  c: Context<{ Variables: AppVariables }>,
  featureId: string,
  voterIp: string
): Promise<AppResult<void, VoteError>> => {
  const dbInstance = c.get('db')

  try {
    const votes = await dbInstance
      .select()
      .from(Votes)
      .where(and(eq(Votes.featureId, featureId), eq(Votes.voterIp, voterIp)))
    
    const [vote] = votes

    if (!vote) {
      return err({ type: 'vote_not_found' })
    }

    await dbInstance.delete(Votes).where(eq(Votes.id, vote.id))

    // Update feature vote count
    const [voteCountResult] = await dbInstance
      .select({ count: count() })
      .from(Votes)
      .where(eq(Votes.featureId, featureId))

    await dbInstance
      .update(Features)
      .set({ votesCount: voteCountResult.count })
      .where(eq(Features.id, featureId))

    return ok(undefined)
  } catch (error) {
    console.error(`Error deleting vote for feature ${featureId}:`, error)
    return err({ type: 'database_error', error })
  }
}

export const hasUserVoted = async (
  c: Context<{ Variables: AppVariables }>,
  featureId: string,
  voterIp: string
): Promise<AppResult<boolean, VoteError>> => {
  const dbInstance = c.get('db')

  try {
    const votes = await dbInstance
      .select()
      .from(Votes)
      .where(and(eq(Votes.featureId, featureId), eq(Votes.voterIp, voterIp)))
    
    const [vote] = votes

    return ok(!!vote)
  } catch (error) {
    console.error(`Error checking vote for feature ${featureId}:`, error)
    return err({ type: 'database_error', error })
  }
}

