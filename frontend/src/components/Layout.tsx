import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Search, ShoppingCart, User, Package, LayoutDashboard, LogOut, Menu, X,
    Truck, ShieldCheck, Headphones, RotateCcw, Zap,
} from 'lucide-react';
import { useCartStore, selectTotalItems } from '../store/useCartStore';
import { useCatalogStore } from '../store/useCatalogStore';
import { useCategoryStore } from '../store/useCategoryStore';
import { logout } from './useUser';
import { useAuthStore } from '../store/useAuthStore';

function TopBar() {
    return (
        <div className="bg-brand-900 text-brand-100 text-xs">
            <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
                <span className="flex items-center gap-2">
                    <Zap size={13} className="text-accent-400" />
                    Frete grátis em compras acima de R$ 299
                </span>
                <span className="hidden sm:flex items-center gap-5">
                    <span>Suporte 24/7</span>
                    <span>Troca em até 30 dias</span>
                </span>
            </div>
        </div>
    );
}

function Header() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [query, setQuery] = useState(params.get('q') ?? '');
    const totalItems = useCartStore(selectTotalItems);
    const user = useAuthStore((s) => s.user);
    const fetchUser = useAuthStore((s) => s.fetchUser);
    const [menuOpen, setMenuOpen] = useState(false);

    // Carrega o usuário real (role incluso) do backend ao abrir o app
    useEffect(() => { fetchUser(); }, [fetchUser]);

    function handleSearch(e: React.SyntheticEvent) {
        e.preventDefault();
        const q = query.trim();
        navigate(q ? `/?q=${encodeURIComponent(q)}#produtos` : '/#produtos');
    }

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4 lg:gap-8">
                <Link to="/" className="flex items-center gap-2 shrink-0">
                    <span className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black">D</span>
                    <span className="text-xl font-extrabold tracking-tight text-slate-900">Dev<span className="text-brand-600">Store</span></span>
                </Link>

                <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden md:block">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar produtos..."
                        className="w-full h-10 pl-4 pr-11 rounded-full bg-slate-100 border border-transparent focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none text-sm transition"
                    />
                    <button type="submit" aria-label="Buscar" className="absolute right-1 top-1 w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition">
                        <Search size={15} />
                    </button>
                </form>

                <div className="ml-auto flex items-center gap-1 sm:gap-3">
                    {user ? (
                        <div className="hidden lg:flex items-center gap-1">
                            <span className="text-sm text-slate-600 mr-2">Olá, <b className="text-slate-900">{user.name.split(' ')[0]}</b></span>
                            <Link to="/orders" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition">
                                <Package size={16} /> Pedidos
                            </Link>
                            {user.role === 'ADMIN' && (
                                <Link to="/admin/products" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 transition">
                                    <LayoutDashboard size={16} /> Admin
                                </Link>
                            )}
                            <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition">
                                <LogOut size={16} /> Sair
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
                            <User size={18} />
                            <span className="leading-tight">
                                <span className="block text-[11px] text-slate-400">Minha conta</span>
                                Entrar
                            </span>
                        </Link>
                    )}

                    <Link to="/cart" className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition">
                        <ShoppingCart size={18} />
                        <span className="hidden sm:inline">Carrinho</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-accent-500 text-slate-900 text-[11px] font-black flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 text-sm">
                    <form onSubmit={(e) => { handleSearch(e); setMenuOpen(false); }} className="mb-2">
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar produtos..."
                            className="w-full h-10 px-4 rounded-full bg-slate-100 outline-none focus:ring-2 focus:ring-brand-200" />
                    </form>
                    {user ? (
                        <>
                            <Link onClick={() => setMenuOpen(false)} to="/orders" className="block px-3 py-2 rounded-lg hover:bg-slate-100">Meus pedidos</Link>
                            {user.role === 'ADMIN' && <Link onClick={() => setMenuOpen(false)} to="/admin/products" className="block px-3 py-2 rounded-lg hover:bg-slate-100">Painel admin</Link>}
                            <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100">Sair</button>
                        </>
                    ) : (
                        <Link onClick={() => setMenuOpen(false)} to="/login" className="block px-3 py-2 rounded-lg hover:bg-slate-100">Entrar / Cadastrar</Link>
                    )}
                </div>
            )}
        </header>
    );
}

function CategoryNav() {
    const categories = useCategoryStore((s) => s.categories);
    const [params] = useSearchParams();
    const { pathname } = useLocation();
    const active = pathname === '/' ? params.get('category') : null;

    return (
        <nav className="bg-white border-b border-slate-200 hidden md:block">
            <div className="max-w-7xl mx-auto px-4 h-11 flex items-center gap-1 overflow-x-auto text-sm">
                <NavLink to="/" end className={() =>
                    `px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition ${!active && pathname === '/' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                    Todos
                </NavLink>
                {categories.map((c) => (
                    <Link key={c.id} to={`/?category=${encodeURIComponent(c.slug)}#produtos`}
                        className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition ${active === c.slug ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                        {c.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

function Footer() {
    const perks = [
        { icon: Truck, title: 'Frete grátis', text: 'Acima de R$ 299' },
        { icon: ShieldCheck, title: 'Compra segura', text: 'Pagamento protegido' },
        { icon: RotateCcw, title: 'Troca fácil', text: 'Até 30 dias' },
        { icon: Headphones, title: 'Suporte 24/7', text: 'Sempre à disposição' },
    ];
    return (
        <footer className="mt-20 bg-brand-900 text-brand-100">
            <div className="max-w-7xl mx-auto px-4 -translate-y-1/2">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-2xl shadow-xl shadow-brand-900/10 p-5 border border-slate-200">
                    {perks.map(({ icon: Icon, title, text }) => (
                        <div key={title} className="flex items-center gap-3">
                            <span className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0"><Icon size={22} /></span>
                            <div>
                                <p className="font-bold text-slate-900 text-sm">{title}</p>
                                <p className="text-xs text-slate-500">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-10 -mt-6 grid gap-8 md:grid-cols-4 text-sm">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black">D</span>
                        <span className="text-xl font-extrabold text-white">DevStore</span>
                    </div>
                    <p className="max-w-sm text-brand-200">E-commerce full stack construído com NestJS, Prisma, React e Vite. Projeto de portfólio.</p>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-3">Loja</h4>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:text-white">Início</Link></li>
                        <li><Link to="/cart" className="hover:text-white">Carrinho</Link></li>
                        <li><Link to="/orders" className="hover:text-white">Meus pedidos</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-3">Conta</h4>
                    <ul className="space-y-2">
                        <li><Link to="/login" className="hover:text-white">Entrar</Link></li>
                        <li><Link to="/register" className="hover:text-white">Criar conta</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10 py-4 text-center text-xs text-brand-200">
                © {new Date().getFullYear()} DevStore — Projeto de portfólio
            </div>
        </footer>
    );
}

export function Layout() {
    const fetchProducts = useCatalogStore((s) => s.fetchProducts);
    const fetchCategories = useCategoryStore((s) => s.fetchCategories);
    const { pathname, hash } = useLocation();

    useEffect(() => { fetchProducts(); }, [fetchProducts]);
    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    useEffect(() => {
        if (hash) {
            requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }));
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);

    return (
        <div className="min-h-screen flex flex-col">
            <TopBar />
            <Header />
            <CategoryNav />
            <main className="flex-1"><Outlet /></main>
            <Footer />
        </div>
    );
}
