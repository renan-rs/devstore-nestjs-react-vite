import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { api } from '../services/api';

export function Cart() {
    const { cart, removeFromCart, clearCart, totalPrice } = useCartStore();
    const [checkingOut, setCheckingOut] = useState(false);
    const navigate = useNavigate();

    const userStr = localStorage.getItem('@DevStore:user');
    const user = userStr ? JSON.parse(userStr) : null;

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
            navigate('/');
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Erro ao finalizar o pedido.');
        } finally {
            setCheckingOut(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Seu Carrinho 🛒</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                    >
                        Continuar Comprando
                    </button>
                </header>

                {cart.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                        <p className="text-gray-500 text-lg mb-4">Seu carrinho está vazio.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Explorar Produtos
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <div className="divide-y divide-gray-200 mb-6">
                            {cart.map((item) => (
                                <div key={item.product.id} className="py-4 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                                        <div>
                                            <h3 className="font-bold text-gray-800">{item.product.name}</h3>
                                            <p className="text-sm text-gray-500">R$ {item.product.price.toFixed(2)} cada</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <span className="font-semibold text-gray-700">Qtd: {item.quantity}</span>
                                        <span className="font-bold text-gray-900">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                                        <button
                                            onClick={() => removeFromCart(item.product.id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
                            <div>
                                <span className="text-gray-500 text-sm">Total Geral:</span>
                                <p className="text-3xl font-black text-gray-900">R$ {totalPrice.toFixed(2)}</p>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={checkingOut}
                                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {checkingOut ? 'Processando...' : 'Finalizar Pedido'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}