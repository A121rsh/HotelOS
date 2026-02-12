import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting Database Seeding Sequence...')

    // 1. SEED SUBSCRIPTION PLANS
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
            price: 999,
            maxRooms: 20,
            maxBookings: 500,
            features: ['20 Rooms Limit', '500 Bookings/Month', 'Analytics', 'Priority Support', 'Custom Branding'],
        },
        {
            name: 'Premium',
            slug: 'premium',
            description: 'Unlimited power for established hotels.',
            price: 2499,
            maxRooms: 100,
            maxBookings: -1,
            features: ['Unlimited Rooms', 'Unlimited Bookings', 'Advanced Analytics', '24/7 Support', 'Dedicated Manager', 'API Access'],
        },
    ]

    console.log('📦 Seeding Subscription Plans...')
    for (const plan of plans) {
        await prisma.subscriptionPlan.upsert({
            where: { slug: plan.slug },
            update: plan,
            create: plan,
        })
    }
    console.log('✅ Subscription Plans initialized.')

    // 2. SEED SUPER ADMIN
    console.log('👤 Seeding Super Admin Authority...')
    const adminEmail = 'admin@hotelos.com'
    const adminPassword = await hash('admin123', 10)

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: { role: 'ADMIN' },
        create: {
            email: adminEmail,
            password: adminPassword,
            name: 'Super Admin',
            role: 'ADMIN',
        },
    })
    console.log(`✅ Super Admin created: ${adminEmail}`)

    console.log('🎉 Database Restoration Complete.')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
