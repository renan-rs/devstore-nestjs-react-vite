import axios, { isAxiosError } from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:3000', // URL do backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para injetar o token JWT nas requisições protegidas automaticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@DevStore:token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

// Se o token for rejeitado (expirado, usuário removido), encerra a sessão e volta para o login.
// Ignora as próprias rotas de auth, onde 401 significa apenas "credenciais inválidas".
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url: string = error.config?.url ?? '';
        const isAuthRoute = url.startsWith('/auth/');

        if(error.response?.status === 401 && !isAuthRoute){
            localStorage.removeItem('@DevStore:token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);


export function getErrorMessage(err: unknown, fallback: string): string {
    if (isAxiosError(err)) {
        const message = err.response?.data?.message;
        // O NestJS devolve array de strings quando a validação (class-validator) falha
        if (Array.isArray(message)) return message.join('. ');
        if (typeof message === 'string') return message;
    }
    return fallback;
}
