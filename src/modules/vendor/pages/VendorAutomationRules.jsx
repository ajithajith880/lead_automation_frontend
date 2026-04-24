import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
   BarChart3,
   BrainCircuit,
   Zap,
   Users,
   Plus,
   Search,
   Settings,
   MoreVertical,
   MoreHorizontal,
   X,
   MessageSquare,
   ArrowRight,
   Clock,
   GitBranch,
   ToggleLeft as Toggle,
   CheckCircle2,
   Pencil,
   Trash2,
   Copy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const VendorAutomationRules = () => {
   const navigate = useNavigate();
   const menuItems = [
      { label: 'AI Dashboard', icon: BarChart3, path: '/vendor/dashboard', onClick: () => navigate('/vendor/dashboard') },
      { label: 'AI Training', icon: BrainCircuit, path: '/vendor/ai-training', onClick: () => navigate('/vendor/ai-training') },
      { label: 'Automation Rules', icon: Zap, path: '/vendor/rules', onClick: () => navigate('/vendor/rules') },
      { label: 'Leads', icon: Users, path: '/vendor/leads', onClick: () => navigate('/vendor/leads') },
   ];
   const [activeTab, setActiveTab] = React.useState('rules');
   const [isModalOpen, setIsModalOpen] = React.useState(false);
   const [currentStep, setCurrentStep] = React.useState(1);
   const [loading, setLoading] = React.useState(true);
   const [rules, setRules] = React.useState([]);
   const [stages, setStages] = React.useState([]);
   const [editingId, setEditingId] = React.useState(null);
   const [error, setError] = React.useState(null);
   const [formData, setFormData] = React.useState({
        name: '',
        trigger: 'incoming_message',
        conditions: [{ field: 'leads_name', operator: 'equals', value: '' }],
        actions: [{ type: 'send_message', value: '' }],
        status: 'active',
        stop_if_customer_replies: false,
        stop_for_24_hours: false,
        stop_once_per_conversation: false,
        stop_until_agent_responds: false,
        condition_logic: 'AND'
    });

   const BASE_URI = `${import.meta.env.VITE_API_URL}/automation-rules`;

   const fetchRules = async () => {
      try {
         const res = await fetch(BASE_URI);
         if (!res.ok) throw new Error("Failed to fetch");
         const data = await res.json();
         setRules(data);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const fetchStages = async () => {
      try {
         const res = await fetch(`${import.meta.env.VITE_API_URL}/stages`);
         if (res.ok) {
            const data = await res.json();
            setStages(data);
         }
      } catch (err) {
         console.error("Failed to fetch stages:", err);
      }
   };

   const handleStepSave = async () => {
      if (currentStep === 1 && !formData.name.trim()) {
         setError('Rule Name is required');
         return;
      }
      setError(null);
      try {
         const method = editingId ? 'PUT' : 'POST';
         const url = editingId ? `${BASE_URI}/${editingId}` : BASE_URI;

         const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
         });

         if (res.ok) {
            const data = await res.json();
            if (!editingId && data._id) {
               setEditingId(data._id);
            }
            fetchRules();
            if (currentStep < 3) setCurrentStep(currentStep + 1);
            else {
               setIsModalOpen(false);
               setEditingId(null);
            }
         }
      } catch (err) {
         console.error(err);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      handleStepSave();
   };

   const handleEdit = (rule) => {
      setEditingId(rule._id);
      setFormData({
         name: rule.name,
         trigger: rule.trigger,
         conditions: rule.conditions || [{ field: 'leads_name', operator: 'equals', value: '' }],
         actions: rule.actions || [{ type: 'send_message', value: '' }],
         status: rule.status,
         stop_if_customer_replies: rule.stop_if_customer_replies || false,
         stop_for_24_hours: rule.stop_for_24_hours || false,
         stop_once_per_conversation: rule.stop_once_per_conversation || false,
         stop_until_agent_responds: rule.stop_until_agent_responds || false,
         condition_logic: rule.condition_logic || 'AND'
      });
      setCurrentStep(1);
      setIsModalOpen(true);
   };

   const toggleStatus = async (rule) => {
      const newStatus = rule.status === 'active' ? 'inactive' : 'active';
      try {
         const res = await fetch(`${BASE_URI}/${rule._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
         });
         if (res.ok) fetchRules();
      } catch (err) {
         console.error(err);
      }
   };

   const deleteRule = async (id) => {
      if (!window.confirm("Delete this rule?")) return;
      try {
         const res = await fetch(`${BASE_URI}/${id}`, { method: 'DELETE' });
         if (res.ok) fetchRules();
      } catch (err) {
         console.error(err);
      }
   };

   React.useEffect(() => {
      fetchRules();
      fetchStages();
   }, []);

   return (
      <DashboardLayout role="vendor" menuItems={menuItems}>
         {/* Header Tabs */}
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
               <button
                  onClick={() => setActiveTab('rules')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'rules' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  <Zap className="w-4 h-4" />
                  Rules
                  <span className="ml-1 px-1.5 py-0.5 bg-slate-200 rounded text-[10px] text-slate-600">{rules.length}</span>
               </button>
            </div>
            <button
               onClick={() => {
                  setEditingId(null);
                  setFormData({
                     name: '',
                     trigger: 'incoming_message',
                     conditions: [{ field: 'leads_name', operator: 'equals', value: '' }],
                     actions: [{ type: 'send_message', value: '' }],
                     status: 'active',
                     stop_if_customer_replies: false,
                     stop_for_24_hours: false,
                     stop_once_per_conversation: false,
                     stop_until_agent_responds: false,
                     condition_logic: 'AND'
                  });
                  setIsModalOpen(true);
                  setCurrentStep(1);
               }}
               className="flex items-center gap-2 px-6 py-2.5 bg-[#00ba88] text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 hover:bg-[#00a377] transition-all"
            >
               <Plus className="w-5 h-5" />
               <span>New Rule</span>
            </button>
         </div>

         <div className="flex items-center gap-4 mb-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-2">
            <span>{rules.filter(r => r.status === 'active').length} active</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>{rules.filter(r => r.status === 'inactive').length} inactive</span>
         </div>

         {/* Rule List */}
         <div className="space-y-4">
            {loading ? (
               <div className="p-20 text-center text-slate-400 font-bold">Loading Rules...</div>
            ) : Array.isArray(rules) && rules.length === 0 ? (
               <div className="p-20 text-center bg-white border border-dashed border-slate-300 rounded-3xl text-slate-400 font-bold italic">
                  No rules created yet. Click "New Rule" to start automating.
               </div>
            ) : rules.map((rule) => (
               <div key={rule._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${rule.status === 'active' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                           <Zap className="w-5 h-5" />
                        </div>
                        <div>
                           <h3 className="text-sm font-bold text-slate-800">{rule.name}</h3>
                           <p className="text-[10px] text-slate-400 font-medium">Created</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <button
                           onClick={() => handleEdit(rule)}
                           className="p-2 text-slate-300 hover:text-indigo-600 transition-all"
                        >
                           <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-all">
                           <Copy className="w-4 h-4" />
                        </button>
                        <button
                           onClick={() => deleteRule(rule._id)}
                           className="p-2 text-slate-300 hover:text-rose-600 transition-all"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-slate-100 mx-1" />
                        <button
                           onClick={() => toggleStatus(rule)}
                           className={`w-10 h-5 rounded-full relative transition-all ${rule.status === 'active' ? 'bg-[#00ba88]' : 'bg-slate-200'}`}
                        >
                           <div className={`absolute top-1 w-3 h-3 bg-white rounded-[5px] transition-all ${rule.status === 'active' ? 'right-1' : 'left-1'}`} />
                        </button>
                     </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pl-14 pb-1">
                     <div className="flex items-center gap-2 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-[5px]">
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tight">IF</span>
                        <span className="text-[10px] font-extrabold text-indigo-900 tracking-tight capitalize">{rule.trigger.replace('_', ' ')}</span>
                     </div>

                     <ArrowRight className="w-3 h-3 text-slate-300 mx-0.5" />

                     {rule.conditions?.map((c, idx) => (
                        <React.Fragment key={idx}>
                           {idx > 0 && <span className="text-[9px] font-black text-slate-300 uppercase mx-0.5">{rule.condition_logic || 'AND'}</span>}
                           <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-100 rounded-[5px] shadow-sm">
                              <span className="text-[9px] font-bold text-slate-400 capitalize">{c.field.split('_').pop()}</span>
                              <span className="text-[10px] font-black text-emerald-500">{c.operator === 'equals' ? '=' : c.operator.replace('_', ' ')}</span>
                              <span className="text-[10px] font-bold text-slate-900">{c.value}</span>
                           </div>
                        </React.Fragment>
                     ))}

                     <div className="w-3 h-px bg-slate-200 mx-1" />

                     {rule.actions?.map((a, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-[5px]">
                           <span className="text-[9px] font-black text-[#00ba88] uppercase">THEN</span>
                           <span className="text-[10px] font-black text-emerald-600">{a.type.replace('_', ' ')}</span>
                           {a.value && <span className="text-[10px] font-bold text-emerald-900 truncate max-w-[120px]">{a.value}</span>}
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
         <AnimatePresence>
            {isModalOpen && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setIsModalOpen(false)}
                     className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  />
                  <motion.div
                     initial={{ opacity: 0, scale: 0.95, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95, y: 20 }}
                     className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden shadow-emerald-100"
                  >
                     {/* Modal Header */}
                     <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                           <h1 className="text-xl font-bold text-slate-900">Create Automation Rule</h1>
                           <p className="text-xs text-slate-400 font-medium">Define trigger, conditions, and actions for automatic lead management.</p>
                        </div>
                        <button onClick={() => { setIsModalOpen(false); setCurrentStep(1); setEditingId(null); }} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                           <X className="w-5 h-5 text-slate-400" />
                        </button>
                     </div>

                     {/* Progress Stepper */}
                     <div className="px-16 py-8 bg-slate-50/50 border-b border-slate-50">
                        <div className="flex items-center justify-between relative">
                           <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 -translate-y-1/2 z-0" />
                           {[
                              { step: 1, label: 'Trigger' },
                              { step: 2, label: 'Conditions' },
                              { step: 3, label: 'Actions' }
                           ].map((s) => (
                              <div key={s.step} className="relative z-10 flex flex-col items-center gap-2">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${currentStep === s.step ? 'bg-[#00ba88] text-white shadow-lg shadow-emerald-100' :
                                       currentStep > s.step ? 'bg-[#00ba88] text-white' : 'bg-white border-2 border-slate-200 text-slate-300'
                                    }`}>
                                    {currentStep > s.step ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold">{s.step}</span>}
                                 </div>
                                 <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep === s.step ? 'text-[#00ba88]' : 'text-slate-400'}`}>{s.label}</span>
                              </div>
                           ))}
                           <div
                              className="absolute top-1/2 left-0 h-[2px] bg-[#00ba88] -translate-y-1/2 transition-all duration-500 ease-in-out z-0"
                              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                           />
                        </div>
                     </div>

                     <form onSubmit={handleSubmit}>
                        <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                           {currentStep === 1 && (
                              <motion.div
                                 initial={{ opacity: 0, x: 20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 className="space-y-10"
                              >
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rule Name *</label>
                                    <input
                                       required
                                       type="text"
                                       placeholder="e.g. Price Inquiry Auto-Route"
                                       className={`w-full px-6 py-4 bg-white border rounded-2xl outline-none transition-all text-sm font-bold shadow-sm ${error ? 'border-rose-500 ring-4 ring-rose-50' : 'border-slate-200 focus:border-[#00ba88] focus:ring-4 focus:ring-emerald-50'
                                          }`}
                                       value={formData.name}
                                       onChange={(e) => {
                                          setFormData({ ...formData, name: e.target.value });
                                          setError(null);
                                       }}
                                    />
                                    {error && <p className="text-[10px] text-rose-500 font-bold ml-1">Rule name is required</p>}
                                 </div>

                                 <div className="space-y-6">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Trigger</label>
                                    <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    { id: 'incoming_message', label: 'Incoming Message', desc: 'When any message is received', icon: MessageSquare },
                                                    { id: 'keyword_detected', label: 'Keyword Detected', desc: 'When message contains special words', icon: Zap },
                                                    { id: 'no_response', label: 'No Agent Response', desc: 'When agent hasn\'t replied in time', icon: Clock },
                                                    { id: 'lead_created', label: 'Lead Created', desc: 'When a new lead is added', icon: Plus },
                                                ].map((t) => (
                                                    <button
                                                        key={t.id}
                                                        type="button"
                                                        disabled={!!editingId && formData.trigger !== t.id}
                                                        onClick={() => !editingId && setFormData({...formData, trigger: t.id})}
                                                        className={`p-2 rounded-[1rem] border transition-all text-left relative overflow-hidden group ${
                                                            formData.trigger === t.id 
                                                               ? 'border-[#00ba88] bg-emerald-50/50 shadow-lg' 
                                                               : (editingId ? 'border-slate-100 opacity-40 grayscale cursor-not-allowed' : 'border-slate-200 hover:border-[#00ba88] hover:bg-white')
                                                         }`}
                                                    >
                                                        <div className={`p-2 rounded-lg transition-all`}>
                                                            <t.icon className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <h4 className={`text-xs font-bold ${formData.trigger === t.id ? 'text-emerald-900' : 'text-slate-800'}`}>{t.label}</h4>
                                                            <p className="text-[10px] text-slate-400 mt-0.5">{t.desc}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                    </div>
                                 </div>
                              </motion.div>
                           )}

                           {currentStep === 2 && (
                              <motion.div
                                 initial={{ opacity: 0, x: 20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 className="space-y-8"
                              >
                                 <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conditions</label>
                                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                                        <button 
                                            type="button" 
                                            onClick={() => setFormData({...formData, condition_logic: 'AND'})}
                                            className={`px-3 py-1 rounded text-[10px] font-black transition-all ${formData.condition_logic === 'AND' ? 'bg-[#00ba88] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            ALL (AND)
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setFormData({...formData, condition_logic: 'OR'})}
                                            className={`px-3 py-1 rounded text-[10px] font-black transition-all ${formData.condition_logic === 'OR' ? 'bg-[#00ba88] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            ANY (OR)
                                        </button>
                                    </div>
                                 </div>

                                 <div className="space-y-3">
                                    {formData.conditions.map((c, i) => (
                                       <div key={i} className="flex flex-col gap-3">
                                          {i > 0 && (
                                                <div className="flex justify-center -mb-2 relative z-10">
                                                    <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase border ${formData.condition_logic === 'OR' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-[#00ba88] border-emerald-100'}`}>
                                                        {formData.condition_logic}
                                                    </span>
                                                </div>
                                            )}
                                          <div className="flex items-center p-1 bg-white border border-slate-100 rounded-2xl shadow-sm group relative overflow-hidden">
                                             <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-500" />
                                             <div className="flex-1">
                                                <select 
                                                   className="w-full bg-transparent border-none py-3 px-4 text-xs font-bold outline-none text-slate-700"
                                                   value={c.field}
                                                   onChange={(e) => {
                                                       const newConds = [...formData.conditions];
                                                       newConds[i].field = e.target.value;
                                                       setFormData({...formData, conditions: newConds});
                                                   }}
                                                >
                                                   <option value="leads_name">Lead Name</option>
                                                   <option value="leads_email">Lead Email</option>
                                                   <option value="leads_phone">Lead Phone</option>
                                                   <option value="leads_status">Lead Status</option>
                                                   <option value="leads_source">Lead Source</option>
                                                   <option value="leads_priority">Lead Priority</option>
                                                </select>
                                             </div>
                                             <div className="w-px h-10 bg-slate-100" />
                                             <div className="flex-1">
                                                <select 
                                                   className="w-full bg-transparent border-none py-3 px-4 text-xs font-bold outline-none text-indigo-600"
                                                   value={c.operator}
                                                   onChange={(e) => {
                                                       const newConds = [...formData.conditions];
                                                       newConds[i].operator = e.target.value;
                                                       setFormData({...formData, conditions: newConds});
                                                   }}
                                                >
                                                   <option value="equals">Equals</option>
                                                   <option value="not_equals">Not Equals</option>
                                                   <option value="contains">Contains</option>
                                                   <option value="not_contains">Not Contains</option>
                                                   <option value="starts_with">Starts With</option>
                                                </select>
                                             </div>
                                             <div className="w-px h-10 bg-slate-100" />
                                             <div className="flex-[2]">
                                                <input
                                                   type="text"
                                                   placeholder="Value..."
                                                   className="w-full bg-transparent border-none py-3 px-4 text-xs font-bold outline-none text-slate-800"
                                                   value={c.value}
                                                   onChange={(e) => {
                                                      const newConds = [...formData.conditions];
                                                      newConds[i].value = e.target.value;
                                                      setFormData({ ...formData, conditions: newConds });
                                                   }}
                                                />
                                             </div>
                                             <button
                                                type="button"
                                                onClick={() => {
                                                   const newConds = formData.conditions.filter((_, idx) => idx !== i);
                                                   setFormData({ ...formData, conditions: newConds });
                                                }}
                                                className="p-2 text-rose-300 hover:text-rose-500 transition-all mr-2"
                                             >
                                                <X className="w-4 h-4" />
                                             </button>
                                          </div>
                                       </div>
                                    ))}
                                    <button
                                       type="button"
                                       onClick={() => setFormData({ ...formData, conditions: [...formData.conditions, { field: 'leads_name', operator: 'equals', value: '' }] })}
                                       className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-slate-300 hover:text-slate-600 transition-all"
                                    >
                                       + Add Condition
                                    </button>
                                 </div>
                              </motion.div>
                           )}

                           {currentStep === 3 && (
                              <motion.div
                                 initial={{ opacity: 0, x: 20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 className="space-y-8"
                              >
                                 <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Execution Sequence</label>
                                    <p className="text-[11px] text-slate-500 font-medium italic">Define the sequence of actions to take.</p>
                                 </div>

                                 <div className="space-y-4">
                                    {formData.actions.map((a, i) => (
                                       <div key={i} className="flex flex-col gap-3">
                                          <div className="flex items-center gap-4">
                                             <span className="text-xs font-bold text-slate-300">{i + 1}</span>
                                             <div className="flex-1 p-1 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center group relative overflow-hidden transition-all hover:shadow-md">
                                                <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#00ba88]" />
                                                <div className="flex-1">
                                                   <select 
                                                      className="w-full bg-transparent border-none py-3 px-4 text-xs font-bold outline-none text-slate-800"
                                                      value={a.type}
                                                      onChange={(e) => {
                                                         const newActions = [...formData.actions];
                                                         newActions[i].type = e.target.value;
                                                         setFormData({...formData, actions: newActions});
                                                      }}
                                                   >
                                                      <option value="send_message">Send Message</option>
                                                      <option value="move_lead_stage">Move Stage</option>
                                                   </select>
                                                </div>
                                                <div className="w-px h-10 bg-slate-50" />
                                                <div className="flex-[2]">
                                                   {a.type === 'move_lead_stage' ? (
                                                      <select 
                                                         className="w-full bg-transparent border-none py-3 px-4 text-xs font-bold outline-none text-slate-800"
                                                         value={a.value}
                                                         onChange={(e) => {
                                                            const newActions = [...formData.actions];
                                                            newActions[i].value = e.target.value;
                                                            setFormData({...formData, actions: newActions});
                                                         }}
                                                      >
                                                         <option value="">Select Stage...</option>
                                                         {stages.map(s => (
                                                            <option key={s._id} value={s.name}>{s.name}</option>
                                                         ))}
                                                      </select>
                                                   ) : (
                                                      <input 
                                                         type="text"
                                                         placeholder="Action Value or ID..."
                                                         className="w-full bg-transparent border-none py-3 px-4 text-xs font-bold outline-none text-slate-600 placeholder:text-slate-300"
                                                         value={a.value}
                                                         onChange={(e) => {
                                                            const newActions = [...formData.actions];
                                                            newActions[i].value = e.target.value;
                                                            setFormData({...formData, actions: newActions});
                                                         }}
                                                      />
                                                   )}
                                                </div>
                                                <button
                                                   type="button"
                                                   onClick={() => {
                                                      const newActions = formData.actions.filter((_, idx) => idx !== i);
                                                      setFormData({ ...formData, actions: newActions });
                                                   }}
                                                   className="p-2 text-rose-300 hover:text-rose-500 transition-all mr-2"
                                                >
                                                   <X className="w-4 h-4" />
                                                </button>
                                             </div>
                                          </div>
                                       </div>
                                    ))}
                                    <button
                                       type="button"
                                       onClick={() => setFormData({ ...formData, actions: [...formData.actions, { type: 'send_message', value: '' }] })}
                                       className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-slate-300 hover:text-slate-600 transition-all"
                                    >
                                       + Add Action
                                    </button>
                                 </div>

                                 <div className="pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                                    {[
                                       { id: 'stop_if_customer_replies', label: 'Stop if replied' },
                                       { id: 'stop_for_24_hours', label: '24h throttle' },
                                       { id: 'stop_once_per_conversation', label: 'Run once' },
                                       { id: 'stop_until_agent_responds', label: 'Agent block' }
                                    ].map((t) => (
                                       <div key={t.id} className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.label}</span>
                                          <button 
                                             type="button"
                                             onClick={() => setFormData({...formData, [t.id]: !formData[t.id]})}
                                             className={`w-8 h-4 rounded-full relative transition-all ${formData[t.id] ? 'bg-[#00ba88]' : 'bg-slate-200'}`}
                                          >
                                             <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${formData[t.id] ? 'right-0.5' : 'left-0.5'}`} />
                                          </button>
                                       </div>
                                    ))}
                                 </div>

                                 <div className="pt-6 border-t border-slate-50">
                                    <button
                                       type="button"
                                       onClick={() => setFormData({ ...formData, status: formData.status === 'active' ? 'inactive' : 'active' })}
                                       className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${formData.status === 'active' ? 'bg-[#00ba88] border-[#00ba88] text-white shadow-lg shadow-emerald-100' : 'bg-white border-slate-200 text-slate-400 font-bold'}`}
                                    >
                                       <span className="text-[10px] font-black uppercase tracking-widest">{formData.status === 'active' ? 'Rule Active' : 'Rule Paused'}</span>
                                       <div className={`w-8 h-4 rounded-full relative ${formData.status === 'active' ? 'bg-white/20' : 'bg-slate-100'}`}>
                                          <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${formData.status === 'active' ? 'right-0.5 bg-white' : 'left-0.5 bg-slate-300'}`} />
                                       </div>
                                    </button>
                                 </div>
                              </motion.div>
                           )}
                        </div>

                        <div className="p-8 border-t border-slate-50 bg-white flex items-center justify-between">
                           <button
                              type="button"
                              onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                              className={`px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${currentStep > 1 ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'opacity-0 pointer-events-none'}`}
                           >
                              Back
                           </button>
                           <div className="flex items-center gap-3">
                              {currentStep < 3 && (
                                 <button type="button" onClick={() => setCurrentStep(currentStep + 1)} className="text-xs font-black text-slate-400 uppercase tracking-widest px-6 py-3 hover:text-slate-600">
                                    Skip
                                 </button>
                              )}
                              <button
                                 type="button"
                                 onClick={handleStepSave}
                                 className="px-12 py-3 bg-[#00ba88] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-[#00a377] transition-all active:scale-95"
                              >
                                 {currentStep === 3 ? 'Confirm & Deploy' : 'Save & Continue'}
                              </button>
                           </div>
                        </div>
                     </form>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </DashboardLayout>
   );
};

export default VendorAutomationRules;
