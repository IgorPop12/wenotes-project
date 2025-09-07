
import { Router } from 'express'
import { PublicController } from '../controllers/PublicController'

export const publicRouter = Router()

publicRouter.get('/:slug', PublicController.bySlug)
