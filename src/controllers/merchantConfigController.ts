import { Request, Response } from 'express'
import { MerchantConfig } from '../models/MerchantConfig'
import { AuthRequest } from '../middlewares/authMiddleware'
import { createdResponse, errorResponse, successResponse } from '../utils/response'

// Obtener configuración del comercio
export const getMerchantConfig = async (req: AuthRequest, res: Response) => {
  try {
    const config = await MerchantConfig.findOne({ merchantId: req.user.id })

    if (!config) {
      return errorResponse(res, 'Configuración no encontrada', 404)
    }

    return successResponse(res, 'Configuración obtenida correctamente', config)
  } catch (error) {
    return errorResponse(res, 'Error al obtener la configuración', 500, error)
  }
}

// Crear o actualizar configuración del comercio
export const saveMerchantConfig = async (req: AuthRequest, res: Response) => {
  try {
    const { phone, address, paymentsMethod } = req.body

    let config = await MerchantConfig.findOne({ merchantId: req.user.id })

    if (config) {
      config.phone = phone
      config.address = address
      config.paymentsMethod = paymentsMethod
      await config.save()
      return successResponse(res, 'Configuración actualizada correctamente', config)
    }

    config = new MerchantConfig({
      merchantId: req.user.id,
      phone,
      address,
      paymentsMethod: paymentsMethod || [], // Asegurarse de que sea un array
      
    })

    await config.save()
    return createdResponse(res, 'Configuración creada correctamente', config)
  } catch (error) {
    return errorResponse(res, 'Error al guardar configuración', 500, error)
  }
}
