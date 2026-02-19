import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany();

    for (const p of products) {
        let images: string[] = [];
        try {
            images = JSON.parse(p.images);
        } catch {
            continue;
        }

        const newImages = images.map(img => {
            if (img.startsWith('/uploads/') && !img.startsWith('/tienda/')) {
                return '/tienda' + img;
            }
            return img;
        });

        if (JSON.stringify(images) !== JSON.stringify(newImages)) {
            console.log(`Updating product ${p.id}: ${p.title}`);
            await prisma.product.update({
                where: { id: p.id },
                data: { images: JSON.stringify(newImages) }
            });
        }
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
