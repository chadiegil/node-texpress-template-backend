import { type Request, type Response } from "express"
import bcrypt from "bcrypt"
import prisma from "../../utils/prisma"
import jwt from "jsonwebtoken"

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials." })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_TOKEN as string,
      { expiresIn: "1h" }
    )

    res.cookie("authToken", {
      httpOnly: true, // accessible by web server only
      sameSite: "none", // Set to 'none' if using cross-site requests
    })

    return res.status(200).json({
      message: "Login successful",
      token,
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

    if (existingUser)
      return res.status(400).json({ message: "User already exist." })

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
    return res.status(201).json({
      message: "User created successfully.",
      user: { ...newUser, password: undefined },
    })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader == null) {
      return res.status(401).json({ message: "Unauthorized." })
    }
    const token = authHeader.split(" ")[1]

    try {
      const decodedToken = jwt.decode(token) as jwt.JwtPayload
      if (!decodedToken || !decodedToken.id) {
        return res.status(400).json({ message: "Invalid token." })
      }
      await prisma.blacklistedToken.create({
        data: {
          token,
          expires_at: new Date(decodedToken.exp! * 1000),
          userId: decodedToken.id,
        },
      })
      return res.status(200).json({ message: "Logout Successful." })
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." })
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." })
  }
}
