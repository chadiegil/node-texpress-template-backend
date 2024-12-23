import prisma from "../prisma"
import schedule from "node-schedule"

const scheduleCleanupTasks = () => {
  schedule.scheduleJob(
    process.env.SCHEDULE_CLEAN_UP_EVERY_DAY as string,
    async () => {
      try {
        const now = new Date()
        const localNow = new Date(
          now.getTime() - now.getTimezoneOffset() * 60000
        )
        const deletedTokens = await prisma.blacklistedToken.deleteMany({
          where: {
            expires_at: {
              lt: localNow,
            },
          },
        })
        console.log(`Deleted ${deletedTokens.count} expired tokens (daily).`)
      } catch (error) {
        console.error("Error during daily cleanup task:", error)
      }
    }
  )
}

scheduleCleanupTasks()

export default scheduleCleanupTasks
