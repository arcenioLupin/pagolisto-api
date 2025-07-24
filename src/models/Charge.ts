import mongoose, { Schema, Document } from 'mongoose'

export interface ICharge extends Document {
  client: string
  amount: number
  paymentType: string,
  status: 'paid',
  description?: string
  merchantId: mongoose.Types.ObjectId
  createdAt: Date
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
  enum: ['paid'],
  default: 'paid'
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
  }
})

export const Charge = mongoose.model<ICharge>('Charge', ChargeSchema)
