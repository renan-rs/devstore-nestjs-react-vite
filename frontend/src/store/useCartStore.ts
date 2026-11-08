import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    stock: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            addToCart: (product: Product) => {
                const currentCart = get().cart;
                const itemExists = currentCart.find((item) => item.product.id === product.id);

                if (itemExists) {
                    const updatedCart = currentCart.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                    set({ cart: updatedCart });
                } else {
                    set({ cart: [...currentCart, { product, quantity: 1 }] });
                }
            },
            removeFromCart: (productId: string) => {
                set({ cart: get().cart.filter((item) => item.product.id !== productId) });
            },
            clearCart: () => set({ cart: [] }),
            get totalItems() {
                return get().cart.reduce((sum, item) => sum + item.quantity, 0);
            },
            get totalPrice() {
                return get().cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
            },
        }),
        {
            name: '@DevStore:cart-storage',
        }
    )
);