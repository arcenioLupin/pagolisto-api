import { Request, Response } from 'express'
import { ComercioConfig } from '../models/ComercioConfig'
import { AuthRequest } from '../middlewares/authMiddleware'

// Obtener configuración del comercio
export const obtenerConfig = async (req: AuthRequest, res: Response) => {
  try {
    const config = await ComercioConfig.findOne({ comercioId: req.user.id })

    if (!config) return res.status(404).json({ message: 'Configuración no encontrada' })

    res.json(config)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la configuración', error })
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
      return res.json({ message: 'Configuración actualizada', config })
    }

    config = new ComercioConfig({
      comercioId: req.user.id,
      telefono,
      direccion,
      metodosDePago
    })

    await config.save()
    res.status(201).json({ message: 'Configuración creada', config })
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar configuración', error })
  }
}
