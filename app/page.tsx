import { MasonryGrid } from "@/components/MasonryGrid";
import HeroSection from "@/components/HeroSection";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic'; // For SQLite in dev to reflect changes

export default async function Home() {
  console.log('[Home] Starting render...');
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log(`[Home] Fetched ${products.length} products`);

    return (
      <div className="min-h-screen bg-white">
        <HeroSection />

        <div id="gallery" className="container mx-auto px-4 pb-24 pt-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif mb-4">Últimas Creaciones</h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto opacity-60"></div>
          </div>
          <MasonryGrid products={products} />
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
