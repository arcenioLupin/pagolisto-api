import { Router } from 'express'
import { obtenerConfig, guardarConfig } from '../controllers/configController'
import { protect } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', protect, (req, res, next) => {
  obtenerConfig(req, res).catch(next)
})

router.put('/', protect, (req, res, next) => {
  guardarConfig(req, res).catch(next)
})

export default router
