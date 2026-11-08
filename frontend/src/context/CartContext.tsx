import { createContext, useContext, useState, type ReactNode } from "react";

export interface Product{
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
}

export interface CartItem{
    product: Product;
    quantity: number;
}

interface CartContextType{
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({children}: {children: ReactNode}){
    const [cart, setCart] = useState<CartItem[]>([]);

    function addToCart(product: Product){
        setCart((state) => {
            const itemExists = state.find((item) => item.product.id === product.id);

            if(itemExists){
                return state.map((item) => 
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1}
                        : item
                );
            }

            return [...state, {product, quantity: 1}];
        });
    }

    function removeFromCart(productId: string){
        setCart((state) => state.filter((item) => item.product.id !== productId));
    }

    function clearCart(){
        setCart([]);
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice}}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart(){
    return useContext(CartContext);
}