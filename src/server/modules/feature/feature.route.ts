import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { match } from 'ts-pattern'
import type { AppVariables } from '../../types'
import * as featureSchema from './feature.schema'
import * as featureService from './feature.service'

export const featureRoutes = new Hono<{ Variables: AppVariables }>()
  .get('/', async (c) => {
    const result = await featureService.getAllFeatures(c)
    if (!result.ok) {
      throw match(result.error)
        .with({ type: 'database_error' }, () => new Error('Failed to fetch features'))
        .with({ type: 'feature_not_found' }, () => new Error('Feature not found'))
        .exhaustive()
    }
    return c.json(result.data)
  })
  .get('/:id', zValidator('param', featureSchema.featureIdParamSchema), async (c) => {
    const { id } = c.req.valid('param')
    const result = await featureService.getFeatureById(c, id)
    if (!result.ok) {
      throw match(result.error)
        .with({ type: 'feature_not_found' }, () => new Error('Feature not found'))
        .with({ type: 'database_error' }, () => new Error('Failed to fetch feature'))
        .exhaustive()
    }
    return c.json(result.data)
  })
  .post('/', zValidator('json', featureSchema.createFeatureSchema), async (c) => {
    const validatedData = c.req.valid('json')
    const result = await featureService.createFeature(c, validatedData)
    if (!result.ok) {
      throw match(result.error)
        .with({ type: 'database_error' }, () => new Error('Failed to create feature'))
        .with({ type: 'feature_not_found' }, () => new Error('Feature not found'))
        .exhaustive()
    }
    return c.json(result.data, 201)
  })
  .put('/:id', zValidator('param', featureSchema.featureIdParamSchema), zValidator('json', featureSchema.updateFeatureSchema), async (c) => {
    const { id } = c.req.valid('param')
    const validatedData = c.req.valid('json')
    const result = await featureService.updateFeature(c, id, validatedData)
    if (!result.ok) {
      throw match(result.error)
        .with({ type: 'feature_not_found' }, () => new Error('Feature not found'))
        .with({ type: 'database_error' }, () => new Error('Failed to update feature'))
        .exhaustive()
    }
    return c.json(result.data)
  })
  .delete('/:id', zValidator('param', featureSchema.featureIdParamSchema), async (c) => {
    const { id } = c.req.valid('param')
    const result = await featureService.deleteFeature(c, id)
    if (!result.ok) {
      throw match(result.error)
        .with({ type: 'feature_not_found' }, () => new Error('Feature not found'))
        .with({ type: 'database_error' }, () => new Error('Failed to delete feature'))
        .exhaustive()
    }
    return c.body(null, 204)
  })

