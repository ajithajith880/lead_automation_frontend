import React, { useState, useEffect } from "react";
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
    Search,
    Filter,
    Plus,
    ChevronDown,
    Upload,
    X,
    Check,
    Eye,
    User,
    Download,
    CheckCircle2,
    Loader2,
    AlertCircle,
    BarChart3,
    BrainCircuit,
    Zap,
    Users,
    Phone,
    MessageSquare,
    ArrowUpRight,
    MoreHorizontal,
    Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URI = `${import.meta.env.VITE_API_URL}/`;
const VENDOR_ID = localStorage.getItem('vendor_id');
const USER_ID = localStorage.getItem('user_id');

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const STATUS_COLORS = [
    "210 80% 56%",
    "262 80% 60%",
    "35 95% 55%",
    "280 70% 60%",
    "16 85% 55%",
    "142 70% 45%",
    "190 80% 45%",
    "330 75% 55%",
];

function getStatusColor(status, allStatuses) {
    const idx = allStatuses.indexOf(status);
    return STATUS_COLORS[idx % STATUS_COLORS.length] || "210 80% 56%";
}

function getStatusStyle(status, allStatuses) {
    const c = getStatusColor(status, allStatuses);
    return {
        background: `hsl(${c} / 0.15)`,
        color: `hsl(${c})`,
        border: `1px solid hsl(${c} / 0.35)`,
    };
}

