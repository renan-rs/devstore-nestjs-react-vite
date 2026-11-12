import { useState } from 'react';
import { inputClass, labelClass } from './ui';
import { useCategoryStore } from '../store/useCategoryStore';

// Os inputs trabalham com strings; o payload enviado à API já tem os números convertidos
export interface ProductFormValues {
    name: string;
    description: string;
    price: string;
    stock: string;
    imageUrl: string;
    categoryId: string;
}

export interface ProductPayload {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: string;
}

const emptyValues: ProductFormValues = {
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    categoryId: '',
};

interface ProductFormProps {
    initialValues?: ProductFormValues;
    submitLabel: string;
    loadingLabel: string;
    loading: boolean;
    error?: string;
    onSubmit: (payload: ProductPayload) => void | Promise<void>;
    onCancel?: () => void;
}

// Formulário compartilhado entre o cadastro e a edição de produtos.
// Para reiniciar os campos (ex: após cadastrar), troque a `key` no componente pai.
export function ProductForm({ initialValues = emptyValues, submitLabel, loadingLabel, loading, error, onSubmit, onCancel }: ProductFormProps) {
    const [values, setValues] = useState<ProductFormValues>(initialValues);
    const categories = useCategoryStore((s) => s.categories);

    // Se a categoria escolhida deixou de existir (ex: foi excluída), o select volta para "Selecione"
    const categoryValue = categories.some((c) => c.id === values.categoryId) ? values.categoryId : '';

    function setField<K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) {
        setValues((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        onSubmit({
            name: values.name,
            description: values.description,
            price: Number(values.price),
            stock: Number(values.stock),
            imageUrl: values.imageUrl,
            categoryId: categoryValue,
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl">{error}</div>}

            <div>
                <label className={labelClass}>Nome do produto</label>
                <input type="text" required value={values.name} onChange={(e) => setField('name', e.target.value)} className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>Categoria</label>
                <select required value={categoryValue} onChange={(e) => setField('categoryId', e.target.value)} disabled={categories.length === 0} className={inputClass}>
                    <option value="">{categories.length === 0 ? 'Crie uma categoria primeiro' : 'Selecione uma categoria'}</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>Preço (R$)</label>
                    <input type="number" step="0.01" min="0" required value={values.price} onChange={(e) => setField('price', e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Estoque</label>
                    <input type="number" step="1" min="0" required value={values.stock} onChange={(e) => setField('stock', e.target.value)} className={inputClass} />
                </div>
            </div>
            <div>
                <label className={labelClass}>URL da imagem</label>
                <input type="url" required value={values.imageUrl} onChange={(e) => setField('imageUrl', e.target.value)} placeholder="https://exemplo.com/imagem.jpg" className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>Descrição</label>
                <textarea required rows={3} value={values.description} onChange={(e) => setField('description', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none" />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="h-12 px-6 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition">
                        Cancelar
                    </button>
                )}
                <button type="submit" disabled={loading} className="flex-1 h-12 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition disabled:opacity-50">
                    {loading ? loadingLabel : submitLabel}
                </button>
            </div>
        </form>
    );
}
