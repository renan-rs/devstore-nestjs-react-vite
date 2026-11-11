import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Zap } from 'lucide-react';

export function AuthShell({ title, subtitle, children, footer }: {
    title: string;
    subtitle: string;
    children: ReactNode;
    footer: ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">
            <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-12 text-white bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500">
                <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -left-20 bottom-0 w-80 h-80 rounded-full bg-accent-400/20 blur-3xl" />
                <Link to="/" className="relative flex items-center gap-2">
                    <span className="w-10 h-10 rounded-xl bg-white text-brand-600 flex items-center justify-center font-black">D</span>
                    <span className="text-2xl font-extrabold">DevStore</span>
                </Link>
                <div className="relative">
                    <h2 className="text-4xl font-black leading-tight">Tecnologia que <span className="text-accent-400">simplifica</span> o seu dia.</h2>
                    <ul className="mt-8 space-y-4 text-brand-100">
                        <li className="flex items-center gap-3"><Truck size={20} className="text-accent-400" /> Frete grátis acima de R$ 299</li>
                        <li className="flex items-center gap-3"><ShieldCheck size={20} className="text-accent-400" /> Compra 100% segura</li>
                        <li className="flex items-center gap-3"><Zap size={20} className="text-accent-400" /> Entrega rápida</li>
                    </ul>
                </div>
                <p className="relative text-xs text-brand-200">© {new Date().getFullYear()} DevStore — Projeto de portfólio</p>
            </div>

            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
                        <span className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black">D</span>
                        <span className="text-xl font-extrabold">Dev<span className="text-brand-600">Store</span></span>
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900">{title}</h1>
                    <p className="text-slate-500 mt-1 mb-8">{subtitle}</p>
                    {children}
                    <div className="mt-8 text-center text-sm text-slate-600">{footer}</div>
                </div>
            </div>
        </div>
    );
}
