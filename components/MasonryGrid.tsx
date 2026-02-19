import { Product } from '@prisma/client';
import { ProductCard } from './ProductCard';

interface MasonryGridProps {
    products: Product[];
}

export function MasonryGrid({ products }: MasonryGridProps) {
    if (!products || products.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500">
                No hay ilustraciones disponibles en este momento.
            </div>
        );
    }

    return (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 p-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
