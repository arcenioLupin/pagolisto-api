import { Response } from 'express'

export const successResponse = (res: Response, message: string, data: any = {}) => {
  return res.status(200).json({ success: true, message, data })
}

export const createdResponse = (res: Response, message: string, data: any = {}) => {
  return res.status(201).json({ success: true, message, data })
}

export const errorResponse = (res: Response, message: string, code = 500, error: any = {}) => {
  return res.status(code).json({ success: false, message, error })
}
