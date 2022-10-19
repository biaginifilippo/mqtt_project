import express from 'express'
import ctrl from './controller.js'

const router = express.Router()

router.route("/dosatore").post(ctrl.apiSendMsg)
export default router