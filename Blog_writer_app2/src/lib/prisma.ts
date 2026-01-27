import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

// Prisma Postgresの接続制限に対応した設定
export const prisma = global.prisma || new PrismaClient({
  log: ['error', 'warn'],
  // 接続プールを無効にして、毎回新しい接続を使う
  // これはPrisma Postgresのsingle_use_connections=trueに対応するため
})

if (process.env.NODE_ENV !== "production") global.prisma = prisma

// プロセス終了時に接続を閉じる
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}
