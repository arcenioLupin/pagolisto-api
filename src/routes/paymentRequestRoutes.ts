import { Router } from 'express'
import {
  createPaymentRequest,
  getPaymentRequests,
  getPublicPaymentRequest,
  markAsPaid,
  resendPaymentRequest,
  markAsPaidPublic,
  cancelPaymentRequest
} from '../controllers/paymentRequestController'
import { protect } from '../middlewares/authMiddleware'

const router = Router()

// Private for merchants
router.post('/', protect, (req, res, next) => {
  createPaymentRequest(req, res).catch(next)
})

router.get('/', protect, (req, res, next) => {
  getPaymentRequests(req, res).catch(next)
})

// Public for clients
router.get('/public/:token', (req, res, next) => {
  getPublicPaymentRequest(req, res).catch(next)
})

// Mark as paid (merchant)
router.put('/:id/mark-paid', protect, (req, res, next) => {
  markAsPaid(req, res).catch(next)
})

// Resend link (mock)
router.post('/:id/resend', protect, (req, res, next) => {
  resendPaymentRequest(req, res).catch(next)
})

// Mark as paid (client)
router.put('/public/:publicToken/mark-paid', (req, res, next) => {
  markAsPaidPublic(req, res).catch(next)
})
// PATCH /payment-requests/:id/cancel
router.patch('/:id/cancel', (req, res, next) =>{
  cancelPaymentRequest(req, res).catch(next)
}) 

export default router
