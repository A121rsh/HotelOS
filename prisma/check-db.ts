
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- Database Check ---')
    const userCount = await prisma.user.count()
    const planCount = await prisma.subscriptionPlan.count()
    const hotelCount = await prisma.hotel.count()

    console.log(`Users: ${userCount}`)
    console.log(`Plans: ${planCount}`)
    console.log(`Hotels: ${hotelCount}`)

    if (planCount === 0) {
        console.error('❌ Subscriptions Plans Missing! Run `npx tsx prisma/seed.ts`')
    } else {
        const plans = await prisma.subscriptionPlan.findMany()
        console.log('--- Available Plans ---')
        plans.forEach(p => console.log(`- ${p.name} ($${p.price})`))
    }

    if (userCount === 0) {
        console.error('❌ No Users Found! Run `npx tsx prisma/seed-admin.ts`')
    } else {
        const users = await prisma.user.findMany()
        console.log('--- Available Users ---')
        users.forEach(u => console.log(`- ${u.email} (${u.role})`))
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
