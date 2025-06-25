import { Request, Response } from 'express'
import { Charge } from '../models/Charge'
import { AuthRequest } from '../middlewares/authMiddleware'
import { createdResponse, errorResponse, successResponse } from '../utils/response'

// Crear un nuevo cobro
export const createCharge = async (req: AuthRequest, res: Response) => {
  try {
    const { client, amount, paymentType, description, expirationDate } = req.body

    const newCharge = new Charge({
      client,
      amount,
      paymentType,
      status: 'pending', // Estado inicial
      description,
      merchantId: req.user.id,
      expirationDate
    })

    await newCharge.save()

    return createdResponse(res, 'Cobro registrado correctamente', newCharge)
  } catch (error) {
    return errorResponse(res, 'Error al registrar el cobro', 500, error)
  }
}

// Obtener todos los cobros del comercio autenticado
export const getCharges = async (req: AuthRequest, res: Response) => {
  try {
    const charges = await Charge.find({ merchantId: req.user.id }).sort({ createdAt: -1 });
    const now = new Date();

    const updates = charges.map(async (c) => {
      if (c.status === 'pending' && c.expirationDate && new Date(c.expirationDate) < now) {
        c.status = 'expired'
        await c.save()
      }
    });

    await Promise.all(updates)

    const updatedCharges = await Charge.find({ merchantId: req.user.id }).sort({ createdAt: -1 })
    return successResponse(res, 'Cobros obtenidos correctamente', updatedCharges)
  } catch (error) {
    return errorResponse(res, 'Error al obtener los cobros', 500, error)
  }
}

// Obtener un cobro por ID
export const getChargeById = async (req: AuthRequest, res: Response) => {
  try {
    const charge = await Charge.findOne({ _id: req.params.id, merchantId: req.user.id })
    if (!charge) {
      return errorResponse(res, 'Cobro no encontrado', 404)
    }

    return successResponse(res, 'Cobro obtenido correctamente', charge)
  } catch (error) {
    return errorResponse(res, 'Error al obtener el cobro', 500, error)
  }
}

// Actualizar un cobro
export const updateCharge = async (req: AuthRequest, res: Response) => {
  try {
     const { client, amount, paymentType, description, expirationDate } = req.body

    const charge = await Charge.findOneAndUpdate(
      { _id: req.params.id, merchantId: req.user.id },
      { client, amount, paymentType, description,expirationDate },
      { new: true }
    )

    if (!charge) {
      return errorResponse(res, 'Cobro no encontrado', 404)
    }

    return successResponse(res, 'Cobro actualizado correctamente', charge)
  } catch (error) {
    return errorResponse(res, 'Error al actualizar el cobro', 500, error)
  }
}

// Eliminar un cobro
export const deleteCharge = async (req: AuthRequest, res: Response) => {
  try {
    const cobro = await Charge.findOneAndDelete({ _id: req.params.id, merchantId: req.user.id })

    if (!cobro) {
      return errorResponse(res, 'Cobro no encontrado', 404)
    }

    return successResponse(res, 'Cobro eliminado correctamente', null)
  } catch (error) {
    return errorResponse(res, 'Error al eliminar el cobro', 500, error)
  }
}
