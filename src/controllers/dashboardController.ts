// src/controllers/dashboardController.ts
import { Request, Response } from 'express'
import {Charge} from '../models/Charge'
import {PaymentRequest} from '../models/PaymentRequest'
import mongoose from 'mongoose'
import { startOfDay, endOfDay } from 'date-fns'

export const getDashboardSummary = async (req: Request, res: Response) => {

    console.log('request in getDashboardSummary : ',req)
  try {
    const { merchantId, startDate, endDate } = req.query

    if (!merchantId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Faltan parámetros' })
    }

    const from = new Date(startDate as string)
    const to = new Date(endDate as string)

    const charges = await Charge.find({
      merchantId,
      createdAt: { $gte: from, $lte: to },
    })

    const paymentRequests = await PaymentRequest.find({
      merchantId,
      createdAt: { $gte: from, $lte: to },
    })

    const totalSales = charges.reduce((acc, c) => acc + c.amount, 0)

    return res.json({
      totalSales,
      chargesCount: charges.length,
      paymentRequestsCount: paymentRequests.length,
    })
  } catch (error) {
    console.error('[Dashboard Summary]', error)
    res.status(500).json({ message: 'Error al obtener el resumen del dashboard' })
  }
}

export const getPaymentMethodsSummary = async (req: Request, res: Response) => {
  try {
    const { merchantId, startDate, endDate } = req.query

    if (!merchantId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Faltan parámetros' })
    }

    const from = new Date(startDate as string)
    const to = new Date(endDate as string)

    const charges = await Charge.aggregate([
      {
        $match: {
          merchantId: new mongoose.Types.ObjectId(merchantId as string),
          createdAt: { $gte: from, $lte: to },
        },
      },
      {
        $group: {
          _id: '$paymentType',
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          paymentType: '$_id',
          totalAmount: 1,
        },
      },
    ])

    return res.json(charges)
  } catch (error) {
    console.error('[Payment Methods Summary]', error)
    res.status(500).json({ message: 'Error al obtener el resumen por método de pago' })
  }
}



export const getChargesOverTime = async (req: Request, res: Response) => {
  try {
    const { merchantId, startDate, endDate } = req.query

    if (!merchantId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Faltan parámetros' })
    }

    const from = new Date(startDate as string)
    const to = new Date(endDate as string)

    const data = await Charge.aggregate([
      {
        $match: {
          merchantId: new mongoose.Types.ObjectId(merchantId as string),
          createdAt: { $gte: from, $lte: to }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    return res.json(data)
  } catch (error) {
    console.error('[Charges Over Time]', error)
    res.status(500).json({ message: 'Error al obtener datos de cobros por día' })
  }
}



export const getPaymentRequestsOverTime = async (req: Request, res: Response) => {
  try {
    const { merchantId, startDate, endDate } = req.query

    if (!merchantId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Faltan parámetros' })
    }

    const from = new Date(startDate as string)
    const to = new Date(endDate as string)

    const result = await PaymentRequest.aggregate([
      {
        $match: {
          merchantId: new mongoose.Types.ObjectId(merchantId as string),
          createdAt: {
            $gte: startOfDay(from),
            $lte: endOfDay(to),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    return res.json(result)
  } catch (error) {
    console.error('[PaymentRequestsOverTime]', error)
    return res.status(500).json({ message: 'Error al obtener los datos' })
  }
}



