import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { LayoutDashboard, Users, ShoppingBag, CreditCard, Search, Filter, MoreVertical, ExternalLink, Mail, Phone, LogIn, Loader2, Plus, X, Building2, Briefcase, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminVendorList = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    category: 'Electronics',
    password: ''
  });

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/vendors`);
      setVendors(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Failed to load vendors. Please ensure the backend is running.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleCreateVendor = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/vendors`, formData);
      setIsModalOpen(false);
      setFormData({ businessName: '', email: '', phone: '', category: 'Electronics', password: '' });
      fetchVendors(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create vendor');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/vendors/${id}/status`, { status: newStatus });
      setVendors(vendors.map(v => v._id === id ? { ...v, status: newStatus } : v));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', onClick: () => navigate('/admin/dashboard') },
    { label: 'Vendors', icon: ShoppingBag, path: '/admin/vendors', onClick: () => navigate('/admin/vendors') },
    { label: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions', onClick: () => navigate('/admin/subscriptions') },
    // { label: 'Users', icon: Users, path: '/admin/users', onClick: () => { } },
  ];

  return (
    <DashboardLayout role="admin" menuItems={menuItems}>
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vendor Management</h1>
          <p className="text-sm text-slate-500 font-medium">View and manage all registered vendor partners</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search vendors..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary transition-all w-64 shadow-sm" />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Vendor</span>
          </button>
        </div>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Loading vendors...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-sm text-red-500 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-xs font-bold text-primary underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                  <th className="py-4 px-6">Vendor Name & ID</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center text-slate-400 text-sm italic">
                      No vendors found in the database.
                    </td>
                  </tr>
                ) : (
                  vendors.map((vendor) => (
                    <tr key={vendor._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary italic shadow-inner">
                            {vendor.businessName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{vendor.businessName}</p>
                            <p className="text-[10px] text-slate-400 font-medium lowercase">ID: {vendor._id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <Mail className="w-3 h-3" />
                            <span>{vendor.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <Phone className="w-3 h-3" />
                            <span>{vendor.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <select
                          value={vendor.status}
                          onChange={(e) => handleStatusChange(vendor._id, e.target.value)}
                          className={`appearance-none cursor-pointer px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border outline-none transition-all ${vendor.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                            : vendor.status === 'inactive'
                              ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
                              : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'
                            }`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                        {new Date(vendor.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => navigate('/vendor/login', { state: { email: vendor.email, password: vendor.password } })}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-primary hover:text-white text-slate-600 rounded-md text-[10px] font-bold transition-all"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Login</span>
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Showing {vendors.length} vendors</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-primary text-white rounded text-[10px] font-bold shadow-sm">Next</button>
          </div>
        </div>
      </div>

      {/* Create Vendor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 leading-tight">Create New Vendor</h2>
                      <p className="text-xs text-slate-500 font-medium">Add a new partner to the platform</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateVendor} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Business Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g. Master Electronics"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Email Address</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@shop.com"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Phone Number</label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 00000 00000"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Initial Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Business Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Services">Services</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isRegistering}
                      type="submit"
                      className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <span>Create Vendor</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default AdminVendorList;
