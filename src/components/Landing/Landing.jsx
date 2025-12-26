import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, DollarSign, PieChart, Shield, User } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-2 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900">InFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/sign-in" className="text-slate-600 hover:text-slate-900 font-medium">
              Sign In
            </Link>
            <Link to="/sign-up" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <div className="relative overflow-hidden py-20 sm:py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Simplify Your Business <br className="hidden sm:block" />
              <span className="text-primary">Finances & Invoicing</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Create professional quotes, track invoices, and manage client relationships — all in one place. Built for freelancers and growing teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/sign-up" className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-primary text-white font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25">
                Start for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/sign-in" className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-lg hover:bg-slate-50 transition-colors">
                Coming Back? Sign In
              </Link>
            </div>
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Everything you need to grow</h2>
              <p className="mt-4 text-slate-500">Powerful features to help you get paid faster.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Invoicing</h3>
                <p className="text-slate-600">Create beautiful, branded invoices in seconds. Convert approved quotes to invoices with one click.</p>
              </div>
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
                  <PieChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Financial Insights</h3>
                <p className="text-slate-600">Track revenue, outstanding balances, and client value with real-time analytics dashboards.</p>
              </div>
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Multi-User</h3>
                <p className="text-slate-600">Role-based access control for your entire team.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;