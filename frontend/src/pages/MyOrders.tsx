import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

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
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/orders')
            .then((response) => setOrders(response.data))
            .catch((err) => console.error('Erro ao buscar pedidos:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Meus Pedidos 📦</h1>
                        <p className="text-sm text-gray-500">Acompanhe o histórico das suas compras na DevStore</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                    >
                        Voltar para a Loja
                    </button>
                </header>

                {loading ? (
                    <p className="text-center text-gray-500 mt-12">Carregando histórico...</p>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                        <p className="text-gray-500 text-lg mb-4">Você ainda não realizou nenhum pedido.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Começar a Comprar
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                                <div className="flex justify-between items-center border-b pb-4 mb-4">
                                    <div>
                                        <span className="text-xs font-semibold text-gray-400 uppercase">Pedido ID</span>
                                        <p className="text-sm font-mono text-gray-700">{order.id}</p>
                                        <span className="text-xs text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                                            {order.status}
                                        </span>
                                        <p className="text-lg font-black text-gray-900 mt-1">R$ {order.total.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase">Itens do Pedido</h4>
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded-md" />
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-sm">{item.product.name}</p>
                                                    <p className="text-xs text-gray-500">Qtd: {item.quantity}x</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-gray-700 text-sm">
                                                R$ {(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}