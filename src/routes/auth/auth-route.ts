import express from "express"
import * as AuthController from "../../controller/auth/auth-controller"
const router = express.Router()

router.post("/register", AuthController.register as any)
router.post("/login", AuthController.login as any)
router.post("/logout", AuthController.logout as any)

export default router
