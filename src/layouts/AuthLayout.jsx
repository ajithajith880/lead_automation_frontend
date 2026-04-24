import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      {/* Background blobs for a friendly look */}
      <div className="fixed top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="fixed bottom-0 -right-4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-xl border border-slate-100 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{title}</h1>
          <p className="text-slate-500 font-medium">{subtitle}</p>
        </div>

        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;
