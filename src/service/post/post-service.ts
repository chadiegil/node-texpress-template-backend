import { type Request, type Response } from "express"

import * as PostRepository from "../../repository/post/post-repository"
import CustomError from "../../utils/custom-error"

export const getPost = async () => {
  return await PostRepository.getPost()
}

export const create = async (
  userId: number,
  description: string,
  attachment: string
) => {
  return await PostRepository.create(userId, description, attachment)
}

export const updateById = async (
  userId: number,
  postId: number,
  description: string,
  attachment: string
) => {
  return await PostRepository.updateById(
    userId,
    postId,
    description,
    attachment
  )
}

export const deleteById = async (userId: number, postId: number) => {
  const getPostToDelete = await PostRepository.getById(postId)
  if (!getPostToDelete) {
    throw new CustomError("Post not found.", 404)
  }
  return await PostRepository.deleteById(userId, postId)
}

export const getById = async (id: number) => {
  const post = await PostRepository.getById(id)
  if (!post) {
    throw new CustomError("Post not found.", 404)
  }
  return post
}
