import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as analyticsService from '../../services/analyticsService';
import * as quoteService from '../../services/quoteService';

import {
    DollarSign,
    TrendingUp,
    AlertCircle,
    Briefcase,
    PieChart
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, subtext }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <DollarSign className="w-6 h-6" />
            </div>
        </div>
        {subtext && <p className="text-xs text-slate-400 mt-4">{subtext}</p>}
    </div>
);

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [stats, setStats] = useState(null);
    const [pipelineStats, setPipelineStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsData, quotesData] = await Promise.all([
                    analyticsService.getSummary(),
                    user?.role === 'owner' ? quoteService.index() : Promise.resolve([])
                ]);

                setStats(analyticsData);

                if (user?.role === 'owner') {
                    // quotesData is now the data array, not response object
                    const quotes = quotesData;
                    const draftValue = quotes
                        .filter(q => q.status === 'Draft')
                        .reduce((sum, q) => sum + (q.total || 0), 0);
                    const sentCount = quotes.filter(q => q.status === 'Sent').length;

                    // Calculate YTD Revenue from analytics
                    const ytdRevenue = analyticsData.revenue_by_month.reduce((sum, m) => sum + m.total, 0);

                    setPipelineStats({
                        draftValue,
                        sentCount,
                        ytdRevenue
                    });
                }
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">
                    {user?.role === 'owner' ? 'Executive Overview & Performance' : 'Overview of your business performance'}
                </p>
            </div>

            {user?.role === 'owner' && pipelineStats && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Executive Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="YTD Revenue"
                            value={`$${pipelineStats.ytdRevenue.toLocaleString()}`}
                            icon={PieChart}
                            colorClass="bg-purple-50 text-purple-600"
                            subtext="Total revenue this year"
                        />
                        <StatCard
                            title="Pipeline Value (Drafts)"
                            value={`$${pipelineStats.draftValue.toLocaleString()}`}
                            icon={Briefcase}
                            colorClass="bg-indigo-50 text-indigo-600"
                            subtext="Potential revenue"
                        />
                        <StatCard
                            title="Active Deals (Sent)"
                            value={pipelineStats.sentCount}
                            icon={TrendingUp}
                            colorClass="bg-orange-50 text-orange-600"
                            subtext="Quotes awaiting approval"
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Revenue This Month"
                    value={`$${stats?.total_revenue_this_month?.toLocaleString() || '0'}`}
                    icon={DollarSign}
                    colorClass="bg-emerald-50 text-emerald-600"
                    subtext="Total payments received"
                />
                <StatCard
                    title="Outstanding Balance"
                    value={`$${stats?.total_outstanding?.toLocaleString() || '0'}`}
                    icon={TrendingUp}
                    colorClass="bg-blue-50 text-blue-600"
                    subtext="Pending payments"
                />
                <StatCard
                    title="Overdue Invoices"
                    value={stats?.overdue_count || 0}
                    icon={AlertCircle}
                    colorClass="bg-rose-50 text-rose-600"
                    subtext="Action needed"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue by Month</h3>
                    {stats?.revenue_by_month?.length > 0 ? (
                        <div className="space-y-4">
                            {stats.revenue_by_month.map((item) => (
                                <div key={item.month} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                    <span className="font-medium text-slate-700">{item.month}</span>
                                    <span className="font-bold text-slate-900">${item.total.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm">No revenue data available</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Top Clients by Revenue</h3>
                    {stats?.revenue_by_client?.length > 0 ? (
                        <div className="space-y-4">
                            {stats.revenue_by_client.slice(0, 5).map((item) => (
                                <div key={item.client} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                    <span className="font-medium text-slate-700">{item.client}</span>
                                    <span className="font-bold text-slate-900">${item.total.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm">No client data available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;