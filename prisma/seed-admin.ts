
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@hotelos.com'
    const password = await hash('admin123', 10)

    const user = await prisma.user.upsert({
        where: { email },
        update: { role: 'ADMIN' },
        create: {
            email,
            password,
            name: 'Super Admin',
            role: 'ADMIN',
        },
    })

    console.log(`✅ Admin user created: ${user.email}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
