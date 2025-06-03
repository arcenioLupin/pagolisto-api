import { Router } from 'express'
import { register, login } from '../controllers/authController'
import { AuthRequest, protect } from '../middlewares/authMiddleware'

const router = Router()

router.post('/register', (req, res, next) => {
  register(req, res).catch(next)
})
router.post('/login', (req, res, next) => {
  login(req, res).catch(next)
})

router.get('/profile', protect, (req: AuthRequest, res) => {
  res.json({ message: 'Ruta privada accedida correctamente', user: req.user })
})

export default router
