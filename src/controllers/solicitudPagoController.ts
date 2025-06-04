import { Request, Response } from 'express'
import { SolicitudPago } from '../models/SolicitudPago'
import { AuthRequest } from '../middlewares/authMiddleware'

// Crear nueva solicitud de pago
export const crearSolicitud = async (req: AuthRequest, res: Response) => {
  try {
    const { cliente, monto, tipoPago, descripcion } = req.body

    const nuevaSolicitud = new SolicitudPago({
      comercioId: req.user.id,
      cliente,
      monto,
      tipoPago,
      descripcion
    })

    await nuevaSolicitud.save()
    res.status(201).json(nuevaSolicitud)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear solicitud de pago', error })
  }
}

// Obtener todas las solicitudes del comercio
export const obtenerSolicitudes = async (req: AuthRequest, res: Response) => {
  try {
    const solicitudes = await SolicitudPago.find({ comercioId: req.user.id }).sort({ fechaCreacion: -1 })
    res.json(solicitudes)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener solicitudes', error })
  }
}

// Obtener solicitud por token público (para vista del cliente)
export const obtenerSolicitudPublica = async (req: Request, res: Response) => {
  try {
    const { token } = req.params
    const solicitud = await SolicitudPago.findOne({ tokenPublico: token })

    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' })

    res.json(solicitud)
  } catch (error) {
    res.status(500).json({ message: 'Error al acceder a la solicitud', error })
  }
}
