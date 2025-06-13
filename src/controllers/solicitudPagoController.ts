import { Request, Response } from 'express'
import { SolicitudPago } from '../models/SolicitudPago'
import { AuthRequest } from '../middlewares/authMiddleware'
import { logActividad } from '../utils/logger'
import { User } from '../models/User'
import { notificarAlComercio } from '../utils/notificador'
import { Types } from 'mongoose'
import {
  createdResponse,
  errorResponse,
  successResponse,
} from '../utils/response'

// Crear nueva solicitud de pago
export const crearSolicitud = async (req: AuthRequest, res: Response) => {
  try {
    const { cliente, monto, tipoPago, descripcion, fechaExpiracion } = req.body

    const nuevaSolicitud = new SolicitudPago({
      comercioId: req.user.id,
      cliente,
      monto,
      tipoPago,
      descripcion,
      fechaExpiracion,
    })

    await nuevaSolicitud.save()

    logActividad('Solicitud de pago creada', {
      cliente,
      monto,
      tipoPago,
      comercioId: req.user.id,
    })

    return createdResponse(res, 'Solicitud creada exitosamente', nuevaSolicitud)
  } catch (error) {
    return errorResponse(res, 'Error al crear solicitud de pago', 500, error)
  }
}

// Obtener todas las solicitudes del comercio
export const obtenerSolicitudes = async (req: AuthRequest, res: Response) => {
  try {
    const ahora = new Date()

    const solicitudes = await SolicitudPago.find({ comercioId: req.user.id }).sort({ fechaCreacion: -1 })

    // Verifica expiración y actualiza estado si corresponde
    const updates = solicitudes.map(async (s) => {
      if (s.estado === 'pendiente' && s.fechaExpiracion && s.fechaExpiracion < ahora) {
        s.estado = 'vencido'
        await s.save()
      }
    })

    await Promise.all(updates)

    const actualizadas = await SolicitudPago.find({ comercioId: req.user.id }).sort({ fechaCreacion: -1 })

    return successResponse(res, 'Solicitudes actualizadas correctamente', actualizadas)
  } catch (error) {
    return errorResponse(res, 'Error al obtener solicitudes', 500, error)
  }
}

// Obtener solicitud por token público
export const obtenerSolicitudPublica = async (req: Request, res: Response) => {
  try {
    const { token } = req.params
    const solicitud = await SolicitudPago.findOne({ tokenPublico: token })

    if (!solicitud) {
      return errorResponse(res, 'Solicitud no encontrada', 400)
    }

    return successResponse(res, 'Solicitud pública obtenida correctamente', solicitud)
  } catch (error) {
    return errorResponse(res, 'Error al acceder a la solicitud', 500, error)
  }
}

// Marcar solicitud como pagada (comercio)
export const marcarComoPagado = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const solicitud = await SolicitudPago.findOne({ _id: id, comercioId: req.user.id })

    if (!solicitud) {
      return errorResponse(res, 'Solicitud no encontrada', 400)
    }

    solicitud.estado = 'pagado'
    solicitud.fechaPago = new Date()

    await solicitud.save()

    logActividad('Solicitud marcada como pagado', {
      solicitudId: solicitud._id,
      fechaPago: solicitud.fechaPago,
      comercioId: req.user.id,
    })

    return createdResponse(res, 'Solicitud marcada como pagada', solicitud)
  } catch (error) {
    return errorResponse(res, 'Error al marcar como pagado', 500, error)
  }
}

// Reenviar solicitud (mock)
export const reenviarSolicitud = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const solicitud = await SolicitudPago.findOne({ _id: id, comercioId: req.user.id })

    if (!solicitud) {
      return errorResponse(res, 'Solicitud no encontrada', 400)
    }

    console.log(`📤 Link reenviado: http://localhost:3000/pago/${solicitud.tokenPublico}`)

    return createdResponse(res, 'Solicitud reenviada correctamente (mock)', null)
  } catch (error) {
    return errorResponse(res, 'Error al reenviar solicitud', 500, error)
  }
}

// Marcar solicitud como pagada (cliente)
export const marcarComoPagadoPublico = async (req: Request, res: Response) => {
  try {
    const { tokenPublico } = req.params
    const solicitud = await SolicitudPago.findOne({ tokenPublico })

    if (!solicitud) {
      return errorResponse(res, 'Solicitud no encontrada', 400)
    }

    if (solicitud.estado !== 'pendiente') {
      return errorResponse(res, `No se puede pagar esta solicitud (estado: ${solicitud.estado})`, 400)
    }

    solicitud.estado = 'pagado'
    solicitud.fechaPago = new Date()

    await solicitud.save()

    const comercio = await User.findById(solicitud.comercioId)
    if (comercio) {
      notificarAlComercio(comercio.email, (solicitud._id as Types.ObjectId).toString())
    }

    logActividad('Solicitud marcada como pagada por el cliente', {
      solicitudId: solicitud._id,
      tokenPublico,
    })

    console.log(`✅ Cliente marcó como pagado la solicitud con ID: ${solicitud._id}`)

    return createdResponse(res, 'Pago marcado correctamente', null)
  } catch (error) {
    return errorResponse(res, 'Error al marcar como pagado', 500, error)
  }
}
