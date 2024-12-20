import { type Request, type Response } from "express"
import * as PostService from "../../service/post/post-service"
import CustomError from "../../utils/custom-error"

export const getPost = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Post!" })
}

export const index = async (req: Request, res: Response) => {
  try {
    const posts = await PostService.getPost()
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." })
  }
}

export const createPost = async (req: Request, res: Response) => {
  try {
    const { description, attachment } = req.body
    const userId = req.user.id
    if (!description) {
      res.status(400).json({ message: "Description is required." })
    }
    const newPost = await PostService.create(userId, description, attachment)
    res.json(newPost)
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." })
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
    res.json(updatePost)
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." })
  }
}

export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id
    const postId = parseInt(req.params.id)
    await PostService.deleteById(userId, postId)
    res.json({ message: `Post deleted successfully id ${postId}` })
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message })
    }
    res.status(500).json({ message: "Something went wrong." })
  }
}
