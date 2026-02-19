import Link from 'next/link';
import { Package, PlusCircle, Settings, Lock } from 'lucide-react';
import { LogoutButton } from '@/components/LogoutButton';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 min-h-screen bg-white border-r border-gray-200 hidden md:block">
                    <div className="p-6">
                        <h2 className="text-xl font-bold font-serif">Art-ULL Admin</h2>
                    </div>
                    <nav className="px-4 space-y-2">
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Package className="w-5 h-5" />
                            Productos
                        </Link>
                        <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Package className="w-5 h-5" />
                            Pedidos
                        </Link>
                        <Link href="/admin/new" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <PlusCircle className="w-5 h-5" />
                            Nuevo Producto
                        </Link>
                        <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Settings className="w-5 h-5" />
                            Categorías
                        </Link>
                        <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Lock className="w-5 h-5" />
                            Ajustes
                        </Link>
                        <LogoutButton />
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
