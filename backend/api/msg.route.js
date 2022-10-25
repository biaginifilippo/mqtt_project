import express from 'express'
import ctrl from './controller.js'

const router = express.Router()

router.route("/dosatore").post(ctrl.apiUpdateConfiguration)
router.route("/dosatore").get(ctrl.apiGetMsg)

export default router