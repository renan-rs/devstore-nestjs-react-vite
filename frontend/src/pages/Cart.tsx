import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore, selectTotalPrice } from '../store/useCartStore';
import { formatBRL } from '../components/useUser';

export function Cart() {
    const { cart, removeFromCart, clearCart } = useCartStore();
    const totalPrice = useCartStore(selectTotalPrice);
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-end justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Meu carrinho</h1>
                    <p className="text-sm text-slate-500">{cart.length} {cart.length === 1 ? 'item' : 'itens'}</p>
                </div>
                {cart.length > 0 && (
                    <button onClick={clearCart} className="text-sm text-rose-500 hover:underline">Esvaziar carrinho</button>
                )}
            </div>

            {cart.length === 0 ? (
                <div className="bg-white p-14 rounded-3xl border border-dashed border-slate-300 text-center">
                    <span className="mx-auto w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4"><ShoppingBag size={30} /></span>
                    <p className="text-slate-700 text-lg font-semibold">Seu carrinho está vazio</p>
                    <p className="text-sm text-slate-400 mb-6">Explore a loja e adicione produtos.</p>
                    <Link to="/" className="inline-block px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition">Explorar produtos</Link>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
                        {cart.map((item) => (
                            <div key={item.product.id} className="p-4 flex items-center gap-4">
                                <Link to={`/product/${item.product.id}`}>
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl bg-slate-100" />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link to={`/product/${item.product.id}`} className="font-bold text-slate-800 hover:text-brand-600 line-clamp-1">{item.product.name}</Link>
                                    <p className="text-sm text-slate-500">{formatBRL(item.product.price)} · Qtd: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900">{formatBRL(item.product.price * item.quantity)}</p>
                                    <button onClick={() => removeFromCart(item.product.id)} className="mt-1 inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700">
                                        <Trash2 size={13} /> Remover
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="bg-white rounded-2xl border border-slate-200 p-6 lg:sticky lg:top-24">
                        <h2 className="font-bold text-lg text-slate-900 mb-4">Resumo do pedido</h2>
                        <div className="flex justify-between text-sm text-slate-600 mb-2"><span>Subtotal</span><span>{formatBRL(totalPrice)}</span></div>
                        <div className="flex justify-between text-sm text-slate-600 mb-4">
                            <span>Frete</span>
                            <span className="text-emerald-600 font-semibold">{totalPrice >= 299 ? 'Grátis' : 'A calcular'}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                            <span className="font-bold text-slate-700">Total</span>
                            <span className="text-2xl font-black text-slate-900">{formatBRL(totalPrice)}</span>
                        </div>
                        <button onClick={() => navigate('/checkout')} className="mt-6 w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition">
                            Finalizar compra
                        </button>
                        <Link to="/" className="mt-3 flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
                            <ArrowLeft size={14} /> Continuar comprando
                        </Link>
                    </aside>
                </div>
            )}
        </div>
    );
}
