import express from "express"
import * as PostController from "../../controller/post/post-controller"

const router = express.Router()

router.get("/", PostController.index)
router.get("/post", PostController.getPost)
router.post("/create", PostController.createPost)
router.put("/update/:id", PostController.updatePost)
router.delete("/delete/:id", PostController.deletePost)

export default router
