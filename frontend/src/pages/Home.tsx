import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { useCatalogStore } from "../store/useCatalogStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { ProductCard } from "../components/ProductCard";
import { formatBRL } from "../components/useUser";

export function Home() {
    const { products, loading } = useCatalogStore();
    const [params, setParams] = useSearchParams();
    const q = (params.get('q') ?? '').trim().toLowerCase();
    const category = params.get('category'); // slug da categoria
    const isFiltering = Boolean(q || category);

    const allCategories = useCategoryStore((s) => s.categories);
    // Os cards da home usam a imagem de um produto, então só mostram categorias que têm produtos
    const categories = allCategories.filter((c) => products.some((p) => p.category.slug === c.slug));
    const categoryName = allCategories.find((c) => c.slug === category)?.name ?? category;
    const filtered = products.filter((p) =>
        (!category || p.category.slug === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    );

    const featured = products[0];
    const newest = [...products].reverse().slice(0, 4);
    const promoPalette = [
        'from-violet-600 to-fuchsia-500',
        'from-amber-400 to-orange-500',
        'from-emerald-500 to-teal-500',
        'from-sky-500 to-indigo-500',
    ];

    return (
        <div>
            {!isFiltering && (
                <section className="max-w-7xl mx-auto px-4 pt-6">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white">
                        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute right-40 -bottom-32 w-80 h-80 rounded-full bg-accent-400/20 blur-3xl" />
                        <div className="relative grid md:grid-cols-2 items-center gap-8 p-8 md:p-14">
                            <div>
                                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold">
                                    <Sparkles size={13} className="text-accent-400" /> Novidades da semana
                                </span>
                                <h1 className="mt-4 text-4xl md:text-5xl font-black leading-tight tracking-tight">
                                    Tecnologia que <span className="text-accent-400">simplifica</span> o seu dia
                                </h1>
                                <p className="mt-4 text-brand-100 max-w-md">
                                    Os melhores gadgets, acessórios e eletrônicos em um só lugar, com entrega rápida e compra segura.
                                </p>
                                <a href="#produtos" className="mt-7 inline-flex items-center gap-2 bg-accent-400 text-slate-900 font-bold px-6 py-3 rounded-full hover:bg-accent-500 transition">
                                    Comprar agora <ArrowRight size={18} />
                                </a>
                            </div>

                            {featured && (
                                <Link to={`/product/${featured.id}`} className="hidden md:block justify-self-end w-full max-w-sm group">
                                    <div className="bg-white rounded-3xl p-4 shadow-2xl shadow-black/30 rotate-2 group-hover:rotate-0 transition-transform duration-300">
                                        <img src={featured.imageUrl} alt={featured.name} className="w-full aspect-[4/3] object-cover rounded-2xl" />
                                        <div className="px-2 pt-3 pb-1 text-slate-900">
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">Destaque</p>
                                            <p className="font-bold line-clamp-1">{featured.name}</p>
                                            <p className="font-black text-lg">{formatBRL(featured.price)}</p>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {!isFiltering && categories.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 mt-10">
                    <h2 className="text-xl font-extrabold text-slate-900 mb-4">Navegue por categoria</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {categories.map((c) => {
                            const sample = products.find((p) => p.category.slug === c.slug);
                            return (
                                <Link key={c.id} to={`/?category=${encodeURIComponent(c.slug)}#produtos`}
                                    className="group bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-3 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-600/10 transition">
                                    <img src={sample?.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-600 leading-tight">{c.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            <section id="produtos" className="max-w-7xl mx-auto px-4 mt-10 scroll-mt-32">
                <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900">
                            {categoryName ?? (q ? `Resultados para “${params.get('q')}”` : 'Todos os produtos')}
                        </h2>
                        <p className="text-sm text-slate-500">{filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'}</p>
                    </div>
                    {isFiltering && (
                        <button onClick={() => setParams({})} className="flex items-center gap-1.5 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-full transition">
                            <X size={14} /> Limpar filtros
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-3 animate-pulse">
                                <div className="aspect-square bg-slate-100 rounded-xl" />
                                <div className="h-3 w-1/3 bg-slate-100 rounded mt-4" />
                                <div className="h-4 w-4/5 bg-slate-100 rounded mt-2" />
                                <div className="h-9 bg-slate-100 rounded mt-6" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center bg-white p-14 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-600 text-lg font-medium">Nenhum produto encontrado.</p>
                        <p className="text-sm text-slate-400 mt-1">Tente outra busca ou categoria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                )}
            </section>

            {!isFiltering && newest.length >= 2 && (
                <section className="max-w-7xl mx-auto px-4 mt-14">
                    <h2 className="text-xl font-extrabold text-slate-900 mb-4">Chegaram agora</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {newest.map((p, i) => (
                            <Link key={p.id} to={`/product/${p.id}`}
                                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${promoPalette[i % promoPalette.length]} text-white p-5 min-h-52 flex flex-col justify-end group`}>
                                <img src={p.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-500" />
                                <div className="relative">
                                    <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur px-2 py-0.5 rounded-md">{p.category.name}</span>
                                    <h3 className="mt-2 text-lg font-extrabold leading-tight line-clamp-2">{p.name}</h3>
                                    <p className="mt-1 text-sm font-semibold flex items-center gap-1">
                                        A partir de {formatBRL(p.price)} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
