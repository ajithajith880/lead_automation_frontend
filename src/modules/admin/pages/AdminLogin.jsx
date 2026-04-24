import React from 'react';
import AuthLayout from '../../../layouts/AuthLayout';
import useAuthStore from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('admin@example.com');
  const [password, setPassword] = React.useState('password');

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ name: 'Super Admin', email }, 'admin');
    navigate('/admin/dashboard');
  };

  return (
    <AuthLayout title="Admin" subtitle="Welcome back">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-12"
              placeholder="admin@hub.com"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-12"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full group flex items-center justify-center gap-2 mt-4">
          <span>Sign In</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

      

        {/* <button 
          type="button"
          onClick={() => navigate('/vendor/login')} 
          className="w-full py-3 rounded-xl border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm"
        >
          Vendor Portal
        </button> */}
      </form>
    </AuthLayout>
  );
};

export default AdminLogin;
