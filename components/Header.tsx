import Link from "next/link";
import CartIcon from "@/components/cart/CartIcon";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-12 h-8 md:w-16 md:h-10">
                        <img
                            src="/tienda/artull-logo.png"
                            alt="Art-ULL Logo"
                            className="object-contain w-full h-full"
                        />
                    </div>
                    <span className="text-xl font-serif font-bold tracking-tight text-[#4A6FA5] hidden sm:block">Art-ULL</span>
                </Link>

                <nav className="flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                        Galería
                    </Link>

                    <CartIcon />
                </nav>
            </div>
        </header>
    );
}
