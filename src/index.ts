import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { User } from "./types/user-type"

// routes import
import homeRoute from "./routes/home-route"
import authRoute from "./routes/auth/auth-route"
import { authMiddleware } from "./middleware/auth-middleware"
import postRoute from "./routes/post/post-route"
import scheduleCleanupTasks from "./utils/schedule-jobs/cleanuptask"

import path from "path"

dotenv.config()

const app = express()

const PORT = process.env.PORT ?? 5000

app.use(cookieParser())
app.use(bodyParser.json())

declare global {
  namespace Express {
    interface Request {
      user: User
    }
  }
}

// routes
app.use("/", homeRoute)
app.use("/auth", authRoute)
app.use("/post", postRoute)
app.use("/private", authMiddleware as any, postRoute)

// no authmiddleware
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

app.use(
  "/uploads",
  authMiddleware as any,
  express.static(path.join(__dirname, "../uploads"))
)

// new update v.3
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  scheduleCleanupTasks()
})
