import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
    ChevronLeft,
    Phone,
    MessageSquare,
    MoreHorizontal,
    Tag,
    ChevronRight,
    User,
    Calendar,
    BarChart,
    AlertCircle,
    CheckCircle2,
    Plus,
    X,
    StickyNote
} from "lucide-react";

const BASE_URI = `${import.meta.env.VITE_API_URL}/`;

const LeadDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddNote, setShowAddNote] = useState(false);
    const [noteContent, setNoteContent] = useState("");
    const [showChangeStage, setShowChangeStage] = useState(false);
    const [selectedStage, setSelectedStage] = useState("");
    const [toast, setToast] = useState(null);
    const [updating, setUpdating] = useState(false);

    const menuItems = [
        { label: 'AI Dashboard', icon: BarChart, path: '/vendor/dashboard', onClick: () => navigate('/vendor/dashboard') },
        { label: 'Leads', icon: User, path: '/vendor/leads', onClick: () => navigate('/vendor/leads') },
    ];

    const updateLeadStatus = async () => {
        setUpdating(true);
        try {
            const res = await fetch(`${BASE_URI}leads/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: selectedStage })
            });
            if (res.ok) {
                const updated = await res.json();
                setLead(updated);
                setToast("Stage updated successfully!");
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
            setShowChangeStage(false);
        }
    };

    const handleSaveNote = async () => {
        if (!noteContent.trim()) return;
        setUpdating(true);
        try {
            const userName = localStorage.getItem('user_name') || 'Agent';
            const res = await fetch(`${BASE_URI}leads/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    notes: [...(lead.notes || []), { name: userName, content: noteContent }] 
                })
            });
            if (res.ok) {
                const updated = await res.json();
                setLead(updated);
                setNoteContent("");
                setShowAddNote(false);
                setToast("Note added successfully!");
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leadRes, stageRes] = await Promise.all([
                    fetch(`${BASE_URI}leads`), // Fetching all and filtering for simplicity
                    fetch(`${BASE_URI}stages`)
                ]);
                const leads = await leadRes.json();
                const foundLead = leads.find(l => l._id === id);
                setLead(foundLead);
                setStages(await stageRes.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="flex items-center justify-center h-screen">Loading Lead Details...</div>;
    if (!lead) return <div className="p-10 text-center">Lead not found. <button onClick={() => navigate('/vendor/leads')} className="text-indigo-600 font-bold underline ml-2">Go Back</button></div>;

    return (
        <DashboardLayout role="vendor" menuItems={menuItems} hideSidebar={true} hideHeader={true}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/vendor/leads')} className="p-2 hover:bg-slate-100 rounded-lg transition-all flex items-center gap-2 text-slate-500 text-sm font-bold">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Leads
                    </button>
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                        {lead.first_name?.[0]}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900">{lead.first_name} {lead.last_name || ''}</h1>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold flex items-center gap-1 border border-indigo-100">
                                <MessageSquare className="w-3 h-3" />
                                {lead.source}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{lead.phone_number}</p>
                    </div>
                </div>
                {/* <div className="flex gap-2">
                    <button className="px-4 py-2 border rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Tags
                    </button>
                    <button className="px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm hover:opacity-90">
                        <MessageSquare className="w-4 h-4" />
                        WhatsApp
                    </button>
                </div> */}
            </div>

            {/* Stage Pipeline */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {stages.map((stage, idx) => (
                    <React.Fragment key={stage._id || idx}>
                        <div className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all flex items-center gap-2 ${
                            lead.status === stage.name ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100 scale-105' : 'bg-slate-50 text-slate-400 border border-slate-100'
                        }`}>
                            {lead.status === stage.name && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {stage.name}
                        </div>
                        {idx < stages.length - 1 && <ChevronRight className="w-4 h-4 text-slate-200 flex-shrink-0" />}
                    </React.Fragment>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Sidebar - Lead Snapshot */}
                <div className="col-span-12 lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
                            <BarChart className="w-4 h-4 text-indigo-600" />
                            <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Lead Snapshot</h2>
                        </div>
                        <div className="p-4 space-y-5">
                            {[
                                { label: 'Current Stage', val: lead.status, color: 'text-indigo-600' },
                                { label: 'Assigned Agent', val: lead.agentName || 'Unassigned' },
                                { label: 'Lead Source', val: lead.source },
                                { label: 'Lead Age', val: '4/17/2026' }, // Placeholder
                                { label: 'Lead Score', val: `+${lead.priority_score || 0}`, weight: 'bold' },
                                { label: 'Last Activity', val: '—' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</span>
                                    <span className={`text-xs font-bold ${item.color || 'text-slate-800'}`}>{item.val}</span>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-slate-50 space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Priority</label>
                                    <select 
                                        disabled
                                        value={lead.priority}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none cursor-not-allowed opacity-75"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <button 
                                    onClick={() => { setSelectedStage(lead.status); setShowChangeStage(true); }}
                                    className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                                >
                                    Change Stage
                                </button>
                                {/* <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">Reassign</button> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content - Tabs */}
                <div className="col-span-12 lg:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                    <div className="bg-slate-50/50 border-b border-slate-100 flex items-center justify-between px-4">
                        <button className="px-6 py-4 flex items-center gap-2 text-indigo-600 border-b-2 border-indigo-600 text-sm font-bold">
                            <StickyNote className="w-4 h-4" />
                            Notes
                        </button>
                        <button 
                            onClick={() => setShowAddNote(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Note
                        </button>
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto max-h-[600px] space-y-4 custom-scrollbar">
                        {(!lead.notes || lead.notes.length === 0) ? (
                            <div className="flex flex-col items-center justify-center text-center py-20">
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4 border border-slate-100 shadow-inner">
                                    <StickyNote className="w-10 h-10" />
                                </div>
                                <h3 className="text-base font-bold text-slate-800">No notes found</h3>
                                <p className="text-xs text-slate-400 max-w-xs mt-1">Keep track of important details about this lead.</p>
                            </div>
                        ) : (
                            lead.notes.map((n, i) => (
                                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 group hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-bold">
                                                {n.name?.[0]}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">{n.name}</span>
                                        </div>
                                        <span className="text-[10px] font-medium text-slate-400">
                                            {new Date(n.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed pl-8">{n.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {showAddNote && (
                <ModalOverlay onClose={() => setShowAddNote(false)}>
                    <ModalHeader title="Add New Note" onClose={() => setShowAddNote(false)} />
                    <div className="p-6 space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Write your note</label>
                            <textarea 
                                autoFocus
                                placeholder="Start typing important details here..."
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-indigo-500 min-h-[150px] transition-all"
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3 pt-4 border-t border-slate-50">
                            <button onClick={() => setShowAddNote(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                            <button 
                                onClick={handleSaveNote} 
                                disabled={updating || !noteContent.trim()}
                                className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                            >
                                {updating ? 'Saving...' : 'Save Note'}
                            </button>
                        </div>
                    </div>
                </ModalOverlay>
            )}

            {showChangeStage && (
                <ModalOverlay onClose={() => setShowChangeStage(false)}>
                    <ModalHeader title="Change Lead Stage" onClose={() => setShowChangeStage(false)} />
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select New Stage</label>
                            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {stages.map((stage) => (
                                    <button
                                        key={stage._id}
                                        onClick={() => setSelectedStage(stage.name)}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between group ${
                                            selectedStage === stage.name 
                                            ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-50' 
                                            : 'border-slate-100 hover:border-slate-200 bg-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${selectedStage === stage.name ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300'}`} />
                                            <span className={`text-sm font-bold ${selectedStage === stage.name ? 'text-indigo-900' : 'text-slate-600'}`}>{stage.name}</span>
                                        </div>
                                        {selectedStage === stage.name && (
                                            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                                <CheckCircle2 className="w-3 h-3" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4 border-t border-slate-50">
                            <button onClick={() => setShowChangeStage(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                            <button 
                                onClick={updateLeadStatus} 
                                disabled={updating || selectedStage === lead.status}
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                                {updating ? 'Updating...' : 'Update Stage'}
                            </button>
                        </div>
                    </div>
                </ModalOverlay>
            )}

            {toast && (
                <div className="fixed bottom-6 right-6 z-[200] animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900 text-white shadow-2xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold">{toast}</span>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

// Modal Helper Components
function ModalOverlay({ children, onClose }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="fixed inset-0" onClick={onClose} />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden flex flex-col"
            >
                {children}
            </motion.div>
        </div>
    );
}

function ModalHeader({ title, onClose }) {
    return (
        <div className="flex items-center justify-between p-6 border-b border-slate-50">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-all">
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}

export default LeadDetails;
