import { create } from 'zustand';
import { api } from '../services/api';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

type AuthStatus = 'idle' | 'loading' | 'done';

interface AuthState {
    user: AuthUser | null;
    status: AuthStatus;
    setUser: (user: AuthUser) => void;
    fetchUser: () => Promise<void>;
    clear: () => void;
}

// O usuário (e principalmente o role) vive só em memória e vem do backend (/auth/me).
// Nada que possa ser editado no localStorage decide o que a UI mostra.
export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    status: 'idle',
    setUser: (user) => set({ user, status: 'done' }),
    fetchUser: async () => {
        if (get().status !== 'idle') return;
        if (!localStorage.getItem('@DevStore:token')) {
            set({ user: null, status: 'done' });
            return;
        }
        set({ status: 'loading' });
        try {
            const res = await api.get<AuthUser>('/auth/me');
            set({ user: res.data, status: 'done' });
        } catch {
            // 401 já é tratado pelo interceptor (limpa o token e redireciona)
            set({ user: null, status: 'done' });
        }
    },
    clear: () => set({ user: null, status: 'done' }),
}));
