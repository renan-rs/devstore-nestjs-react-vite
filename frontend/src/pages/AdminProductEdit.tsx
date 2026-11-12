import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api, getErrorMessage } from '../services/api';
import { ProductForm, type ProductPayload } from '../components/ProductForm';
import { useRequireAdmin } from '../hooks/useRequireAdmin';
import { useCatalogStore } from '../store/useCatalogStore';
import { useCategoryStore } from '../store/useCategoryStore';

interface ProductData {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    category: { id: string; name: string; slug: string };
}

export function AdminProductEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isAdmin = useRequireAdmin();
    const fetchCategories = useCategoryStore((s) => s.fetchCategories);
    const refreshCategories = useCategoryStore((s) => s.refreshCategories);
    const refreshProducts = useCatalogStore((s) => s.refreshProducts);

    const [product, setProduct] = useState<ProductData | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    useEffect(() => {
        if (!isAdmin) return;
        api.get<ProductData>(`/products/${id}`)
            .then((res) => setProduct(res.data))
            .catch(() => setProduct(null)) // 404: produto inexistente
            .finally(() => setLoadingProduct(false));
    }, [isAdmin, id]);

    async function handleSubmit(payload: ProductPayload) {
        setError('');
        setSaving(true);
        try {
            await api.patch(`/products/${id}`, payload);
            refreshProducts(); // catálogo da loja
            refreshCategories(); // contagem de produtos por categoria (a categoria pode ter mudado)
            navigate('/admin/products', { state: { success: 'Produto atualizado com sucesso!' } });
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err, 'Erro ao atualizar produto. Verifique os dados.'));
            setSaving(false);
        }
    }

    if (!isAdmin) return null;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600 transition mb-4">
                <ArrowLeft size={16} /> Voltar para os produtos
            </Link>

            <h1 className="text-3xl font-black text-slate-900">Editar produto</h1>
            <p className="text-sm text-slate-500 mb-6">Altere os dados e salve para atualizar a loja</p>

            {loadingProduct ? (
                <p className="text-slate-500">Carregando produto...</p>
            ) : !product ? (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
                    <p className="text-slate-600 mb-3">Produto não encontrado.</p>
                    <Link to="/admin/products" className="text-brand-600 font-semibold hover:underline">Voltar para os produtos</Link>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                    <ProductForm
                        key={product.id}
                        initialValues={{
                            name: product.name,
                            description: product.description,
                            price: String(product.price),
                            stock: String(product.stock),
                            imageUrl: product.imageUrl,
                            categoryId: product.category.id,
                        }}
                        submitLabel="Salvar alterações"
                        loadingLabel="Salvando..."
                        loading={saving}
                        error={error}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate('/admin/products')}
                    />
                </div>
            )}
        </div>
    );
}
