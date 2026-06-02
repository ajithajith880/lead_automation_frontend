import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { LayoutDashboard, Users, ShoppingBag, CreditCard, Search, Download, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminSubscriptionList = () => {
  const navigate = useNavigate();
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', onClick: () => navigate('/admin/dashboard') },
    { label: 'Vendors', icon: ShoppingBag, path: '/admin/vendors', onClick: () => navigate('/admin/vendors') },
    { label: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions', onClick: () => navigate('/admin/subscriptions') },
    // { label: 'Users', icon: Users, path: '/admin/users', onClick: () => { } },
  ];

  const subscriptions = [
    { vendor: 'Modern Mart', plan: 'Enterprise', amount: '$499.00', date: 'Oct 20, 2023', status: 'active', color: 'indigo' },
    { vendor: 'Tech Zone', plan: 'Basic', amount: '$99.00', date: 'Oct 19, 2023', status: 'expired', color: 'slate' },
    { vendor: 'Green Grocery', plan: 'Premium', amount: '$299.00', date: 'Oct 18, 2023', status: 'active', color: 'emerald' },
    { vendor: 'Fashion Hub', plan: 'Premium', amount: '$299.00', date: 'Oct 17, 2023', status: 'pending', color: 'amber' },
    { vendor: 'Sports World', plan: 'Basic', amount: '$99.00', date: 'Oct 16, 2023', status: 'active', color: 'emerald' },
  ];

  return (
    <DashboardLayout role="admin" menuItems={menuItems}>
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Subscription Tracks</h1>
          <p className="text-sm text-slate-500 font-medium">Monitor billing cycles and plan distributions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Active</p>
          <p className="text-lg font-bold text-slate-900">124</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Renewals</p>
          <p className="text-lg font-bold text-slate-900">18</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pending</p>
          <p className="text-lg font-bold text-slate-900">5</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Monthly MRR</p>
          <p className="text-lg font-bold text-primary">$12,450</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                <th className="py-4 px-6">Transaction ID</th>
                <th className="py-4 px-6">Vendor</th>
                <th className="py-4 px-6">Plan Name</th>
                <th className="py-4 px-6 italic">Payment Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...Array(8)].map((_, i) => {
                const sub = subscriptions[i % subscriptions.length];
                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="text-xs font-mono font-medium text-slate-400">#TRX-8292-{i}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-slate-800">{sub.vendor}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-${sub.color}-500`} />
                        <span className="text-xs font-semibold text-slate-600">{sub.plan}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 italic text-xs text-slate-500">{sub.date}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border
                        ${sub.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          sub.status === 'expired' ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-amber-50 text-amber-700 border-amber-100'}`}>
                        {sub.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : sub.status === 'expired' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {sub.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-black text-sm text-slate-900">{sub.amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSubscriptionList;
