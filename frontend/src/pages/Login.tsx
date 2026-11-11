import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, getErrorMessage } from '../services/api';
import { AuthShell } from '../components/AuthShell';
import { inputClass, labelClass } from '../components/ui';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(e: React.SyntheticEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            const { access_token, user } = response.data;

            // Salva o token e dados do usuário no localStorage
            localStorage.setItem('@DevStore:token', access_token);
            localStorage.setItem('@DevStore:user', JSON.stringify(user));

            // Redireciona para a home
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err, 'Ocorreu um erro ao fazer login. Verifique suas credenciais.'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthShell
            title="Bem-vindo de volta"
            subtitle="Entre com sua conta para continuar"
            footer={<>Não tem uma conta? <Link to="/register" className="text-brand-600 font-semibold hover:underline">Cadastre-se</Link></>}
        >
            {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl">{error}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className={labelClass}>E-mail</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Senha</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
                </div>
                <button type="submit" disabled={loading} className="w-full h-12 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition disabled:opacity-50">
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </AuthShell>
    );
}
