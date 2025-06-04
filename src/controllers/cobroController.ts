import { Request, Response } from 'express'
import { Cobro } from '../models/Cobro'
import { AuthRequest } from '../middlewares/authMiddleware'

// Crear un nuevo cobro
export const crearCobro = async (req: AuthRequest, res: Response) => {
  try {
    const { cliente, monto, tipoPago, descripcion } = req.body

    const nuevoCobro = new Cobro({
      cliente,
      monto,
      tipoPago,
      descripcion,
      comercioId: req.user.id // lo que recuperamos del token
    })

    await nuevoCobro.save()

    res.status(201).json({ message: 'Cobro registrado correctamente', cobro: nuevoCobro })
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el cobro', error })
  }
}

// Obtener todos los cobros del comercio autenticado
export const obtenerCobros = async (req: AuthRequest, res: Response) => {
  try {
    const cobros = await Cobro.find({ comercioId: req.user.id }).sort({ fechaRegistro: -1 })
    res.json({ cobros })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cobros', error })
  }
}

// Obtener un cobro por ID
export const obtenerCobroPorId = async (req: AuthRequest, res: Response) => {
  try {
    const cobro = await Cobro.findOne({ _id: req.params.id, comercioId: req.user.id })
    if (!cobro) return res.status(404).json({ message: 'Cobro no encontrado' })
    res.json(cobro)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cobro', error })
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

    if (!cobro) return res.status(404).json({ message: 'Cobro no encontrado' })

    res.json({ message: 'Cobro actualizado', cobro })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cobro', error })
  }
}

// Eliminar un cobro
export const eliminarCobro = async (req: AuthRequest, res: Response) => {
  try {
    const cobro = await Cobro.findOneAndDelete({ _id: req.params.id, comercioId: req.user.id })

    if (!cobro) return res.status(404).json({ message: 'Cobro no encontrado' })

    res.json({ message: 'Cobro eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cobro', error })
  }
}

