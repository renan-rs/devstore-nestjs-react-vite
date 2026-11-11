import { create } from 'zustand';
import { api } from '../services/api';
import type { Product } from './useCartStore';

interface CatalogState {
    products: Product[];
    loading: boolean;
    loaded: boolean;
    fetchProducts: () => Promise<void>;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
    products: [],
    loading: false,
    loaded: false,
    fetchProducts: async () => {
        if (get().loaded || get().loading) return;
        set({ loading: true });
        try {
            const res = await api.get('/products');
            set({ products: res.data, loaded: true });
        } catch (err) {
            console.error(err);
        } finally {
            set({ loading: false });
        }
    },
}));
