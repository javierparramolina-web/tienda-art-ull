export function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white">
            <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Art-ULL. Todos los derechos reservados.
                </p>
                <div className="flex gap-4 items-center">
                    <a href="/admin" className="text-xs text-gray-300 hover:text-brand-blue transition-colors">
                        Admin
                    </a>
                </div>
            </div>
        </footer>
    );
}
