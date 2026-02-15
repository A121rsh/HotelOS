const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const config = await prisma.systemConfig.findUnique({
            where: { id: 'singleton' }
        });

        if (!config) {
            console.log('SystemConfig not found, creating default...');
            await prisma.systemConfig.create({
                data: {
                    id: 'singleton',
                    siteName: 'HotelOS',
                    isMaintenanceMode: false,
                }
            });
            console.log('SystemConfig created successfully.');
        } else {
            console.log('SystemConfig exists:', config);
        }
    } catch (error) {
        console.error('Error during SystemConfig check:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
