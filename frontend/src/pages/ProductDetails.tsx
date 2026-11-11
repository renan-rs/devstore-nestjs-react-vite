import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Check, Truck, ShieldCheck, RotateCcw, Minus, Plus } from 'lucide-react';
import { api } from '../services/api';
import { useCartStore, type Product } from '../store/useCartStore';
import { useCatalogStore } from '../store/useCatalogStore';
import { ProductCard } from '../components/ProductCard';
import { formatBRL } from '../components/useUser';

export function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    // key reinicia o estado (loading, quantidade) ao navegar entre produtos
    return <ProductDetailsContent key={id} id={id} />;
}

function ProductDetailsContent({ id }: { id?: string }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const addToCart = useCartStore((state) => state.addToCart);
    const catalog = useCatalogStore((s) => s.products);

    useEffect(() => {
        api.get(`/products/${id}`)
            .then((response) => setProduct(response.data))
            .catch((err) => { console.error('Erro ao carregar produto:', err); setProduct(null); })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10 animate-pulse">
                <div className="aspect-square bg-slate-200 rounded-3xl" />
                <div className="space-y-4">
                    <div className="h-4 w-24 bg-slate-200 rounded" />
                    <div className="h-9 w-3/4 bg-slate-200 rounded" />
                    <div className="h-24 bg-slate-200 rounded" />
                </div>
            </div>
        );
    }
    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <p className="text-lg text-slate-600 mb-4">Produto não encontrado.</p>
                <Link to="/" className="text-brand-600 font-semibold hover:underline">Voltar para a loja</Link>
            </div>
        );
    }

    const soldOut = product.stock === 0;
    const related = catalog.filter((p) => p.category.id === product.category.id && p.id !== product.id).slice(0, 4);

    function handleAdd() {
        for (let i = 0; i < qty; i++) addToCart(product!);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-6 flex-wrap">
                <Link to="/" className="hover:text-brand-600">Início</Link>
                <ChevronRight size={14} />
                <Link to={`/?category=${encodeURIComponent(product.category.slug)}#produtos`} className="hover:text-brand-600">{product.category.name}</Link>
                <ChevronRight size={14} />
                <span className="text-slate-900 font-medium line-clamp-1">{product.name}</span>
            </nav>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
                <div className="bg-white border border-slate-200 rounded-3xl p-4">
                    <img src={product.imageUrl} alt={product.name} className="w-full aspect-square object-cover rounded-2xl" />
                </div>

                <div className="flex flex-col">
                    <span className="self-start text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">{product.category.name}</span>
                    <h1 className="mt-3 text-3xl md:text-4xl font-black text-slate-900 leading-tight">{product.name}</h1>

                    <p className="mt-5 text-4xl font-black text-slate-900">{formatBRL(product.price)}</p>
                    <p className="text-sm text-slate-500 mt-1">
                        ou 3x de {formatBRL(product.price / 3)} sem juros
                    </p>

                    <p className="mt-5 text-slate-600 leading-relaxed">{product.description}</p>

                    <p className={`mt-5 text-sm font-semibold ${soldOut ? 'text-rose-600' : product.stock <= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {soldOut ? 'Produto esgotado' : product.stock <= 5 ? `Apenas ${product.stock} em estoque` : `${product.stock} unidades disponíveis`}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <div className="flex items-center border border-slate-300 rounded-xl bg-white">
                            <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={soldOut} className="w-11 h-12 flex items-center justify-center text-slate-600 hover:text-brand-600 disabled:opacity-40" aria-label="Diminuir">
                                <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-bold">{qty}</span>
                            <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={soldOut} className="w-11 h-12 flex items-center justify-center text-slate-600 hover:text-brand-600 disabled:opacity-40" aria-label="Aumentar">
                                <Plus size={16} />
                            </button>
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={soldOut}
                            className="flex-1 min-w-48 h-12 flex items-center justify-center gap-2 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                        >
                            {added ? <><Check size={18} /> Adicionado!</> : <><ShoppingCart size={18} /> {soldOut ? 'Esgotado' : 'Adicionar ao carrinho'}</>}
                        </button>
                    </div>

                    <ul className="mt-8 grid gap-3 text-sm text-slate-600 border-t border-slate-200 pt-6">
                        <li className="flex items-center gap-3"><Truck size={18} className="text-brand-600" /> Frete grátis em compras acima de R$ 299</li>
                        <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-brand-600" /> Compra 100% segura</li>
                        <li className="flex items-center gap-3"><RotateCcw size={18} className="text-brand-600" /> Troca grátis em até 30 dias</li>
                    </ul>
                </div>
            </div>

            {related.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-xl font-extrabold text-slate-900 mb-4">Você também pode gostar</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {related.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                </section>
            )}
        </div>
    );
}
