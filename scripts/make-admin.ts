
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const email = '121zub@gmail.com'
    await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
    })
    console.log(`✅ User ${email} role updated to ADMIN`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
