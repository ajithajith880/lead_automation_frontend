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
   Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VendorAITraining = () => {
   const navigate = useNavigate();
   const [selectedAI, setSelectedAI] = React.useState('gpt4');

   const menuItems = [
      { label: 'AI Dashboard', icon: BarChart3, path: '/vendor/dashboard', onClick: () => navigate('/vendor/dashboard') },
      { label: 'AI Training', icon: BrainCircuit, path: '/vendor/ai-training', onClick: () => navigate('/vendor/ai-training') },
      { label: 'Automation Rules', icon: Zap, path: '/vendor/rules', onClick: () => navigate('/vendor/rules') },
      { label: 'Leads', icon: Users, path: '/vendor/leads', onClick: () => navigate('/vendor/leads') },
   ];

   return (
      <DashboardLayout role="vendor" menuItems={menuItems}>
         <header className="mb-10">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Training & Knowledge</h1>
            <p className="text-sm text-slate-500 font-medium">Connect your AI models and provide business intelligence</p>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            {/* Training Inputs */}
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Provide Training Data</h2>

                  <div className="space-y-6">
                     {/* Big Text Area */}
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Knowledge Base Text</label>
                        <textarea
                           className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm leading-relaxed text-slate-700 placeholder:text-slate-300 resize-none font-medium italic"
                           placeholder="Paste your product details, FAQs, business policies, and any other text documents here to train your AI..."
                        />
                     </div>

                     {/* Image Upload */}
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Upload Documents (Images/PDFs)</label>
                        <div className="border-2 border-dashed border-slate-100 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 hover:border-primary/30 transition-all cursor-pointer group">
                           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                              <Upload className="w-6 h-6 text-primary" />
                           </div>
                           <p className="text-sm font-bold text-slate-800">Drop files here or click to browse</p>
                           <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">Supported: JPEG, PNG, PDF (Max 20MB)</p>
                        </div>
                     </div>

                     <button className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all">
                        <Send className="w-5 h-5 translate-x-1 -translate-y-1" />
                        <span>Start AI Training Process</span>
                     </button>
                  </div>
               </div>
            </div>

            {/* AI Connection Settings */}
            <div className="space-y-6">
               <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm ring-4 ring-primary/5">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Link className="w-5 h-5" />
                     </div>
                     <h3 className="font-bold text-lg text-slate-900">Connect AI</h3>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Select AI Model</label>
                        <div className="relative group">
                           <select
                              value={selectedAI}
                              onChange={(e) => setSelectedAI(e.target.value)}
                              className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary appearance-none font-bold text-slate-700 text-sm cursor-pointer"
                           >
                              <option value="gpt4">OpenAI GPT-4 Turbo</option>
                              <option value="claude3">Anthropic Claude 3</option>
                              <option value="gemini">Google Gemini Pro</option>
                              <option value="llama3">Meta Llama 3 (Self-Hosted)</option>
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">API Key</label>
                        <div className="relative">
                           <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                           <input
                              type="password"
                              placeholder="sk-••••••••••••••••"
                              className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary font-mono text-xs"
                           />
                        </div>
                     </div>

                     <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <p className="text-[10px] text-blue-600 font-bold leading-relaxed italic">
                           Your API key is stored securely and never shared with 3rd parties. Connection is over TLS 1.3 encryption.
                        </p>
                     </div>

                     <button className="w-full py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold transition-all shadow-md">
                        Establish Connection
                     </button>
                  </div>
               </div>


            </div>
         </div>
      </DashboardLayout>
   );
};

export default VendorAITraining;
