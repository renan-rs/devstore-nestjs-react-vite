import axios from "axios";

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