import prisma from '@/lib/prisma';
import NewProductForm from './NewProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true } // Strict selection
    });

    return <NewProductForm categories={categories} />;
}
