import { Request, Response } from 'express'
import { Cobro } from '../models/Cobro'
import { AuthRequest } from '../middlewares/authMiddleware'
import { createdResponse, errorResponse, successResponse } from '../utils/response'

// Crear un nuevo cobro
export const crearCobro = async (req: AuthRequest, res: Response) => {
  try {
    const { cliente, monto, tipoPago, descripcion } = req.body

    const nuevoCobro = new Cobro({
      cliente,
      monto,
      tipoPago,
      descripcion,
      comercioId: req.user.id
    })

    await nuevoCobro.save()

    return createdResponse(res, 'Cobro registrado correctamente', nuevoCobro)
  } catch (error) {
    return errorResponse(res, 'Error al registrar el cobro', 500, error)
  }
}

// Obtener todos los cobros del comercio autenticado
export const obtenerCobros = async (req: AuthRequest, res: Response) => {
  try {
    const cobros = await Cobro.find({ comercioId: req.user.id }).sort({ fechaRegistro: -1 })
    return successResponse(res, 'Cobros obtenidos correctamente', cobros)
  } catch (error) {
    return errorResponse(res, 'Error al obtener los cobros', 500, error)
  }
}

// Obtener un cobro por ID
export const obtenerCobroPorId = async (req: AuthRequest, res: Response) => {
  try {
    const cobro = await Cobro.findOne({ _id: req.params.id, comercioId: req.user.id })
    if (!cobro) {
      return errorResponse(res, 'Cobro no encontrado', 404)
    }

    return successResponse(res, 'Cobro obtenido correctamente', cobro)
  } catch (error) {
    return errorResponse(res, 'Error al obtener el cobro', 500, error)
  }
}

// Actualizar un cobro
export const actualizarCobro = async (req: AuthRequest, res: Response) => {
  try {
    const { cliente, monto, tipoPago, descripcion } = req.body

    const cobro = await Cobro.findOneAndUpdate(
      { _id: req.params.id, comercioId: req.user.id },
      { cliente, monto, tipoPago, descripcion },
      { new: true }
    )

    if (!cobro) {
      return errorResponse(res, 'Cobro no encontrado', 404)
    }

    return successResponse(res, 'Cobro actualizado correctamente', cobro)
  } catch (error) {
    return errorResponse(res, 'Error al actualizar el cobro', 500, error)
  }
}

// Eliminar un cobro
export const eliminarCobro = async (req: AuthRequest, res: Response) => {
  try {
    const cobro = await Cobro.findOneAndDelete({ _id: req.params.id, comercioId: req.user.id })

    if (!cobro) {
      return errorResponse(res, 'Cobro no encontrado', 404)
    }

    return successResponse(res, 'Cobro eliminado correctamente', null)
  } catch (error) {
    return errorResponse(res, 'Error al eliminar el cobro', 500, error)
  }
}
