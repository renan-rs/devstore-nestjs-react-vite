import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, MapPin } from 'lucide-react';
import { useCartStore, selectTotalPrice } from '../store/useCartStore';
import { api, getErrorMessage } from '../services/api';
import { formatBRL, getStoredUser } from '../components/useUser';

export function Checkout() {
    const { cart, clearCart } = useCartStore();
    const totalPrice = useCartStore(selectTotalPrice);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const navigate = useNavigate();
    const user = getStoredUser();

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
        } catch (err) {
            console.error(err);
            alert(getErrorMessage(err, 'Erro ao processar o pedido.'));
        } finally {
            setLoading(false);
        }
    }

    if (cart.length === 0) {
        return (
            <div className="max-w-md mx-auto px-4 py-24 text-center">
                <p className="text-slate-600 mb-4">Seu carrinho está vazio para o checkout.</p>
                <Link to="/" className="inline-block px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition">Voltar para a loja</Link>
            </div>
        );
    }

    const methods = [
        { value: 'credit_card', label: 'Cartão de crédito', hint: 'Em até 3x sem juros', icon: CreditCard },
        { value: 'pix', label: 'PIX', hint: 'Aprovação imediata', icon: QrCode },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black text-slate-900">Finalizar compra</h1>
            <p className="text-sm text-slate-500 mb-6">Revise seus itens e informe os dados de entrega</p>

            <div className="grid lg:grid-cols-3 gap-6 items-start">
                <form onSubmit={handleFinalizeOrder} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-8">
                    <div>
                        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3"><MapPin size={18} className="text-brand-600" /> Endereço de entrega</h2>
                        <textarea
                            required
                            rows={3}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Rua Exemplo, 123 - Bairro, Cidade - Estado"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none"
                        />
                    </div>

                    <div>
                        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3"><CreditCard size={18} className="text-brand-600" /> Forma de pagamento</h2>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {methods.map(({ value, label, hint, icon: Icon }) => (
                                <label key={value} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${paymentMethod === value ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                                    <Icon size={22} className={paymentMethod === value ? 'text-brand-600' : 'text-slate-400'} />
                                    <span>
                                        <span className="block font-semibold text-slate-800">{label}</span>
                                        <span className="block text-xs text-slate-500">{hint}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition disabled:opacity-50">
                        {loading ? 'Processando pedido...' : 'Confirmar e pagar'}
                    </button>
                </form>

                <aside className="bg-white p-6 rounded-2xl border border-slate-200 lg:sticky lg:top-24">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Resumo</h2>
                    <div className="divide-y divide-slate-100 mb-4 max-h-64 overflow-y-auto">
                        {cart.map((item) => (
                            <div key={item.product.id} className="py-3 flex items-center gap-3 text-sm">
                                <img src={item.product.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                                <span className="flex-1 text-slate-600 line-clamp-2">{item.quantity}x {item.product.name}</span>
                                <span className="font-semibold text-slate-800">{formatBRL(item.product.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-200 pt-4 flex justify-between items-center mb-5">
                        <span className="font-bold text-slate-700">Total</span>
                        <span className="text-2xl font-black text-slate-900">{formatBRL(totalPrice)}</span>
                    </div>
                    <Link to="/cart" className="block w-full py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition text-center">Editar carrinho</Link>
                </aside>
            </div>
        </div>
    );
}
