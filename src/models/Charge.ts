import mongoose, { Schema, Document } from 'mongoose'

export interface ICharge extends Document {
  client: string
  amount: number
  paymentType: string,
  status: 'pending' | 'paid' | 'cancelled' | 'expired',
  description?: string
  merchantId: mongoose.Types.ObjectId
  createdAt: Date
  expirationDate?: Date
}

const ChargeSchema: Schema = new Schema({
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
  status: {
  type: String,
  enum: ['pending', 'paid', 'cancelled', 'expired'],
  default: 'pending'
},
  description: {
    type: String
  },
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expirationDate: {
    type: Date,
    default: null
  }
})

export const Charge = mongoose.model<ICharge>('Charge', ChargeSchema)
