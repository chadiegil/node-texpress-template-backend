import { type Request, type Response } from "express"

export const getPost = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "Post!" })
}
