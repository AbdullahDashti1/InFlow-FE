import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FileText, Download, Send, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';
import * as quoteService from '../../services/quoteService';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const QuoteList = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const data = await quoteService.index();
            setQuotes(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load quotes');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quote?')) return;
        try {
            await quoteService.deleteQuote(id);
            toast.success('Quote deleted');
            fetchQuotes();
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete quote');
        }
    };

    const downloadPdf = async (id) => {
        try {
            const blob = await quoteService.getPdf(id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `quote_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error(err);
            toast.error('Failed to download PDF');
        }
    };

    const markSent = async (id) => {
        try {
            await quoteService.sendQuote(id);
            toast.success('Quote marked as sent');
            fetchQuotes();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'sent': return 'bg-blue-100 text-blue-700';
            case 'accepted': return 'bg-emerald-100 text-emerald-700';
            case 'draft': return 'bg-slate-100 text-slate-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const filteredQuotes = quotes.filter(quote =>
        quote.id.toString().includes(searchTerm) ||
        (quote.title && quote.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (quote.client && quote.client.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="p-8 text-center text-slate-500">Loading quotes...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Quotes</h1>
                    <p className="text-slate-500 mt-1">Create and manage quotes</p>
                </div>
                <Link
                    to="/quotes/new"
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Quote
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search quotes..."
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
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Quote #</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Title</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Client</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Total (Incl. 10% Tax)</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredQuotes.map((quote) => (
                                <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">#{quote.id}</td>
                                    <td className="px-6 py-4 text-slate-600">{quote.title || '-'}</td>
                                    <td className="px-6 py-4 text-slate-900 font-medium">{quote.client?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(quote.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx("px-2 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(quote.status))}>
                                            {quote.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        ${quote.total?.toLocaleString() || '0.00'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => downloadPdf(quote.id)}
                                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Download PDF"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            {quote.status.toLowerCase() === 'draft' && (
                                                <button
                                                    onClick={() => markSent(quote.id)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Mark as Sent"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            )}
                                            <Link
                                                to={`/quotes/${quote.id}/edit`}
                                                className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                title="Edit Quote"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(quote.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Quote"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredQuotes.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                                        No quotes found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QuoteList;