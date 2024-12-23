import jwt from "jsonwebtoken"
import { NextFunction, type Request, type Response } from "express"
import { User } from "../types/user-type"

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (authHeader == null) {
    return res.status(401).json({ message: "Unauthorized." })
  }
  const token = authHeader.split(" ")[1]

  try {
    jwt.verify(
      token,
      process.env.SECRET_TOKEN as string,
      async (error: unknown, decoded: unknown) => {
        console.log("error", error)
        if (error != null) {
          return res.status(403).json({ message: "Forbidden" })
        }
        const decodedToken = decoded as User
        req.user = decodedToken
        next()
      }
    )
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." })
  }
}
