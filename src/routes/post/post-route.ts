import express from "express"
import * as PostController from "../../controller/post/post-controller"

import upload from "../../utils/multer-config"

const router = express.Router()

router.get("/", PostController.index)
router.get("/post/:id", PostController.getSinglePost)
router.get("/post", PostController.getPost)
router.post(
  "/create",
  upload.single("attachment"),
  PostController.createPost as any
)
router.put(
  "/update/:id",
  upload.single("attachment"),
  PostController.updatePost
)
router.delete("/delete/:id", PostController.deletePost)

export default router
