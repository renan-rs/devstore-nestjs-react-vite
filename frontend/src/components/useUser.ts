export function logout() {
    localStorage.removeItem('@DevStore:token');
    localStorage.removeItem('@DevStore:user'); // legado: versões antigas guardavam o user aqui
    window.location.href = '/';
}

export const formatBRL = (value: number) =>
    Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
