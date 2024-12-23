import { User } from "../types/user-type"
import jwt from "jsonwebtoken"

export const generateToken = (user: User, expiresIn: string) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.SECRET_TOKEN as string,
    { expiresIn: expiresIn as string }
  )
}
