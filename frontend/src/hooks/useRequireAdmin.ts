import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// Garante que só um ADMIN permaneça na tela. O role vem do backend (/auth/me), nunca do localStorage.
// Visitante é enviado ao login e usuário comum à home. Retorna true apenas quando o admin está confirmado.
export function useRequireAdmin(): boolean {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const status = useAuthStore((s) => s.status);
    const fetchUser = useAuthStore((s) => s.fetchUser);

    useEffect(() => { fetchUser(); }, [fetchUser]);

    useEffect(() => {
        if (status !== 'done') return;
        if (!user) {
            navigate('/login');
        } else if (user.role !== 'ADMIN') {
            alert('Acesso negado! Apenas administradores podem acessar esta página.');
            navigate('/');
        }
    }, [status, user, navigate]);

    return status === 'done' && user?.role === 'ADMIN';
}
