import mongoose, { Schema, Document } from 'mongoose'

export interface IComercioConfig extends Document {
  comercioId: mongoose.Types.ObjectId
  telefono?: string
  direccion?: string
  metodosDePago: string[]
  fechaCreacion: Date
}

const ComercioConfigSchema: Schema = new Schema({
  comercioId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  telefono: {
    type: String
  },
  direccion: {
    type: String
  },
  metodosDePago: {
    type: [String],
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
})

export const ComercioConfig = mongoose.model<IComercioConfig>('ComercioConfig', ComercioConfigSchema)
