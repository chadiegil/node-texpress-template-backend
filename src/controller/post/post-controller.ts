import { type Request, type Response } from "express"
import * as PostService from "../../service/post/post-service"
import CustomError from "../../utils/custom-error"

export const getPost = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "Post!" })
}

export const index = async (req: Request, res: Response) => {
  try {
    const posts = await PostService.getPost()
    return res.json(posts)
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." })
  }
}

export const createPost = async (req: Request, res: Response) => {
  try {
    const { description, attachment } = req.body
    const userId = req.user.id
    if (!description) {
      return res.status(400).json({ message: "Description is required." })
    }
    const newPost = await PostService.create(userId, description, attachment)
    return res.json(newPost)
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." })
  }
}

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { description, attachment } = req.body
    const postId = req.params.id

    const userId = req.user.id
    const updatePost = await PostService.updateById(
      userId,
      parseInt(postId),
      description,
      attachment
    )
    return res.json(updatePost)
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." })
  }
}

export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id
    const postId = parseInt(req.params.id)
    await PostService.deleteById(userId, postId)
    return res.json({ message: `Post deleted successfully id ${postId}` })
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(500).json({ message: "Something went wrong." })
  }
}
