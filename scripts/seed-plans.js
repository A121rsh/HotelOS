const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Clearing existing data...');
    // Clear subscriptions first due to FK constraints
    await prisma.subscription.deleteMany({});
    await prisma.subscriptionInvoice.deleteMany({});
    await prisma.subscriptionPlan.deleteMany({});

    console.log('Creating new subscription plans...');

    const plans = [
        {
            name: 'Trial Node',
            slug: 'trial',
            description: '7-day executive trial for basic operational evaluation.',
            price: 0,
            currency: 'INR',
            maxRooms: 5,
            maxBookings: 20,
            features: ['7 Days Access', 'Up to 5 Rooms', 'Basic Analytics', 'Standard Support'],
        },
        {
            name: 'Business Node',
            slug: 'business',
            description: 'The standard protocol for established property headquarters.',
            price: 999,
            currency: 'INR',
            maxRooms: 20,
            maxBookings: 200,
            features: ['Monthly Access', 'Up to 20 Rooms', 'Advanced FinOps', 'Priority Sync', 'Email Support'],
        },
        {
            name: 'Enterprise Core',
            slug: 'enterprise',
            description: 'Custom global solutions for hotel chains and franchises.',
            price: 4999,
            currency: 'INR',
            maxRooms: 100,
            maxBookings: -1, // Unlimited
            features: ['Unlimited Bookings', 'Channel Manager', 'Alpha Feature Access', '24/7 VIP Support', 'Dedicated Account Node'],
        }
    ];

    for (const plan of plans) {
        const createdPlan = await prisma.subscriptionPlan.create({
            data: plan,
        });
        console.log(`Created plan: ${createdPlan.name} (${createdPlan.id})`);
    }

    console.log('Seed completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
