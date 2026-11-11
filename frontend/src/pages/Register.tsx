import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, getErrorMessage } from '../services/api';
import { AuthShell } from '../components/AuthShell';
import { inputClass, labelClass } from '../components/ui';

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleRegister(e: React.SyntheticEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/register', {
                name,
                email,
                password,
            });

            alert('Cadastro realizado com sucesso! Faça seu login.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err, 'Erro ao criar conta.'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthShell
            title="Criar conta"
            subtitle="Junte-se à DevStore em poucos segundos"
            footer={<>Já tem uma conta? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Faça login</Link></>}
        >
            {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl">{error}</div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className={labelClass}>Nome</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>E-mail</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Senha</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className={inputClass} />
                </div>
                <button type="submit" disabled={loading} className="w-full h-12 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition disabled:opacity-50">
                    {loading ? 'Cadastrando...' : 'Criar conta'}
                </button>
            </form>
        </AuthShell>
    );
}
