import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // Unique ID (productId + format)
    productId: number;
    title: string;
    price: number;
    image: string;
    format: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;

    // Computed (handled via getters/hooks in component usually, but we can add helpers)
    getTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (newItem) => {
                const id = `${newItem.productId}-${newItem.format}`;
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === id);
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === id ? { ...i, quantity: i.quantity + 1 } : i
                            ),
                            isOpen: true, // Open cart when adding
                        };
                    }
                    return {
                        items: [...state.items, { ...newItem, id, quantity: 1 }],
                        isOpen: true,
                    };
                });
            },

            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                })),

            updateQuantity: (id, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        return { items: state.items.filter((i) => i.id !== id) };
                    }
                    return {
                        items: state.items.map((i) =>
                            i.id === id ? { ...i, quantity } : i
                        ),
                    };
                }),

            clearCart: () => set({ items: [] }),

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            getTotal: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'art-ull-cart', // local storage key
            skipHydration: true, // We'll handle hydration manually to avoid hydration mismatch
        }
    )
);
