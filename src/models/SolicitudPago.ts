import mongoose, { Schema, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface ISolicitudPago extends Document {
  comercioId: mongoose.Types.ObjectId
  cliente: string
  monto: number
  tipoPago: string
  descripcion?: string
  estado: 'pendiente' | 'pagado' | 'vencido'
  tokenPublico: string
  fechaCreacion: Date
  fechaPago?: Date
  fechaExpiracion?: Date
}

const SolicitudPagoSchema: Schema = new Schema({
  comercioId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'vencido'],
    default: 'pendiente'
  },
  tokenPublico: {
    type: String,
    default: uuidv4,
    unique: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaPago: {
    type: Date,
    default: null
  },
  fechaExpiracion: {
  type: Date,
  default: null
}
})

export const SolicitudPago = mongoose.model<ISolicitudPago>('SolicitudPago', SolicitudPagoSchema)
