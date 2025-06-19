import mongoose, { Schema, Document } from 'mongoose'

export interface IMerchantConfig extends Document {
  merchantId: mongoose.Types.ObjectId,
  phone?: string,
  address?: string,
  paymentsMethod: string[],
  createdAt: Date
}

const MerchantConfigSchema: Schema = new Schema({
  merchantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  paymentsMethod: {
    type: [String],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const MerchantConfig = mongoose.model<IMerchantConfig>('MerchantConfig', MerchantConfigSchema)
