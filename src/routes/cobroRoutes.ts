import { Router } from 'express'
import { crearCobro, obtenerCobros, obtenerCobroPorId, actualizarCobro, eliminarCobro  } from '../controllers/cobroController'
import { protect } from '../middlewares/authMiddleware'

const router = Router()

router.post('/', protect, crearCobro)
router.get('/', protect, obtenerCobros)
//router.get('/:id', protect, obtenerCobroPorId)
//router.put('/:id', protect, actualizarCobro)
//router.delete('/:id', protect, eliminarCobro)

router.get('/:id',protect, (req, res, next) => {
  obtenerCobroPorId(req, res).catch(next)
})

router.put('/:id', protect, (req, res, next) => {
  actualizarCobro(req, res).catch(next)
})

router.delete('/:id', protect, (req, res, next) => {
  eliminarCobro(req, res).catch(next)
})


export default router
