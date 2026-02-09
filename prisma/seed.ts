
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding Subscription Plans...')

    const plans = [
        {
            name: 'Free',
            slug: 'free',
            description: 'Perfect for small hotels starting out.',
            price: 0,
            maxRooms: 5,
            maxBookings: 50,
            features: ['Basic Dashboard', '5 Rooms Limit', '50 Bookings/Month', 'Email Support'],
        },
        {
            name: 'Basic',
            slug: 'basic',
            description: 'For growing hotels needing more capacity.',
            price: 999, // ₹999/month
            maxRooms: 20,
            maxBookings: 500,
            features: ['20 Rooms Limit', '500 Bookings/Month', 'Analytics', 'Priority Support', 'Custom Branding'],
        },
        {
            name: 'Premium',
            slug: 'premium',
            description: 'Unlimited power for established hotels.',
            price: 2499, // ₹2499/month
            maxRooms: 100,
            maxBookings: -1, // Unlimited
            features: ['Unlimited Rooms', 'Unlimited Bookings', 'Advanced Analytics', '24/7 Support', 'Dedicated Manager', 'API Access'],
        },
    ]

    for (const plan of plans) {
        const existingPlan = await prisma.subscriptionPlan.findUnique({
            where: { slug: plan.slug },
        })

        if (!existingPlan) {
            await prisma.subscriptionPlan.create({
                data: plan,
            })
            console.log(`✅ Created plan: ${plan.name}`)
        } else {
            console.log(`ℹ️ plan already exists: ${plan.name}`)
        }
    }

    console.log('🎉 Seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
