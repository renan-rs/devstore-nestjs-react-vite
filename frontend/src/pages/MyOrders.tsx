import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import { api } from '../services/api';
import { formatBRL } from '../components/useUser';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        name: string;
        imageUrl: string;
    };
}

interface Order {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export function MyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders')
            .then((response) => setOrders(response.data))
            .catch((err) => console.error('Erro ao buscar pedidos:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black text-slate-900">Meus pedidos</h1>
            <p className="text-sm text-slate-500 mb-6">Acompanhe o histórico das suas compras</p>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[0, 1].map((i) => <div key={i} className="h-40 bg-slate-200 rounded-2xl" />)}
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white p-14 rounded-3xl border border-dashed border-slate-300 text-center">
                    <span className="mx-auto w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4"><PackageOpen size={30} /></span>
                    <p className="text-slate-700 text-lg font-semibold mb-6">Você ainda não realizou nenhum pedido</p>
                    <Link to="/" className="inline-block px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition">Começar a comprar</Link>
                </div>
            ) : (
                <div className="space-y-5">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="flex flex-wrap justify-between items-center gap-3 bg-slate-50 px-5 py-4 border-b border-slate-200">
                                <div>
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Pedido</p>
                                    <p className="text-sm font-mono text-slate-700">#{order.id.slice(0, 8)}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">{order.status}</span>
                                    <p className="text-lg font-black text-slate-900 mt-1">{formatBRL(order.total)}</p>
                                </div>
                            </div>

                            <div className="p-5 space-y-3">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg bg-slate-100" />
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-800 text-sm line-clamp-1">{item.product.name}</p>
                                                <p className="text-xs text-slate-500">Qtd: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-slate-700 text-sm">{formatBRL(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
