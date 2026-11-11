import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore, type Product } from '../store/useCartStore';
import { formatBRL } from './useUser';

export function ProductCard({ product }: { product: Product }) {
    const addToCart = useCartStore((s) => s.addToCart);
    const soldOut = product.stock === 0;
    const lowStock = product.stock > 0 && product.stock <= 5;

    return (
        <div className="group bg-white rounded-2xl border border-slate-200 p-3 flex flex-col hover:shadow-xl hover:shadow-brand-600/10 hover:-translate-y-0.5 transition-all duration-200">
            <Link to={`/product/${product.id}`} className="relative block aspect-square rounded-xl bg-slate-50 overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {soldOut && (
                    <span className="absolute top-2 left-2 text-[11px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-md">Esgotado</span>
                )}
                {lowStock && (
                    <span className="absolute top-2 left-2 text-[11px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-md">
                        Últimas {product.stock} un.
                    </span>
                )}
            </Link>

            <div className="pt-3 px-1 flex flex-col flex-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">{product.category}</span>
                <Link to={`/product/${product.id}`} className="mt-1 font-semibold text-slate-800 leading-snug line-clamp-2 hover:text-brand-600 transition">
                    {product.name}
                </Link>
                <div className="mt-auto pt-3">
                    <p className="text-xl font-black text-slate-900">{formatBRL(product.price)}</p>
                    <button
                        onClick={() => addToCart(product)}
                        disabled={soldOut}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart size={16} />
                        {soldOut ? 'Indisponível' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
