import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, images: true }
    });

    console.log('Latest 5 products:');
    products.forEach(p => {
        console.log(`ID: ${p.id}, Title: ${p.title}`);
        console.log(`Images (raw): ${p.images}`);
        try {
            console.log(`Images (parsed):`, JSON.parse(p.images));
        } catch (e) {
            console.log('Error parsing images JSON');
        }
        console.log('---');
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
