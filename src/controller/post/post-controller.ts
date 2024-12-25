import fs from "fs"
import path from "path"
import { type Request, type Response } from "express"
import * as PostService from "../../service/post/post-service"
import CustomError from "../../utils/custom-error"
import { postSchema } from "../../utils/validation/post-schema"
import { ValidationError } from "yup"

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

export const getSinglePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id
    const post = await PostService.getById(parseInt(postId))
    res.json(post)
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message })
    }
    res.status(500).json({ message: "Something went wrong." })
  }
}

export const createPost = async (req: Request, res: Response) => {
  try {
    const { description } = req.body

    await postSchema.validate({
      description,
    })

    const userId = req.user.id

    let attachment = ""
    if (req.file) {
      attachment = req.file.filename
    }

    const newPost = await PostService.create(userId, description, attachment)
    res.json(newPost)
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message })
    }
    if (error instanceof CustomError) {
      return res.status(error.status).json({ message: error.message })
    }
    res.status(500).json({ message: "Something went wrong." })
  }
}

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { description } = req.body
    const postId = req.params.id
    const userId = req.user.id

    // Fetch the current post to get the attachment path
    const currentPost = await PostService.getById(parseInt(postId))

    if (!currentPost) {
      throw new CustomError("Post not found", 404)
    }

    if (req.file && currentPost.attachment) {
      const oldAttachmentPath = path.join(
        __dirname,
        "../../../uploads",
        currentPost.attachment
      )

      if (fs.existsSync(oldAttachmentPath)) {
        fs.unlinkSync(oldAttachmentPath)
      } else {
        throw new CustomError("Old attachment not found", 404)
      }
    }

    const updatedPost = await PostService.updateById(
      userId,
      parseInt(postId),
      description,
      req.file ? req.file.filename : currentPost.attachment // Update with the new file or keep the existing one
    )

    res.json(updatedPost)
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message })
    } else {
      console.log(error)
      res.status(500).json({ message: "Something went wrong." })
    }
  }
}
export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id
    const postId = parseInt(req.params.id)

    const post = await PostService.getById(postId)
    if (!post) {
      throw new CustomError("Post not found", 404)
    }

    if (post.attachment) {
      const attachmentPath = path.join(
        __dirname,
        "../../../uploads",
        post.attachment
      )

      if (fs.existsSync(attachmentPath)) {
        fs.unlinkSync(attachmentPath)
      } else {
        console.log(`Attachment not found: ${attachmentPath}`)
      }
    }
    await PostService.deleteById(userId, postId)
    res.json({ message: `Post deleted successfully, ID: ${postId}` })
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message })
    } else {
      console.log(error)
      res.status(500).json({ message: "Something went wrong." })
    }
  }
}
