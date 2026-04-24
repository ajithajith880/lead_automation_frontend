import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
  BarChart3,
  MessageSquare,
  Zap,
  Users,
  MousePointer2,
  BrainCircuit,
  ArrowUpRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const menuItems = [
    { label: 'AI Dashboard', icon: BarChart3, path: '/vendor/dashboard', onClick: () => navigate('/vendor/dashboard') },
    { label: 'AI Training', icon: BrainCircuit, path: '/vendor/ai-training', onClick: () => navigate('/vendor/ai-training') },
    { label: 'Automation Rules', icon: Zap, path: '/vendor/rules', onClick: () => navigate('/vendor/rules') },
    { label: 'Leads', icon: Users, path: '/vendor/leads', onClick: () => navigate('/vendor/leads') },
  ];

  const stats = [
    { label: 'Total AI Replies', value: '12,482', trend: '+14%', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Automations', value: '24', trend: 'Healthy', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'New Leads (AI)', value: '843', trend: '+22%', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Completion Rate', value: '98.2%', trend: '+0.5%', icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <DashboardLayout role="vendor" menuItems={menuItems}>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome, {user?.businessName || 'Partner'}!</h1>
        <p className="text-sm text-slate-500 font-medium">Monitoring WhatsApp automation and AI response performance for {user?.email}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
              <span className={`text-[10px] font-bold ${idx === 1 ? 'text-blue-500' : 'text-emerald-600'}`}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Hourly Automation Traffic</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded border border-slate-100 text-[10px] font-bold text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                AI Replies
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded border border-slate-100 text-[10px] font-bold text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Lead Created
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 60, 45, 90, 65, 80, 55, 70, 85, 50, 95, 75].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-blue-500/10 rounded-t-md relative group">
                  <div
                    className="absolute bottom-0 w-full bg-blue-500 rounded-t-md transition-all duration-300 group-hover:bg-blue-600"
                    style={{ height: `${h}%` }}
                  />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[8px] px-1.5 py-0.5 rounded transition-opacity">
                    {h}
                  </div>
                </div>
                <span className="text-[8px] font-bold text-slate-400">{i * 2}h</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Active AI Flows</h2>
          <div className="space-y-4">
            {[
              { name: 'Customer Onboarding', time: '2m ago', active: true },
              { name: 'Discount Inquiry', time: '14m ago', active: true },
              { name: 'Order Support', time: '1h ago', active: false },
              { name: 'Lead Qualifier', time: 'Just now', active: true },
            ].map((flow, i) => (
              <div key={i} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${flow.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{flow.name}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {flow.time}
                    </p>
                  </div>
                </div>
                <MousePointer2 className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/vendor/flow-builder')} />
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/vendor/ai-training')}
            className="w-full mt-6 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-md"
          >
            Manage AI Training
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;
