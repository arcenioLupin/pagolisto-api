import mongoose, { Schema, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IPaymentRequest extends Document {
  merchantId: mongoose.Types.ObjectId
  client: string
  amount: number
  paymentType: string
  description?: string
  status: 'pending' | 'paid' | 'expired'
  publicToken: string
  createdAt: Date
  paymentDate?: Date
  expirationDate?: Date
}

const PaymentRequestSchema: Schema = new Schema({
  merchantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentType: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'expired'],
    default: 'pending'
  },
  publicToken: {
    type: String,
    default: uuidv4,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paymentDate: {
    type: Date,
    default: null
  },
  expirationDate: {
    type: Date,
    default: null
  }
})

export const PaymentRequest = mongoose.model<IPaymentRequest>('PaymentRequest', PaymentRequestSchema)
