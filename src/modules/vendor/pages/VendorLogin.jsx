import React, { useState } from 'react';
import axios from 'axios';
import AuthLayout from '../../../layouts/AuthLayout';
import useAuthStore from '../../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Store, Loader2, AlertCircle } from 'lucide-react';

const VendorLogin = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState(location.state?.password || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/vendors/login`, { email, password });
      
      // Store user data in auth state (which is persistent)
      login(data, 'vendor');
      
      navigate('/vendor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Vendor Partner" subtitle="Manage your shop efficiently">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 text-xs font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Business Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-12"
              placeholder="shop@vendor.com"
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full group flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span>Login to Dashboard</span>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default VendorLogin;
