'use client';

import { signOut } from 'next-auth/react';
import { Settings } from 'lucide-react';

export function LogoutButton() {
    return (
        <button
            onClick={() => {
                // Simple, brutal, effective: hard navigation to signout endpoint
                window.location.href = '/tienda/api/auth/signout';
            }}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left mt-auto"
        >
            <Settings className="w-5 h-5 rotate-180" />
            Cerrar Sesión
        </button>
    );
}
