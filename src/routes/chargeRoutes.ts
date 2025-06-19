import { Router } from 'express'
import { createCharge, getCharges, getChargeById, updateCharge, deleteCharge  } from '../controllers/chargeController'
import { protect } from '../middlewares/authMiddleware'
import { get } from 'http'

const router = Router()

router.post('/', protect, (req, res, next) => {
 createCharge(req, res).catch(next)
} )
router.get('/', protect,  (req, res, next) => {
   getCharges(req, res).catch(next)
})


router.get('/:id',protect, (req, res, next) => {
  getChargeById(req, res).catch(next)
})

router.put('/:id', protect, (req, res, next) => {
  updateCharge(req, res).catch(next)
})

router.delete('/:id', protect, (req, res, next) => {
  deleteCharge(req, res).catch(next)
})


export default router
