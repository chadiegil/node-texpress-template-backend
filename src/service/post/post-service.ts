import { type Request, type Response } from "express"

import * as PostRepository from "../../repository/post/post-repository"
import CustomError from "../../utils/custom-error"

export const getAllByFilters = async (description: string, page: string) => {
  const itemsPerPage = 10
  const parsePage = parseInt(page)
  const currentPage = isNaN(parsePage) || parsePage < 0 ? 1 : parsePage

  const where = {
    description: {
      contains: description,
    },
  }

  const postPaginated = await PostRepository.paginateByFilters(
    (currentPage - 1) * itemsPerPage,
    itemsPerPage,
    where
  )

  const totalItems = await PostRepository.countAllByFilters(where)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return {
    data: postPaginated,
    pageInfo: {
      hasPreviosPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
      currentPage,
      totalPages,
      totalItems,
    },
  }
}

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
