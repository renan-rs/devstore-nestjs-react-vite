import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { api, getErrorMessage } from '../services/api';
import { inputClass, labelClass } from '../components/ui';
import { formatBRL } from '../components/useUser';
import { useCatalogStore } from '../store/useCatalogStore';
import { useAuthStore } from '../store/useAuthStore';
import { useCategoryStore } from '../store/useCategoryStore';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: { id: string; name: string; slug: string };
    imageUrl?: string;
}

export function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [categoryLoading, setCategoryLoading] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const authStatus = useAuthStore((s) => s.status);
    const fetchUser = useAuthStore((s) => s.fetchUser);
    const categories = useCategoryStore((s) => s.categories);
    const fetchCategories = useCategoryStore((s) => s.fetchCategories);
    const refreshCategories = useCategoryStore((s) => s.refreshCategories);
    const createCategory = useCategoryStore((s) => s.createCategory);
    const removeCategory = useCategoryStore((s) => s.removeCategory);

    // O role vem do backend (/auth/me), nunca do localStorage
    useEffect(() => { fetchUser(); }, [fetchUser]);
    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    useEffect(() => {
        if (authStatus !== 'done') return;
        if (!user) {
            navigate('/login');
        } else if (user.role !== 'ADMIN') {
            alert('Acesso negado! Apenas administradores podem acessar esta página.');
            navigate('/');
        } else {
            fetchProducts();
        }
    }, [authStatus, user, navigate]);

    // O catálogo compartilhado (nav de categorias, home) é cacheado: força nova busca após mudanças
    function refreshCatalog() {
        useCatalogStore.setState({ loaded: false });
        useCatalogStore.getState().fetchProducts();
    }

    async function handleCreateCategory(e: React.SyntheticEvent) {
        e.preventDefault();
        setCategoryError('');
        setCategoryLoading(true);
        try {
            await createCategory(newCategory);
            setNewCategory('');
        } catch (err) {
            setCategoryError(getErrorMessage(err, 'Erro ao criar categoria.'));
        } finally {
            setCategoryLoading(false);
        }
    }

    async function handleDeleteCategory(id: string, name: string) {
        if (!confirm(`Excluir a categoria "${name}"?`)) return;
        setCategoryError('');
        try {
            await removeCategory(id);
            if (categoryId === id) setCategoryId('');
        } catch (err) {
            // 409: categoria ainda possui produtos
            setCategoryError(getErrorMessage(err, 'Erro ao excluir categoria.'));
        }
    }

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
                categoryId,
            });

            setSuccess('Produto cadastrado com sucesso!');
            setName('');
            setDescription('');
            setPrice('');
            setStock('');
            setImageUrl('');
            setCategoryId('');
            fetchProducts(); // Atualiza a lista
            refreshCatalog();
            refreshCategories(); // Atualiza a contagem de produtos por categoria
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err, 'Erro ao cadastrar produto. Verifique os dados.'));
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
            refreshCatalog();
            refreshCategories();
        } catch (err) {
            console.error('Erro ao deletar produto:', err);
            alert('Erro ao excluir produto.');
        }
    }

    if (user?.role !== 'ADMIN') return null;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black text-slate-900">Painel administrativo</h1>
            <p className="text-sm text-slate-500 mb-6">Gerenciamento de produtos da DevStore</p>

            <div className="grid lg:grid-cols-5 gap-6 items-start">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 lg:sticky lg:top-24">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Cadastrar novo produto</h2>

                    {error && <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-xl">{error}</div>}
                    {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 text-sm rounded-xl">{success}</div>}

                    <form onSubmit={handleCreateProduct} className="space-y-4">
                        <div>
                            <label className={labelClass}>Nome do produto</label>
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Categoria</label>
                            <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} disabled={categories.length === 0} className={inputClass}>
                                <option value="">{categories.length === 0 ? 'Crie uma categoria primeiro' : 'Selecione uma categoria'}</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Preço (R$)</label>
                                <input type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Estoque</label>
                                <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>URL da imagem</label>
                            <input type="url" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://exemplo.com/imagem.jpg" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Descrição</label>
                            <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full h-12 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition disabled:opacity-50">
                            {loading ? 'Cadastrando...' : 'Salvar produto'}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-3 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Categorias <span className="text-slate-400 font-medium">({categories.length})</span></h2>

                    {categoryError && <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-xl">{categoryError}</div>}

                    <form onSubmit={handleCreateCategory} className="flex gap-2 mb-4">
                        <input type="text" required maxLength={50} value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Nova categoria (ex: Periféricos)" className={inputClass} />
                        <button type="submit" disabled={categoryLoading} className="px-5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition disabled:opacity-50 whitespace-nowrap">
                            {categoryLoading ? 'Criando...' : 'Adicionar'}
                        </button>
                    </form>

                    {categories.length === 0 ? (
                        <p className="text-sm text-slate-500">Nenhuma categoria cadastrada.</p>
                    ) : (
                        <ul className="flex flex-wrap gap-2">
                            {categories.map((c) => (
                                <li key={c.id} className="flex items-center gap-1 pl-3 pr-1 py-1 bg-brand-50 text-brand-700 text-sm font-semibold rounded-full">
                                    {c.name}
                                    <span className="text-xs font-medium text-brand-700/60">({c._count?.products ?? 0})</span>
                                    <button onClick={() => handleDeleteCategory(c.id, c.name)} aria-label={`Excluir categoria ${c.name}`} className="p-1 text-rose-500 hover:bg-rose-100 rounded-full transition">
                                        <Trash2 size={14} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900">Produtos cadastrados <span className="text-slate-400 font-medium">({products.length})</span></h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-3">Nome</th>
                                    <th className="px-4 py-3">Categoria</th>
                                    <th className="px-4 py-3">Preço</th>
                                    <th className="px-4 py-3">Estoque</th>
                                    <th className="px-6 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-3 font-semibold text-slate-900">{p.name}</td>
                                        <td className="px-4 py-3"><span className="text-xs font-semibold bg-brand-50 text-brand-700 px-2 py-1 rounded-md">{p.category.name}</span></td>
                                        <td className="px-4 py-3">{formatBRL(p.price)}</td>
                                        <td className="px-4 py-3">
                                            <span className={p.stock === 0 ? 'text-rose-600 font-semibold' : ''}>{p.stock} un.</span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <button onClick={() => handleDelete(p.id)} aria-label="Excluir" className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition">
                                                <Trash2 size={16} />
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
        </div>
    );
}
