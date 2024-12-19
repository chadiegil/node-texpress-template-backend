import express from "express"
import getHome from "../controller/home-controller"

const router = express.Router()

router.get("/", getHome as any)

export default router
