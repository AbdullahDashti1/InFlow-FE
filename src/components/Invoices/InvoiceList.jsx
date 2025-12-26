import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Download, CreditCard, CheckCircle, X, Edit, History, Trash2 } from 'lucide-react';
import * as invoiceService from '../../services/invoiceService';
import * as paymentService from '../../services/paymentService';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const PaymentManagerModal = ({ invoice, onClose, onUpdate }) => {
    const [payments, setPayments] = useState(invoice.payments || []);
    const [editingPayment, setEditingPayment] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form for adding/editing payment
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            amount: invoice.balance_due,
            payment_date: new Date().toISOString().split('T')[0],
            payment_method: 'bank_transfer'
        }
    });

    useEffect(() => {
        fetchPayments();
    }, [invoice.id]);

    const fetchPayments = async () => {
        try {
            const data = await invoiceService.show(invoice.id);
            setPayments(data.payments || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load payments');
        }
    }

    useEffect(() => {
        if (editingPayment) {
            setValue('amount', editingPayment.amount);
            setValue('payment_date', editingPayment.paid_at ? editingPayment.paid_at.split('T')[0] : '');
            setValue('payment_method', editingPayment.method);
            setValue('reference_number', editingPayment.reference);
        } else {
            reset({
                amount: invoice.balance_due > 0 ? invoice.balance_due : 0,
                payment_date: new Date().toISOString().split('T')[0],
                payment_method: 'bank_transfer',
                reference_number: ''
            });
        }
    }, [editingPayment, setValue, reset, invoice.balance_due]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (editingPayment) {
                await paymentService.update(editingPayment.id, {
                    amount: parseFloat(data.amount),
                    payment_date: data.payment_date,
                    method: data.payment_method,
                    reference: data.reference_number
                });
                toast.success('Payment updated successfully');
            } else {
                await paymentService.create(invoice.id, {
                    amount: parseFloat(data.amount),
                    payment_date: data.payment_date,
                    method: data.payment_method,
                    reference: data.reference_number
                });
                toast.success('Payment recorded successfully');
            }
            await fetchPayments();
            onUpdate(); // Refresh parent list
            setEditingPayment(null); // Reset form mode
        } catch (err) {
            console.error(err);
            // Display backend error message if available (e.g. balance exceeded)
            toast.error(err.message || (editingPayment ? 'Failed to update payment' : 'Failed to record payment'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (paymentId) => {
        if (!window.confirm('Are you sure you want to cancel this payment?')) return;
        try {
            await paymentService.deletePayment(paymentId);
            toast.success('Payment canceled');
            fetchPayments();
            onUpdate();
        } catch (err) {
            console.error(err);
            toast.error('Failed to cancel payment');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Manage Payments - {invoice.invoice_number}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Form */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">{editingPayment ? 'Edit Payment' : 'Record New Payment'}</h3>
                        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                            <p className="text-xs text-slate-500">Current Balance Due</p>
                            <p className="text-xl font-bold text-slate-900">${invoice.balance_due.toLocaleString()}</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('amount', {
                                        required: 'Amount is required',
                                        validate: (value) => {
                                            const max = editingPayment ? (invoice.balance_due + editingPayment.amount) : invoice.balance_due;
                                            return parseFloat(value) <= max || 'Amount cannot exceed balance';
                                        }
                                    })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                                {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Date</label>
                                <input
                                    type="date"
                                    {...register('payment_date', { required: true })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                                <select
                                    {...register('payment_method', { required: true })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                                >
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="check">Check</option>
                                    <option value="cash">Cash</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reference (Optional)</label>
                                <input
                                    {...register('reference_number')}
                                    placeholder="e.g. Check #123"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg transition-colors"
                                >
                                    {loading ? 'Saving...' : (editingPayment ? 'Update Payment' : 'Record Payment')}
                                </button>
                                {editingPayment && (
                                    <button
                                        type="button"
                                        onClick={() => setEditingPayment(null)}
                                        className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Right: History */}
                    <div className="border-l border-slate-100 pl-8 hidden md:block">
                        <h3 className="font-semibold text-slate-900 mb-4">Payment History</h3>
                        <div className="space-y-3">
                            {payments.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No payments recorded yet.</p>
                            ) : (
                                payments.map(payment => (
                                    <div key={payment.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm hover:border-primary/30 transition-colors group">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-slate-900">${payment.amount.toLocaleString()}</span>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditingPayment(payment)}
                                                    className="text-primary hover:text-primary/80"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(payment.id)}
                                                    className="text-red-500 hover:text-red-600"
                                                    title="Cancel Payment"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>{new Date(payment.paid_at).toLocaleDateString()}</span>
                                            <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                                        </div>
                                        {payment.reference && (
                                            <div className="mt-1 text-xs text-slate-400">
                                                Ref: {payment.reference}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const data = await invoiceService.index();
            setInvoices(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch invoices');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this invoice?')) return;
        try {
            await invoiceService.deleteInvoice(id);
            toast.success('Invoice deleted');
            fetchInvoices();
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete invoice');
        }
    };

    const downloadPdf = async (id) => {
        try {
            const blob = await invoiceService.getPdf(id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error(err);
            toast.error('Failed to download PDF');
        }
    };

    const getStatusColor = (status, balance) => {
        if (balance === 0) return 'bg-emerald-100 text-emerald-700';
        if (status === 'overdue') return 'bg-red-100 text-red-700';
        return 'bg-blue-100 text-blue-700';
    };

    const filteredInvoices = invoices.filter(invoice =>
        invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.title && invoice.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="p-8 text-center text-slate-500">Loading invoices...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
                    <p className="text-slate-500 mt-1">Manage invoices and track payments</p>
                </div>
                <Link
                    to="/invoices/new"
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Invoice
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Invoice #</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Title</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Due Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Amount (Incl. 10% Tax)</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Balance</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{invoice.invoice_number}</td>
                                    <td className="px-6 py-4 text-slate-600">{invoice.title || '-'}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(invoice.due_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(invoice.status, invoice.balance_due))}>
                                            {invoice.balance_due === 0 ? 'Paid' : invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        ${invoice.total?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        ${invoice.balance_due?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => downloadPdf(invoice.id)}
                                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Download PDF"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => setSelectedInvoice(invoice)}
                                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Manage Payments"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                            </button>

                                            <Link
                                                to={`/invoices/${invoice.id}/edit`}
                                                className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                title="Edit Invoice"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(invoice.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Invoice"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredInvoices.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                                        No invoices found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedInvoice && (
                <PaymentManagerModal
                    invoice={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                    onUpdate={fetchInvoices}
                />
            )}
        </div>
    );
};

export default InvoiceList;