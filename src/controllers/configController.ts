import { Request, Response } from 'express'
import { ComercioConfig } from '../models/ComercioConfig'
import { AuthRequest } from '../middlewares/authMiddleware'
import { createdResponse, errorResponse, successResponse } from '../utils/response'

// Obtener configuración del comercio
export const obtenerConfig = async (req: AuthRequest, res: Response) => {
  try {
    const config = await ComercioConfig.findOne({ comercioId: req.user.id })

    if (!config) {
      return errorResponse(res, 'Configuración no encontrada', 404)
    }

    return successResponse(res, 'Configuración obtenida correctamente', config)
  } catch (error) {
    return errorResponse(res, 'Error al obtener la configuración', 500, error)
  }
}

// Crear o actualizar configuración del comercio
export const guardarConfig = async (req: AuthRequest, res: Response) => {
  try {
    const { telefono, direccion, metodosDePago } = req.body

    let config = await ComercioConfig.findOne({ comercioId: req.user.id })

    if (config) {
      config.telefono = telefono
      config.direccion = direccion
      config.metodosDePago = metodosDePago
      await config.save()
      return successResponse(res, 'Configuración actualizada correctamente', config)
    }

    config = new ComercioConfig({
      comercioId: req.user.id,
      telefono,
      direccion,
      metodosDePago
    })

    await config.save()
    return createdResponse(res, 'Configuración creada correctamente', config)
  } catch (error) {
    return errorResponse(res, 'Error al guardar configuración', 500, error)
  }
}
