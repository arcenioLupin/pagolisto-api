import { Router } from 'express'

import { protect } from '../middlewares/authMiddleware'
import { getChargesOverTime, getDashboardSummary, getPaymentMethodsSummary, getPaymentRequestsOverTime } from '../controllers/dashboardController'

const router = Router()

router.get('/', protect, (req, res, next) => {
  getDashboardSummary(req, res).catch(next)
})

router.get('/payment-methods-summary', protect, (req, res, next) => {
  getPaymentMethodsSummary(req, res).catch(next)
})

router.get('/charges-over-time', protect, (req, res, next) => {
  getChargesOverTime(req, res).catch(next)
})

router.get('/payment-requests-over-time', protect, (req, res, next) => {
  getPaymentRequestsOverTime(req, res).catch(next)
})



export default router