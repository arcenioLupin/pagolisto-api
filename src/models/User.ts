import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  email: string
  password: string
  businessName: string
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    businessName: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

export const User = mongoose.model<IUser>('User', userSchema)
