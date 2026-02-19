import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetails from './ProductDetails';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Check, ShoppingBag } from 'lucide-react';

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
        notFound();
    }

    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { category: true },
    });

    if (!product) {
        notFound();
    }

    return <ProductDetails product={product} />;
}
