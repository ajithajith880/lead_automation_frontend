import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { LayoutDashboard, Users, ShoppingBag, BarChart3, TrendingUp, MoreHorizontal, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', onClick: () => navigate('/admin/dashboard') },
    { label: 'Vendors', icon: ShoppingBag, path: '/admin/vendors', onClick: () => navigate('/admin/vendors') },
    { label: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions', onClick: () => navigate('/admin/subscriptions') },
    // { label: 'Users', icon: Users, path: '/admin/users', onClick: () => { } },
  ];

  const stats = [
    { label: 'Revenue', value: '$124,592.00', trend: '+12.5%', isUp: true, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'New Vendors', value: '1,240', trend: '+18.2%', isUp: true, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Vendors', value: '432', trend: '-2.4%', isUp: false, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Active Subscriptions', value: '894', trend: '+4.3%', isUp: true, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <DashboardLayout role="admin" menuItems={menuItems}>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-sm text-slate-500 font-medium">Real-time performance metrics and management</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
                <div className={`flex items-center text-xs font-bold ${stat.isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {stat.trend}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h2 className="text-sm font-bold text-slate-800">Recent Subscription List</h2>
          <button onClick={() => navigate('/admin/subscriptions')} className="text-xs font-bold text-primary hover:underline">View All Subscriptions</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="py-3 px-6 border-b border-slate-100">Vendor</th>
                <th className="py-3 px-6 border-b border-slate-100">Plan</th>
                <th className="py-3 px-6 border-b border-slate-100 italic">Start Date</th>
                <th className="py-3 px-6 border-b border-slate-100">Status</th>
                <th className="py-3 px-6 border-b border-slate-100 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-[10px]">V{i}</div>
                      <p className="text-sm font-bold text-slate-800">Vendor Shop {i}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${i % 2 === 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                      {i % 2 === 0 ? 'Premium Plan' : 'Standard Plan'}
                    </span>
                  </td>
                  <td className="py-4 px-6 italic text-xs text-slate-500">Oct {10 + i}, 2023</td>
                  <td className="py-4 px-6">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-sm text-slate-900">$299.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