function sourcePill(source) {
    const src = (source || "").toLowerCase();
    if (src.includes("facebook")) return { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe", label: "Facebook" };
    if (src.includes("website")) return { bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe", label: "Website" };
    if (src.includes("whatsapp")) return { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "WhatsApp" };
    return { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb", label: source || "Direct" };
}

function priorityBadge(priority) {
    const p = (priority || "").toLowerCase();
    if (p === "high" || p === "hot") return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
    if (p === "low" || p === "cold") return { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" };
    if (p === "medium" || p === "warm") return { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" };
    return { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
}

function mapLead(item) {
    return {
        id: item._id,
        name: (item.first_name + ' ' + (item.last_name || '')).trim() || "User",
        email: item.email || "—",
        phone: item.phone_number ? "+" + item.phone_number : "—",
        source: item.source || "Direct",
        status: item.status || "New Lead",
        priority: item.priority || "Medium",
        priority_score: item.priority_score || 0,
        agentName: item.agentName || "Admin User",
        createdAt: item.createdAt || null,
    };
}

// ─── MODAL COMPONENTS ────────────────────────────────────────────────────────

function ModalOverlay({ onClose, children }) {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(17,24,39,0.45)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                style={{ boxShadow: "0px 20px 60px rgba(0,0,0,0.18)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

function ModalHeader({ title, onClose }) {
    return (
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: "#E5E7EB" }}>
            <h2 className="text-base font-bold text-[#111827]">{title}</h2>
            <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151] transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

const VendorLeads = () => {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [columns, setColumns] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddLead, setShowAddLead] = useState(false);
    const [showAddStage, setShowAddStage] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const [toast, setToast] = useState(null);

    const menuItems = [
        { label: 'AI Dashboard', icon: BarChart3, path: '/vendor/dashboard', onClick: () => navigate('/vendor/dashboard') },
        { label: 'AI Training', icon: BrainCircuit, path: '/vendor/ai-training', onClick: () => navigate('/vendor/ai-training') },
        { label: 'Automation Rules', icon: Zap, path: '/vendor/rules', onClick: () => navigate('/vendor/rules') },
        { label: 'Leads', icon: Users, path: '/vendor/leads', onClick: () => navigate('/vendor/leads') },
    ];

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URI}leads`);
            if (!res.ok) throw new Error("Failed to fetch leads");
            const data = await res.json();
            setLeads(data.map(mapLead));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStages = async () => {
        try {
            const res = await fetch(`${BASE_URI}stages`);
            if (!res.ok) throw new Error("Failed to fetch stages");
            const data = await res.json();
            setColumns(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteLead = async () => {
        if (!leadToDelete) return;
        try {
            const res = await fetch(`${BASE_URI}leads/${leadToDelete.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setToast("Lead deleted successfully!");
                setTimeout(() => setToast(null), 3000);
                fetchLeads();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setShowDeleteConfirm(false);
            setLeadToDelete(null);
        }
    };

    useEffect(() => {
        fetchLeads();
        fetchStages();
    }, []);

    const filteredLeads = leads.filter(lead => {
        const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;
        const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             lead.phone.includes(searchQuery) ||
                             lead.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesPriority && matchesSearch;
    });

    const allStatusNames = columns.map(c => c.name);

    return (
        <DashboardLayout role="vendor" menuItems={menuItems}>
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lead Automation</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowAddStage(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-900 rounded-lg text-sm font-bold border border-slate-200 hover:bg-slate-200 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Stage</span>
                    </button>
                    <button 
                        onClick={() => setShowAddLead(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Lead</span>
                    </button>
                </div>
            </header>


            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setStatusFilter("all")}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                statusFilter === "all" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                            }`}
                        >
                            All Leads
                        </button>
                        {columns.map(col => (
                            <button
                                key={col.id}
                                onClick={() => setStatusFilter(col.name)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                    statusFilter === col.name ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                }`}
                            >
                                {col.name}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search Name, Phone..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all w-64" 
                            />
                        </div>
                    </div>
                </div>
                
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                                <th className="py-4 px-6 w-16">#</th>
                                <th className="py-4 px-6">Lead Details</th>
                                <th className="py-4 px-6">Source</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6">Priority</th>
                                <th className="py-4 px-6">Assigned To</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="py-8 px-6">
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="w-10 h-10 text-slate-200" />
                                            <p className="text-sm font-medium text-slate-400">No leads found matching your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLeads.map((lead, index) => {
                                const src = sourcePill(lead.source);
                                const pb = priorityBadge(lead.priority);
                                return (
                                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="py-4 px-6 text-xs font-bold text-slate-400">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-bold text-slate-800">{lead.name}</p>
                                                <p className="text-[10px] text-slate-500 font-medium">{lead.phone}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{ background: src.bg, color: src.color, border: `1px solid ${src.border}` }}>
                                                {src.label}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold" style={getStatusStyle(lead.status, allStatusNames)}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{ background: pb.bg, color: pb.color, border: `1px solid ${pb.border}` }}>
                                                    {lead.priority}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-400 ml-1">Score: {lead.priority_score}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-[8px] text-white font-bold">
                                                    {lead.agentName.charAt(0)}
                                                </div>
                                                <span className="text-xs font-bold text-slate-700">{lead.agentName}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2 text-[10px]">
                                                <button 
                                                    onClick={() => navigate(`/vendor/leads/${lead.id}`)}
                                                    className="p-2 bg-slate-50 hover:bg-slate-200 rounded-lg text-slate-500 transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => { setLeadToDelete(lead); setShowDeleteConfirm(true); }}
                                                    className="p-2 bg-slate-50 hover:bg-rose-50 rounded-lg text-slate-500 hover:text-rose-600 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {showAddLead && (
                <ModalOverlay onClose={() => setShowAddLead(false)}>
                    <ModalHeader title="Add New Lead" onClose={() => setShowAddLead(false)} />
                    <AddLeadForm onSave={() => { fetchLeads(); setShowAddLead(false); setToast("Lead added successfully!"); setTimeout(() => setToast(null), 3000); }} onClose={() => setShowAddLead(false)} columns={allStatusNames} />
                </ModalOverlay>
            )}

            {showAddStage && (
                <ModalOverlay onClose={() => setShowAddStage(false)}>
                    <ModalHeader title="Add New Stage" onClose={() => setShowAddStage(false)} />
                    <AddStageForm onSave={() => { fetchStages(); setShowAddStage(false); setToast("Stage added successfully!"); setTimeout(() => setToast(null), 3000); }} onClose={() => setShowAddStage(false)} />
                </ModalOverlay>
            )}

            {showDeleteConfirm && (
                <ModalOverlay onClose={() => setShowDeleteConfirm(false)}>
                    <ModalHeader title="Delete Lead" onClose={() => setShowDeleteConfirm(false)} />
                    <div className="p-8 space-y-6">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
                                <p className="text-sm text-slate-500 mt-1">Are you sure you want to delete <span className="font-bold text-slate-800">{leadToDelete?.name}</span>? This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                            <button onClick={handleDeleteLead} className="flex-1 py-3 bg-rose-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all transition-transform active:scale-95">Delete Lead</button>
                        </div>
                    </div>
                </ModalOverlay>
            )}

            {toast && (
                <div className="fixed bottom-6 right-6 z-[200] animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900 text-white shadow-2xl">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-bold">{toast}</span>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

// Simplified Add Lead Form
function AddLeadForm({ onSave, onClose, columns }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        source: 'Direct',
        status: 'New Lead',
        priority_score: 45
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URI}leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) onSave();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">First Name</label>
                    <input required className="w-full px-4 py-2 border rounded-lg text-sm" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Last Name</label>
                    <input className="w-full px-4 py-2 border rounded-lg text-sm" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                <input required className="w-full px-4 py-2 border rounded-lg text-sm" value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                    <select className="w-full px-4 py-2 border rounded-lg text-sm bg-white" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                        {columns.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Priority Score (1-100)</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            min="1" 
                            max="100"
                            required 
                            className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:border-indigo-500" 
                            value={formData.priority_score} 
                            onChange={(e) => setFormData({...formData, priority_score: e.target.value})} 
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold">
                            {formData.priority_score <= 30 ? <span className="text-emerald-600">Low</span> : 
                             formData.priority_score <= 60 ? <span className="text-amber-600">Medium</span> : 
                             <span className="text-rose-600">High</span>}
                        </div>
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium">1-30: Low | 31-60: Medium | 61+: High</p>
                </div>
            </div>
            <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50">
                    {loading ? 'Adding...' : 'Save Lead'}
                </button>
            </div>
        </form>
    );
}

function AddStageForm({ onSave, onClose }) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URI}stages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            if (res.ok) onSave();
            else {
                const data = await res.json();
                alert(data.message || "Failed to add stage");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Stage Name</label>
                <input 
                    required 
                    placeholder="e.g. In Progress, Follow Up"
                    className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:border-indigo-500" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
            </div>
            <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50">
                    {loading ? 'Adding...' : 'Save Stage'}
                </button>
            </div>
        </form>
    );
}

export default VendorLeads;
