import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import * as quoteService from '../../services/quoteService';
import * as clientService from '../../services/clientService';

const QuoteForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            line_items: [{ description: '', quantity: 1, rate: 0 }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "line_items"
    });

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchClients();
        if (isEditMode) {
            fetchQuote();
        }
    }, [id]);

    const fetchClients = async () => {
        try {
            const data = await clientService.index();
            setClients(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchQuote = async () => {
        try {
            const data = await quoteService.show(id);
            reset({
                ...data,
                client_id: data.client_id,
                expiry_date: data.expiry_date,
                line_items: data.line_items
            });
        } catch (err) {
            console.error(err);
            navigate('/quotes');
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (isEditMode) {
                await quoteService.update(id, data);
            } else {
                await quoteService.create(data);
            }
            toast.success(`Quote ${isEditMode ? 'updated' : 'created'} successfully`);
            navigate('/quotes');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.detail || `Failed to ${isEditMode ? 'update' : 'create'} quote`);
        } finally {
            setLoading(false);
        }
    };

    // Calculate total for preview
    const lineItems = watch('line_items');
    const total = lineItems ? lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0) : 0;

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/quotes')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Quotes
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">{isEditMode ? 'Edit Quote' : 'Create Quote'}</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Client</label>
                            <select
                                {...register('client_id', { required: 'Client is required' })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none bg-white"
                            >
                                <option value="">Select a client</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                            {errors.client_id && <p className="mt-1 text-xs text-red-500">{errors.client_id.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Quote Title</label>
                            <input
                                {...register('title', { required: 'Title is required' })}
                                placeholder="e.g. Website Redesign"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none"
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                            <input
                                type="date"
                                {...register('expiry_date')}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">Line Items</h3>
                            <button
                                type="button"
                                onClick={() => append({ description: '', quantity: 1, rate: 0 })}
                                className="text-sm text-primary font-medium hover:text-primary/80 flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Add Item
                            </button>
                        </div>

                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-4 items-end">
                                    <div className="col-span-5">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                                        <input
                                            {...register(`line_items.${index}.description`, { required: true })}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Qty</label>
                                        <input
                                            type="number"
                                            {...register(`line_items.${index}.quantity`, { required: true, min: 1 })}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Unit Price ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register(`line_items.${index}.rate`, { required: true, min: 0 })}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-2 text-slate-400 hover:text-red-500 rounded-lg w-full flex justify-center"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end mt-6 pt-6 border-t border-slate-100">
                            <div className="text-right space-y-2">
                                <div className="flex justify-end gap-8 text-slate-500 text-sm">
                                    <span>Subtotal (Excl. Tax)</span>
                                    <span>${total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-end gap-8 font-bold text-slate-900 text-lg">
                                    <span>Total (Incl. 10% Tax)</span>
                                    <span>${(total * 1.1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <Save className="w-5 h-5" />
                                    {isEditMode ? 'Update Quote' : 'Create Quote'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default QuoteForm;