import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { api } from '../services/api';

export function Checkout() {
    const { cart, totalPrice, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const navigate = useNavigate();

    const userStr = localStorage.getItem('@DevStore:user');
    const user = userStr ? JSON.parse(userStr) : null;

    async function handleFinalizeOrder(e: React.SyntheticEvent) {
        e.preventDefault();
        if (!user) {
            alert('Você precisa estar logado.');
            navigate('/login');
            return;
        }

        if (cart.length === 0) {
            alert('Seu carrinho está vazio.');
            navigate('/');
            return;
        }

        setLoading(true);
        try {
            const orderPayload = {
                items: cart.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
                // Caso queira expandir o backend futuramente para salvar endereço/pagamento, já estarão aqui:
                address,
                paymentMethod,
            };

            await api.post('/orders', orderPayload);
            alert('Pedido realizado com sucesso! 🎉');
            clearCart();
            navigate('/orders');
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Erro ao processar o pedido.');
        } finally {
            setLoading(false);
        }
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <p className="text-gray-600 mb-4">Seu carrinho está vazio para o checkout.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Voltar para a Loja
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Finalizar Compra (Checkout) 💳</h1>
                    <p className="text-sm text-gray-500">Revise seus itens e informe os dados de entrega</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Formulário de Entrega e Pagamento */}
                    <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <form onSubmit={handleFinalizeOrder} className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Endereço de Entrega</h2>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço completo</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Rua Exemplo, 123 - Bairro, Cidade - Estado"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Forma de Pagamento</h2>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="credit_card"
                                            checked={paymentMethod === 'credit_card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span className="font-medium text-gray-700">Cartão de Crédito</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="pix"
                                            checked={paymentMethod === 'pix'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span className="font-medium text-gray-700">PIX (Aprovação imediata)</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Processando Pedido...' : 'Confirmar e Pagar'}
                            </button>
                        </form>
                    </div>

                    {/* Resumo do Pedido */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-fit">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo</h2>
                        <div className="divide-y divide-gray-200 mb-4 max-h-60 overflow-y-auto">
                            {cart.map((item) => (
                                <div key={item.product.id} className="py-2 flex justify-between text-sm">
                                    <span className="text-gray-600">{item.quantity}x {item.product.name}</span>
                                    <span className="font-semibold text-gray-800">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 flex justify-between items-center mb-6">
                            <span className="font-bold text-gray-700">Total:</span>
                            <span className="text-2xl font-black text-gray-900">R$ {totalPrice.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={() => navigate('/cart')}
                            className="w-full py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition text-center"
                        >
                            Editar Carrinho
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}