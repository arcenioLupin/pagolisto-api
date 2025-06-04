import { Router } from 'express'
import { crearSolicitud, obtenerSolicitudes, obtenerSolicitudPublica } from '../controllers/solicitudPagoController'
import { protect } from '../middlewares/authMiddleware'

const router = Router()

// Privadas para el comercio
router.post('/', protect, (req, res, next) => {
  crearSolicitud(req, res).catch(next)
})

router.get('/', protect, (req, res, next) => {
  obtenerSolicitudes(req, res).catch(next)
})

// Pública para el cliente
router.get('/public/:token', (req, res, next) => {
  obtenerSolicitudPublica(req, res).catch(next)
})

export default router
