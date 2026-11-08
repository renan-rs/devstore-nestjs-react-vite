import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    stock: number;
}

export function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [checkingOut, setCheckingOut] = useState(false);

    const {cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice} = useCart();
    const navigate = useNavigate();

    const userStr = localStorage.getItem('@DevStore:user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCheckout() {
        if (!user) {
            alert('Você precisa estar logado para finalizar o pedido.');
            navigate('/login');
            return;
        }

        if (cart.length === 0) return;

        setCheckingOut(true);
        try {
            const orderPayload = {
                items: cart.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
            };

            await api.post('/orders', orderPayload);
            alert('Pedido realizado com sucesso! 🎉');
            clearCart();
            setIsCartOpen(false);
            fetchProducts(); // Atualiza estoque na vitrine
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Erro ao finalizar o pedido.');
        } finally {
            setCheckingOut(false);
        }
    }
    function handleLogout() {
        localStorage.removeItem('@DevStore:token');
        localStorage.removeItem('@DevStore:user');
        window.location.reload();
    }
    
    return (
        <div className="min-h-screen bg-gray-50 p-8 pb-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <h1 className="text-2xl font-extrabold text-gray-900">DevStore 🚀</h1>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">Olá, {user.name}</span>
                                {user.role === 'ADMIN' && (
                                    <button
                                        onClick={() => navigate('/admin/products')}
                                        className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-200 transition"
                                    >
                                        Painel Admin
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
                                >
                                    Sair
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Entrar
                            </button>
                        )}

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
                        >
                            🛒 Carrinho
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                {/* Vitrine */}
                {loading ? (
                    <p className="text-center text-gray-500 mt-12">Carregando produtos...</p>
                ) : products.length === 0 ? (
                    <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-gray-600 text-lg">Nenhum produto cadastrado no momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col">
                                <img src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover" />
                                <div className="p-5 flex flex-col flex-1">
                                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">{product.category}</span>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 flex-1">{product.description}</p>
                                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                        <div>
                                            <span className="text-2xl font-black text-gray-900">
                                                R$ {product.price.toFixed(2)}
                                            </span>
                                            <p className="text-xs text-gray-500">Estoque: {product.stock}</p>
                                        </div>
                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock === 0}
                                            className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                                        >
                                            {product.stock > 0 ? 'Adicionar' : 'Esgotado'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal / Drawer do Carrinho */}
                {isCartOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
                        <div className="bg-white w-full max-w-md h-full p-6 flex flex-col shadow-2xl">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h2 className="text-xl font-bold text-gray-900">Seu Carrinho</h2>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4">
                                {cart.length === 0 ? (
                                    <p className="text-center text-gray-500 mt-12">Seu carrinho está vazio.</p>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.product.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{item.product.name}</h4>
                                                <p className="text-sm text-gray-500">
                                                    {item.quantity}x R$ {item.product.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.product.id)}
                                                className="text-red-500 text-sm hover:underline"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="border-t pt-4 mt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-bold text-gray-700">Total:</span>
                                        <span className="text-2xl font-black text-gray-900">R$ {totalPrice.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        disabled={checkingOut}
                                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {checkingOut ? 'Processando...' : 'Finalizar Pedido'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}