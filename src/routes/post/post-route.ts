import express from "express"
import * as PostController from "../../controller/post/post-controller"

import upload from "../../utils/multer-config"
import { adminMiddleware } from "../../middleware/admin-middleware"
import { authMiddleware } from "../../middleware/auth-middleware"

const router = express.Router()

router.get("/", PostController.index)
router.get("/post/:id", PostController.getSinglePost)
router.get("/post", PostController.getPost)
router.post(
  "/create",
  // adminMiddleware as any,
  authMiddleware as any,
  upload.single("attachment"),
  PostController.createPost as any
)
router.put(
  "/update/:id",
  authMiddleware as any,
  upload.single("attachment"),
  PostController.updatePost
)
router.delete("/delete/:id", authMiddleware as any, PostController.deletePost)

export default router
