import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { match } from 'ts-pattern'
import type { AppVariables } from '../../types'
import * as voteSchema from './vote.schema'
import * as voteService from './vote.service'

export const voteRoutes = new Hono<{ Variables: AppVariables }>()
  .post('/', zValidator('json', voteSchema.createVoteSchema), async (c) => {
    const validatedData = c.req.valid('json')
    // Get IP from request headers if not provided
    const voterIp = validatedData.voterIp || c.req.header('x-forwarded-for')?.split(',')[0] || c.req.header('x-real-ip') || 'unknown'
    const voteData = { ...validatedData, voterIp }
    const result = await voteService.createVote(c, voteData)
    if (!result.ok) {
      throw match(result.error)
        .with({ type: 'feature_not_found' }, () => new Error('Feature not found'))
        .with({ type: 'already_voted' }, () => new Error('You have already voted for this feature'))
        .with({ type: 'database_error' }, () => new Error('Failed to create vote'))
        .with({ type: 'vote_not_found' }, () => new Error('Vote not found'))
        .exhaustive()
    }
    return c.json(result.data, 201)
  })
  .delete('/:featureId', zValidator('param', voteSchema.featureIdParamSchema), async (c) => {
    const { featureId } = c.req.valid('param')
    // Get IP from request headers
    const voterIp = c.req.header('x-forwarded-for')?.split(',')[0] || c.req.header('x-real-ip') || 'unknown'
    const result = await voteService.deleteVote(c, featureId, voterIp)
    if (!result.ok) {
      throw match(result.error)
        .with({ type: 'vote_not_found' }, () => new Error('Vote not found'))
        .with({ type: 'database_error' }, () => new Error('Failed to delete vote'))
        .with({ type: 'feature_not_found' }, () => new Error('Feature not found'))
        .exhaustive()
    }
    return c.body(null, 204)
  })
  .get('/:featureId/check', zValidator('param', voteSchema.featureIdParamSchema), async (c) => {
    const { featureId } = c.req.valid('param')
    const voterIp = c.req.header('x-forwarded-for')?.split(',')[0] || c.req.header('x-real-ip') || 'unknown'
    const result = await voteService.hasUserVoted(c, featureId, voterIp)
    if (!result.ok) {
      throw match(result.error)
        .with({ type: 'database_error' }, () => new Error('Failed to check vote status'))
        .with({ type: 'feature_not_found' }, () => new Error('Feature not found'))
        .with({ type: 'vote_not_found' }, () => new Error('Vote not found'))
        .exhaustive()
    }
    return c.json({ hasVoted: result.data })
  })

