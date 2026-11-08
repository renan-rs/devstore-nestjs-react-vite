import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCartStore, type Product } from '../store/useCartStore';

export function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        api.get(`/products/${id}`)
            .then((response) => setProduct(response.data))
            .catch((err) => console.error('Erro ao carregar produto:', err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-center py-20 text-gray-500">Carregando detalhes...</div>;
    if (!product) return <div className="text-center py-20 text-red-500">Produto não encontrado.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-8">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                    ← Voltar para a Loja
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-80 object-cover rounded-lg shadow-sm" />

                    <div>
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{product.category}</span>
                        <h1 className="text-3xl font-extrabold text-gray-900 mt-1 mb-4">{product.name}</h1>
                        <p className="text-gray-600 mb-6">{product.description}</p>

                        <div className="mb-6">
                            <span className="text-3xl font-black text-gray-900">R$ {product.price.toFixed(2)}</span>
                            <p className="text-sm text-gray-500 mt-1">Estoque disponível: {product.stock} unidades</p>
                        </div>

                        <button
                            onClick={() => {
                                addToCart(product);
                                alert('Produto adicionado ao carrinho!');
                            }}
                            disabled={product.stock === 0}
                            className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                            {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}