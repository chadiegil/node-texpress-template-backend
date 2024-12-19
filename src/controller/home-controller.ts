import { type Request, type Response } from "express"

export default async function getHome(req: Request, res: Response) {
  return res.status(200).json({ message: "Welcome to home!" })
}
