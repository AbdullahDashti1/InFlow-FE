import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import * as invoiceService from '../../services/invoiceService';
import * as quoteService from '../../services/quoteService';
import * as paymentService from '../../services/paymentService';

const InvoiceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(false);

    const selectedQuoteId = watch('quote_id');

    useEffect(() => {
        if (selectedQuoteId && !isEditMode) {
            // Ensure selectedQuoteId is a number for comparison if IDs are numbers
            const quote = quotes.find(q => q.id === parseInt(selectedQuoteId));
            if (quote) {
                setValue('title', quote.title);
            }
        }
    }, [selectedQuoteId, quotes, setValue, isEditMode]);

    useEffect(() => {
        fetchQuotes();
        if (isEditMode) {
            fetchInvoice();
        }
    }, [id]);

    const fetchQuotes = async () => {
        try {
            const data = await quoteService.index();
            setQuotes(data); // Showing all quotes for edit context
        } catch (err) {
            console.error(err);
        }
    };

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [invoicePayments, setInvoicePayments] = useState([]);

    const fetchInvoice = async () => {
        try {
            const data = await invoiceService.show(id);
            reset({
                ...data,
                quote_id: data.quote_id,
                due_date: data.due_date,
            });
            setInvoicePayments(data.payments || []);
        } catch (err) {
            console.error(err);
            navigate('/invoices');
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const amount = parseFloat(formData.get('amount'));
        const balance = watch('balance_due') || 0;

        if (amount > balance) {
            toast.error("Amount cannot exceed balance");
            return;
        }

        const paymentData = {
            amount: amount,
            method: formData.get('method'),
            reference: formData.get('reference'),
            payment_date: formData.get('payment_date') || new Date().toISOString()
        };

        try {
            await paymentService.create(id, paymentData);
            toast.success('Payment recorded');
            setIsPaymentModalOpen(false);
            fetchInvoice(); // Refresh data
        } catch (err) {
            toast.error(err.message || 'Failed to record payment');
        }
    };

    const handleDelete = async (paymentId) => {
        if (!window.confirm('Are you sure you want to cancel this payment?')) return;
        try {
            await paymentService.deletePayment(paymentId);
            toast.success('Payment canceled');
            fetchInvoice();
        } catch (err) {
            toast.error('Failed to cancel payment');
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (isEditMode) {
                await invoiceService.update(id, data);
            } else {
                await invoiceService.create(data);
            }
            toast.success(`Invoice ${isEditMode ? 'updated' : 'generated'} successfully`);
            navigate('/invoices');
        } catch (err) {
            console.error(err);
            toast.error(err.message || `Failed to ${isEditMode ? 'update' : 'create'} invoice`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/invoices')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Invoices
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">{isEditMode ? 'Edit Invoice' : 'Create Invoice'}</h1>
                    {isEditMode && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${watch('balance_due') === 0 ? 'bg-emerald-100 text-emerald-700' :
                            watch('balance_due') < watch('total') ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                            Balance: ${watch('balance_due')?.toLocaleString() ?? '0.00'}
                        </span>
                    )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">From Quote</label>
                        <select
                            {...register('quote_id', { required: 'Quote is required' })}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none bg-white"
                        >
                            <option value="">Select a quote</option>
                            {quotes.map(quote => (
                                <option key={quote.id} value={quote.id}>
                                    #{quote.id} - {quote.title} - ${quote.total} ({new Date(quote.created_at).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                        {errors.quote_id && <p className="mt-1 text-xs text-red-500">{errors.quote_id.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Invoice Title</label>
                        <input
                            {...register('title', { required: 'Title is required' })}
                            placeholder="e.g. Project Milestone 1"
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none"
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                        <input
                            type="date"
                            {...register('due_date', { required: 'Due date is required' })}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none"
                        />
                        {errors.due_date && <p className="mt-1 text-xs text-red-500">{errors.due_date.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <Save className="w-5 h-5" />
                                {isEditMode ? 'Update Invoice' : 'Generate Invoice'}
                            </>
                        )}
                    </button>
                </form>

                {isEditMode && (
                    <div className="mt-12 border-t border-slate-100 pt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Payment History</h2>
                            <button
                                type="button"
                                onClick={() => setIsPaymentModalOpen(true)}
                                className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                Record Payment
                            </button>
                        </div>

                        <div className="overflow-hidden border border-slate-200 rounded-lg">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-700 font-semibold">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Method</th>
                                        <th className="px-4 py-3">Reference</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {invoicePayments.length > 0 ? invoicePayments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="px-4 py-3">{new Date(payment.paid_at).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 capitalize">{payment.method}</td>
                                            <td className="px-4 py-3 text-slate-500">{payment.reference || '-'}</td>
                                            <td className="px-4 py-3 text-right font-medium">${payment.amount.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => handleDelete(payment.id)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Cancel Payment"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-3 text-center text-slate-500">No payments recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Record Payment</h3>
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                                <input
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    max={watch('balance_due')}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="0.00"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Max: ${(watch('balance_due') || 0).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Date</label>
                                <input
                                    name="payment_date"
                                    type="date"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                                <select name="method" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="cash">Cash</option>
                                    <option value="check">Check</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reference No.</label>
                                <input
                                    name="reference"
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g. TXN-12345"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                                >
                                    Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceForm;