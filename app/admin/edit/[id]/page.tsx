import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        return notFound();
    }

    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        return notFound();
    }

    const serializedProduct = {
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        price: product.price, // Ensure price is number not Decimal if schema changed, but schema says Float so it's fine.
    };



    return (
        <div className="container mx-auto max-w-4xl">
            <EditProductForm product={serializedProduct} />
        </div>
    );
}
