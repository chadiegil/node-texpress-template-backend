import express from "express"
import { getPost } from "../../controller/post/post-controller"

const router = express.Router()

router.get("/post", getPost as any)

export default router
