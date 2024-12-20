import express from "express"
import {
  getPost,
  index,
  createPost,
  updatePost,
  deletePost,
} from "../../controller/post/post-controller"

const router = express.Router()

router.get("/", index as any)
router.get("/post", getPost as any)
router.post("/create", createPost as any)
router.put("/update/:id", updatePost as any)
router.delete("/delete/:id", deletePost as any)

export default router
