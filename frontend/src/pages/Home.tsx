import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
}

export function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/products')
        .then((response) => {
            setProducts(response.data);
        })
        .catch((error) => {
            console.error('Erro ao buscar produtos:', error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);
    
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">DevStore Catalog 🚀</h1>
                    <a
                        href="/login"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Entrar / Admin
                    </a>
                </header>

                {loading ? (
                    <p className="text-center text-gray-500 mt-12">Carregando produtos da API...</p>
                ) : products.length === 0 ? (
                    <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-gray-600 text-lg">Nenhum produto cadastrado no momento.</p>
                        <p className="text-sm text-gray-400 mt-2">Cadastre produtos via Postman/Insomnia ou crie a tela de Admin no frontend.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
                                <img src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover" />
                                <div className="p-5 flex flex-col flex-1">
                                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">{product.category}</span>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 flex-1">{product.description}</p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-2xl font-black text-gray-900">
                                            R$ {product.price.toFixed(2)}
                                        </span>
                                        <button className="px-3 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition">
                                            Comprar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}