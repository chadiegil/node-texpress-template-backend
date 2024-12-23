import { type Request, type Response } from "express"
import bcrypt from "bcrypt"
import prisma from "../../utils/prisma"
import jwt from "jsonwebtoken"
import ms from "ms"
import { User } from "../../types/user-type"
import { generateToken } from "../../utils/generate-token"

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (user == null) {
      return res.status(404).json({ message: "User not found" })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials." })
    }

    const access_token = generateToken(
      user,
      process.env.ACCESS_TOKEN_TIME as string
    )

    const refresh_token = generateToken(
      user,
      process.env.REFRESH_TOKEN_TIME as string
    )

    res.cookie("authToken", refresh_token, {
      httpOnly: true, // accessible by web server only
      maxAge: ms("1h"),
      secure: true,
      sameSite: "none", // Set to 'none' if using cross-site requests
    })

    const decodedToken = jwt.decode(access_token) as jwt.JwtPayload
    if (!decodedToken || !decodedToken.id) {
      res.status(400).json({ message: "Invalid token." })
    }

    res.status(200).json({
      message: "Login successful",
      access_token,
      user: { ...user, password: undefined },
    })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." })
  }
}

export const register = async (req: Request, res: Response) => {
  const { email, password, first_name, last_name, role, address, contact_no } =
    req.body

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) res.status(400).json({ message: "User already exist." })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        first_name,
        last_name,
        password: hashedPassword,
        role,
        address,
        contact_no,
        created_at: new Date(),
        updated_at: new Date(),
      },
    })
    res.status(201).json({
      message: "User created successfully.",
      user: { ...newUser, password: undefined },
    })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("authToken", "none", {
      httpOnly: true,
      maxAge: 0,
      secure: true,
      sameSite: "none",
    })

    res.status(200).json({ message: "Logout Successful." })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." })
  }
}

// refresh token

export const refreshToken = async (req: Request, res: Response) => {
  const cookie = req.cookies
  if (cookie.authToken === undefined) {
    return res.status(401).json({ message: "Unauthorized." })
  }
  jwt.verify(
    cookie.authToken,
    process.env.SECRET_TOKEN as string,
    async (error: unknown, decoded: unknown) => {
      if (error != null) return res.status(403).json({ message: "Forbidden." })
      const decodedToken = decoded as User
      const user = await prisma.user.findFirst({
        where: {
          email: decodedToken.email,
        },
      })

      if (user == null) {
        return res.status(400).json({ message: "User not found." })
      }
      const access_token = generateToken(
        user,
        process.env.ACCESS_TOKEN_TIME as string
      )
      res.json({
        access_token,
        user: {
          id: user?.id,
          email: user?.email,
          first_name: user?.first_name,
          last_name: user?.last_name,
          address: user?.address,
          contact_no: user?.contact_no,
          role: user?.role,
        },
      })
    }
  )
}
