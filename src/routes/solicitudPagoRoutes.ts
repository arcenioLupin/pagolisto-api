import { Router } from 'express'
import { crearSolicitud, obtenerSolicitudes, obtenerSolicitudPublica, marcarComoPagado, reenviarSolicitud,marcarComoPagadoPublico   } from '../controllers/solicitudPagoController'
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

router.put('/:id/pagar', protect, (req, res, next) => {
  marcarComoPagado(req, res).catch(next)
})

router.post('/:id/reenviar', protect, (req, res, next) => {
  reenviarSolicitud(req, res).catch(next)
})

router.put('/public/:tokenPublico/pagar', (req, res, next) => {
  marcarComoPagadoPublico(req, res).catch(next) 
})

export default router
