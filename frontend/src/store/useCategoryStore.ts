import { create } from 'zustand';
import { api } from '../services/api';

export interface Category {
    id: string;
    name: string;
    slug: string;
    // Quantidade de produtos da categoria (vem do GET /categories)
    _count?: { products: number };
}

interface CategoryState {
    categories: Category[];
    loading: boolean;
    loaded: boolean;
    fetchCategories: () => Promise<void>;
    refreshCategories: () => Promise<void>;
    createCategory: (name: string) => Promise<void>;
    removeCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    loading: false,
    loaded: false,
    fetchCategories: async () => {
        if (get().loaded || get().loading) return;
        set({ loading: true });
        try {
            const res = await api.get<Category[]>('/categories');
            set({ categories: res.data, loaded: true });
        } catch (err) {
            console.error(err);
        } finally {
            set({ loading: false });
        }
    },
    // Força nova busca (após criar/excluir categoria ou mudar a contagem de produtos)
    refreshCategories: async () => {
        set({ loaded: false });
        await get().fetchCategories();
    },
    // Os erros (ex: 409 de nome duplicado ou categoria com produtos) sobem para a tela tratar
    createCategory: async (name) => {
        await api.post('/categories', { name });
        await get().refreshCategories();
    },
    removeCategory: async (id) => {
        await api.delete(`/categories/${id}`);
        await get().refreshCategories();
    },
}));
