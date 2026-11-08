import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
}

export function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Verifica se o usuário é admin ou está logado ao carregar a página
    useEffect(() => {
        const userStr = localStorage.getItem('@DevStore:user');
        if (!userStr) {
            navigate('/login');
            return;
        }
        const user = JSON.parse(userStr);
        if (user.role !== 'ADMIN') {
            alert('Acesso negado! Apenas administradores podem acessar esta página.');
            navigate('/');
        }

        fetchProducts();
    }, [navigate]);

    async function fetchProducts() {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (err) {
            console.error('Erro ao buscar produtos:', err);
        }
    }

    async function handleCreateProduct(e: React.SyntheticEvent) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.post('/products', {
                name,
                description,
                price: Number(price),
                stock: Number(stock),
                imageUrl,
                category,
            });

            setSuccess('Produto cadastrado com sucesso!');
            setName('');
            setDescription('');
            setPrice('');
            setStock('');
            setImageUrl('');
            setCategory('');
            fetchProducts(); // Atualiza a lista
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Erro ao cadastrar produto. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            console.error('Erro ao deletar produto:', err);
            alert('Erro ao excluir produto.');
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Painel Administrativo 🛠️</h1>
                        <p className="text-sm text-gray-500">Gerenciamento de produtos da DevStore</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Voltar para a Loja
                    </button>
                </header>

                {/* Formulário de Cadastro */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Cadastrar Novo Produto</h2>

                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
                    {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg">{success}</div>}

                    <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <input
                                type="text"
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Ex: Eletrônicos, Livros..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                            <input
                                type="number"
                                required
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                            <input
                                type="url"
                                required
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://exemplo.com/imagem.jpg"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                            <textarea
                                required
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Cadastrando...' : 'Salvar Produto'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabela de Produtos Existentes */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Produtos Cadastrados ({products.length})</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
                                    <th className="p-4">Nome</th>
                                    <th className="p-4">Categoria</th>
                                    <th className="p-4">Preço</th>
                                    <th className="p-4">Estoque</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-900">{p.name}</td>
                                        <td className="p-4">{p.category}</td>
                                        <td className="p-4">R$ {p.price.toFixed(2)}</td>
                                        <td className="p-4">{p.stock} un.</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}