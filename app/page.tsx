import { MasonryGrid } from "@/components/MasonryGrid";
import HeroSection from "@/components/HeroSection";
import prisma from "@/lib/prisma";
import Link from 'next/link';
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function Home(props: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const categoryId = searchParams.category ? parseInt(searchParams.category) : undefined;

  if (searchParams.category && isNaN(categoryId as number)) {
    return notFound();
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    const where = categoryId ? { categoryId } : {};

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Find current category name for display
    const currentCategory = categoryId ? categories.find(c => c.id === categoryId) : null;

    return (
      <div className="min-h-screen bg-white">
        <HeroSection />

        <div id="gallery" className="container mx-auto px-4 pb-24 pt-12">

          {/* Category Filter */}
          <div className="mb-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              scroll={false}
              className={`px-4 py-2 rounded-full text-sm transition-all border ${!categoryId ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
            >
              Todas
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.id}`}
                scroll={false}
                className={`px-4 py-2 rounded-full text-sm transition-all border ${categoryId === cat.id ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif mb-4">
              {currentCategory ? `Colección: ${currentCategory.name}` : 'Últimas Creaciones'}
            </h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto opacity-60"></div>
          </div>

          {products.length > 0 ? (
            <MasonryGrid products={products} />
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No hay obras en esta categoría todavía.</p>
              <Link href="/" className="text-brand-blue hover:underline mt-2 inline-block">Ver todas las obras</Link>
            </div>
          )}

        </div>
      </div>
    );
  } catch (error) {
    console.error('[Home] Critical Error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error del Servidor</h1>
          <pre className="text-sm bg-gray-100 p-4 rounded text-left overflow-auto max-w-lg">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
}
