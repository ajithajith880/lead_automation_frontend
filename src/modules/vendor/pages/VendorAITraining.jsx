import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
   BarChart3,
   BrainCircuit,
   Zap,
   Users,
   Upload,
   Link,
   ChevronDown,
   Key,
   Send,
   Code,
   Copy,
   Check,
   Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../../../store/authStore';

const VendorAITraining = () => {
   const navigate = useNavigate();
   const { user } = useAuthStore();
   const [selectedAI, setSelectedAI] = React.useState('gpt4');
   const [content, setContent] = React.useState('');
   const [loading, setLoading] = React.useState(false);
   const [status, setStatus] = React.useState({ type: '', message: '' });
   const [isTrained, setIsTrained] = React.useState(false);
   const [copied, setCopied] = React.useState(false);

   const handleCopy = () => {
      const widgetCode = `<script src="https://lead-automation1-terp.onrender.com/static/widget.js" data-vendor-id="${user?._id || 'YOUR_VENDOR_ID'}"></script>`;
      navigator.clipboard.writeText(widgetCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   React.useEffect(() => {
      const fetchKnowledgeBase = async () => {
         const vendorId = user?._id || '12345';
         try {
            const response = await axios.get(`https://lead-automation1-terp.onrender.com/api/vendors/knowledge-base/${vendorId}`);
            if (response.data && response.data.status && response.data.data) {
               setContent(response.data.data.knowledge_base_content || '');
               setIsTrained(response.data.data.is_trained === 1);
            }
         } catch (error) {
            console.error('Error fetching knowledge base with clean URL:', error);
            try {
               const response = await axios.get(`https://lead-automation1-terp.onrender.com/api/vendors//knowledge-base/${vendorId}`);
               if (response.data && response.data.status && response.data.data) {
                  setContent(response.data.data.knowledge_base_content || '');
                  setIsTrained(response.data.data.is_trained === 1);
               }
            } catch (err) {
               console.error('Error fetching knowledge base with double-slash fallback:', err);
            }
         }
      };
      fetchKnowledgeBase();
   }, [user?._id]);

   const menuItems = [
      { label: 'AI Dashboard', icon: BarChart3, path: '/vendor/dashboard', onClick: () => navigate('/vendor/dashboard') },
      { label: 'AI Training', icon: BrainCircuit, path: '/vendor/ai-training', onClick: () => navigate('/vendor/ai-training') },
      { label: 'Automation Rules', icon: Zap, path: '/vendor/rules', onClick: () => navigate('/vendor/rules') },
      { label: 'Leads', icon: Users, path: '/vendor/leads', onClick: () => navigate('/vendor/leads') },
   ];

   const handleStartTraining = async () => {
      if (!content.trim()) {
         setStatus({ type: 'error', message: 'Please provide some training content first.' });
         return;
      }

      setLoading(true);
      setStatus({ type: '', message: '' });

      const vendorId = user?._id || '12345';

      try {
         const { data } = await axios.post('https://lead-automation1-terp.onrender.com/api/vendors/train-knowledge-base', {
            vendor_id: vendorId,
            content: content
         });

         if (data.status) {
            setStatus({
               type: 'success',
               message: data.message || 'Training completed successfully!'
            });
            setIsTrained(true);
         } else {
            setStatus({
               type: 'error',
               message: data.message || 'Training failed. Please try again.'
            });
         }
      } catch (error) {
         console.error('AI Training Error:', error);
         setStatus({
            type: 'error',
            message: error.response?.data?.message || error.message || 'Connection failed. Please check your network.'
         });
      } finally {
         setLoading(false);
      }
   };

   return (
      <DashboardLayout role="vendor" menuItems={menuItems}>
         <header className="mb-10">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI - Knowledge Training (for widget) </h1>
            <p className="text-sm text-slate-500 font-medium">Connect your AI models and provide business intelligence</p>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            {/* Training Inputs */}
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Provide Training Data</h2>

                  <div className="space-y-6">
                     {status.message && (
                        <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${status.type === 'success'
                           ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                           : 'bg-rose-50 border-rose-100 text-rose-800'
                           }`}>
                           <div className={`w-2 h-2 rounded-full ${status.type === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                           <p className="text-xs font-bold tracking-wide uppercase">{status.message}</p>
                        </div>
                     )}

                     {/* Big Text Area */}
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Knowledge Base Text</label>
                        <textarea
                           value={content}
                           onChange={(e) => setContent(e.target.value)}
                           className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm leading-relaxed text-slate-700 placeholder:text-slate-300 resize-none font-medium italic"
                           placeholder="Paste your product details, FAQs, business policies, and any other text documents here to train your AI..."
                           disabled={loading}
                        />
                     </div>

                     <button
                        onClick={handleStartTraining}
                        disabled={loading || !content.trim()}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                     >
                        {loading ? (
                           <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Training AI Chatbot...</span>
                           </>
                        ) : (
                           <>
                              <Send className="w-5 h-5 translate-x-1 -translate-y-1" />
                              <span>Start AI Training Process</span>
                           </>
                        )}
                     </button>
                  </div>
               </div>
            </div>

            {/* AI Connection Settings */}
            <div className="space-y-6">

               {/* Web Chat Widget Card */}
               <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden ring-4 ring-primary/5">
                  <div className="flex items-center gap-3 mb-6">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${isTrained ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-slate-300 shadow-slate-300/20'}`}>
                        <Code className="w-5 h-5" />
                     </div>
                     <div>
                        <h3 className="font-bold text-lg text-slate-900 font-sans">Web Chat Widget</h3>
                        <p className="text-xs text-slate-500 font-medium font-bold">Deploy on your website</p>
                     </div>
                  </div>

                  {!isTrained ? (
                     <div className="space-y-4">
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                           <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                              <Lock className="w-5 h-5 text-slate-400" />
                           </div>
                           <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Widget Locked</p>
                           <p className="text-[11px] text-slate-400 font-bold max-w-[200px]">
                              Train your AI chatbot first to unlock your custom chat widget code snippet.
                           </p>
                        </div>
                        <button
                           disabled
                           className="w-full py-4 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed text-xs uppercase tracking-wider"
                        >
                           Waiting for AI Training
                        </button>
                     </div>
                  ) : (
                     <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <p className="text-xs text-slate-600 font-medium leading-relaxed font-semibold">
                           Copy and paste this script tag right before the closing <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-[10px] font-bold">&lt;/body&gt;</code> tag on your website:
                        </p>

                        <div className="relative">
                           <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all pr-12 border border-slate-800">
                              <span className="text-slate-500">&lt;</span>
                              <span className="text-pink-400">script</span>{' '}
                              <span className="text-amber-300">src</span>
                              <span className="text-slate-400">=</span>
                              <span className="text-emerald-400">"https://lead-automation1-terp.onrender.com/static/widget.js"</span>{' '}
                              <span className="text-amber-300">data-vendor-id</span>
                              <span className="text-slate-400">=</span>
                              <span className="text-emerald-400">"{user?._id || 'YOUR_VENDOR_ID'}"</span>
                              <span className="text-slate-500">&gt;&lt;/</span>
                              <span className="text-pink-400">script</span>
                              <span className="text-slate-500">&gt;</span>
                           </pre>
                           <button
                              onClick={handleCopy}
                              className="absolute right-3 top-3 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all active:scale-95"
                              title="Copy code"
                           >
                              {copied ? (
                                 <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                 <Copy className="w-4 h-4" />
                              )}
                           </button>
                        </div>

                        <button
                           onClick={handleCopy}
                           className={`w-full py-4 rounded-xl font-bold transition-all text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 ${copied
                              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                              }`}
                        >
                           {copied ? (
                              <>
                                 <Check className="w-4 h-4" />
                                 <span>Copied to Clipboard!</span>
                              </>
                           ) : (
                              <>
                                 <Copy className="w-4 h-4" />
                                 <span>Copy Widget Code</span>
                              </>
                           )}
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </DashboardLayout>
   );
};

export default VendorAITraining;
