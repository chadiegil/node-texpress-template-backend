import { Prisma } from "@prisma/client"
import prisma from "../../utils/prisma"

export const getPost = async () => {
  return await prisma.post.findMany()
}

export const create = async (
  userId: number,
  description: string,
  attachment: string
) => {
  return await prisma.post.create({
    data: {
      userId,
      description,
      attachment,
      created_at: new Date(),
      updated_at: new Date(),
    },
  })
}

export const countAllByFilters = async (where: Prisma.PostWhereInput) => {
  const count = await prisma.post.count({ where })
  return count
}

export const paginateByFilters = async (
  skip: number,
  take: number,
  where: Prisma.PostWhereInput
) => {
  return await prisma.post.findMany({
    skip,
    take,
    where,
    orderBy: {
      id: "desc",
    },
  })
}

export const updateById = async (
  userId: number,
  postId: number,
  description: string,
  attachment: string
) => {
  return await prisma.post.update({
    where: {
      userId,
      id: postId,
    },
    data: {
      userId,
      description,
      attachment,
      updated_at: new Date(),
      //   created_at: new Date(),
    },
  })
}

export const deleteById = async (userId: number, postId: number) => {
  return await prisma.post.delete({
    where: {
      userId,
      id: postId,
    },
  })
}

export const getById = async (id: number) => {
  return await prisma.post.findFirst({
    where: {
      id,
    },
  })
}
