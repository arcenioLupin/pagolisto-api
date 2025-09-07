import { Router } from 'express'
import { getMerchantConfig, saveMerchantConfig } from '../controllers/merchantConfigController'
import { protect } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', protect, (req, res, next) => {
  getMerchantConfig(req, res).catch(next)
})

router.put('/', protect, (req, res, next) => {
  saveMerchantConfig(req, res).catch(next)
})

export default router
