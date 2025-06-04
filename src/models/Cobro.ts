import mongoose, { Schema, Document } from 'mongoose'

export interface ICobro extends Document {
  cliente: string
  monto: number
  tipoPago: string
  descripcion?: string
  comercioId: mongoose.Types.ObjectId
  fechaRegistro: Date
}

const CobroSchema: Schema = new Schema({
  cliente: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  tipoPago: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  comercioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
})

export const Cobro = mongoose.model<ICobro>('Cobro', CobroSchema)
