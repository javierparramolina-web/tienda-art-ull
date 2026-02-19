const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const username = 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin exists
    const existingUser = await prisma.user.findUnique({
        where: { username },
    });

    if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
        console.log(`User '${username}' created with password: '${password}'`);
    } else {
        console.log(`User '${username}' already exists.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
