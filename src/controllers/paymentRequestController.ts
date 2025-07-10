import { Request, Response } from 'express'
import { PaymentRequest } from '../models/PaymentRequest'
import { AuthRequest } from '../middlewares/authMiddleware'
import { logActivity } from '../utils/logger'
import { User } from '../models/User'
import { notifyMerchant } from '../utils/notifier'
import { Types } from 'mongoose'
import {
  createdResponse,
  errorResponse,
  successResponse,
} from '../utils/response'

// Create new payment request
export const createPaymentRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { client, amount, paymentType, description, expirationDate } = req.body

    const newRequest = new PaymentRequest({
      merchantId: req.user.id,
      client,
      amount,
      paymentType,
       status: 'pending', // Estado inicial
      description,
      expirationDate,
    })

    await newRequest.save()

    logActivity('Payment request created', {
      client,
      amount,
      paymentType,
      merchantId: req.user.id,
    })

    return createdResponse(res, 'Payment request created successfully', newRequest)
  } catch (error) {
    return errorResponse(res, 'Error creating payment request', 500, error)
  }
}

// Get all payment requests for the merchant
export const getPaymentRequests = async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date()

    const requests = await PaymentRequest.find({ merchantId: req.user.id }).sort({ createdAt: -1 })

    const updates = requests.map(async (r) => {
      if (r.status === 'pending' && r.expirationDate && r.expirationDate < now) {
        r.status = 'expired'
        await r.save()
      }
    })

    await Promise.all(updates)

    const updated = await PaymentRequest.find({ merchantId: req.user.id }).sort({ createdAt: -1 })

    return successResponse(res, 'Payment requests retrieved successfully', updated)
  } catch (error) {
    return errorResponse(res, 'Error retrieving payment requests', 500, error)
  }
}

// Get public payment request by token
export const getPublicPaymentRequest = async (req: Request, res: Response) => {
  try {
    const { token } = req.params
    const request = await PaymentRequest.findOne({ publicToken: token })

    if (!request) {
      return errorResponse(res, 'Payment request not found', 400)
    }

    return successResponse(res, 'Public payment request retrieved successfully', request)
  } catch (error) {
    return errorResponse(res, 'Error accessing payment request', 500, error)
  }
}

// Mark as paid (merchant)
export const markAsPaid = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const request = await PaymentRequest.findOne({ _id: id, merchantId: req.user.id })

    if (!request) {
      return errorResponse(res, 'Payment request not found', 400)
    }

    request.status = 'paid'
    request.paymentDate = new Date()

    await request.save()

    logActivity('Payment request marked as paid', {
      requestId: request._id,
      paymentDate: request.paymentDate,
      merchantId: req.user.id,
    })

    return createdResponse(res, 'Payment marked as paid', request)
  } catch (error) {
    return errorResponse(res, 'Error marking as paid', 500, error)
  }
}

// Resend payment request (mock)
export const resendPaymentRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const request = await PaymentRequest.findOne({ _id: id, merchantId: req.user.id })

    if (!request) {
      return errorResponse(res, 'Payment request not found', 400)
    }

    console.log(`📤 Resend link: http://localhost:3000/payment/${request.publicToken}`)

    return createdResponse(res, 'Payment request resent (mock)', null)
  } catch (error) {
    return errorResponse(res, 'Error resending payment request', 500, error)
  }
}

// Mark as paid (client)
export const markAsPaidPublic = async (req: Request, res: Response) => {
  try {

    const { publicToken } = req.params
    const request = await PaymentRequest.findOne({publicToken })

    if (!request) {
      return errorResponse(res, 'Payment request not found', 400)
    }

    if (request.status !== 'pending') {
      return errorResponse(res, `Cannot pay this request (status: ${request.status})`, 400)
    }

    request.status = 'paid'
    request.paymentDate = new Date()
    await request.save()

    const merchant = await User.findById(request.merchantId)
    if (merchant) {
      notifyMerchant(merchant.email, (request._id as Types.ObjectId).toString())
    }

    logActivity('Payment request marked as paid by client', {
      requestId: request._id,
      publicToken,
    })

    console.log(`✅ Client marked request as paid. ID: ${request._id}`)

    return createdResponse(res, 'Payment marked successfully', request)
  } catch (error) {
    return errorResponse(res, 'Error marking as paid', 500, error)
  }
}

export const cancelPaymentRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const request = await PaymentRequest.findById(id)

    if (!request) {
      return res.status(404).json({ message: 'Payment request not found' })
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be cancelled' })
    }

    request.status = 'cancelled'
    await request.save()
    logActivity('Payment request marked as cancelled', {
        requestId: request._id,
        client: request.client,
        amount: request.amount,
      })
    return createdResponse(res, 'Payment request cancelled successfully', request)
  } catch (error) {
    return errorResponse(res, 'Error marking as cancelled', 500, error)
  }
  
}

