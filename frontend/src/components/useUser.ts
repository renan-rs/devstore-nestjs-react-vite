export interface StoredUser {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER' | string;
}

export function getStoredUser(): StoredUser | null {
    try {
        const raw = localStorage.getItem('@DevStore:user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function logout() {
    localStorage.removeItem('@DevStore:token');
    localStorage.removeItem('@DevStore:user');
    window.location.href = '/';
}

export const formatBRL = (value: number) =>
    Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
