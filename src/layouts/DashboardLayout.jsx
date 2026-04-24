import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LayoutDashboard, User, Settings, Menu, Bell, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children, role, menuItems, hideSidebar = false, hideHeader = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate(`/${role}/login`);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex text-slate-800 font-sans">
      {/* Sidebar */}
      {!hideSidebar && (
        <aside
          className={`bg-[#1e293b] text-slate-300 transition-all duration-300 ease-in-out flex flex-col h-screen sticky top-0 z-50
            ${isSidebarOpen ? 'w-64' : 'w-20'}`}
        >
          <div className="p-5 flex items-center justify-between border-b border-white/5">
            {isSidebarOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-white text-sm">
                  {role[0].toUpperCase()}
                </div>
                <span className="font-bold text-white tracking-tight uppercase text-sm">{role} Panel</span>
              </motion.div>
            ) : (
              <div className="w-full flex justify-center">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-white text-sm">
                  {role[0].toUpperCase()}
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 py-6 px-3 space-y-1">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-md transition-all group relative
                    ${isActive ? 'bg-primary text-white shadow-md' : 'hover:bg-white/5 hover:text-white'}`}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-6 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <div className={`flex items-center gap-3 ${isSidebarOpen ? 'px-2' : 'justify-center'} mb-4`}>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary italic overflow-hidden border border-primary/20">
                {(user?.businessName || user?.name || 'U')[0]}
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{user?.businessName || user?.name || 'User'}</p>
                  <p className="text-[10px] text-slate-500 truncate lowercase">{user?.email || `${role}@system.com`}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-md text-red-400 hover:bg-red-500/10 transition-colors
                ${isSidebarOpen ? '' : 'justify-center'}`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {!hideHeader && (
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              {!hideSidebar && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              {hideSidebar && (
                 <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-white text-sm">
                   {role[0].toUpperCase()}
                 </div>
              )}
              {/* <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 gap-2 w-64 border border-slate-200">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full text-slate-600" />
              </div> */}
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-primary rounded-lg relative transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <div className="h-8 w-px bg-slate-200 mx-1" />
              <button className="flex items-center gap-2 pl-2 rounded-lg hover:bg-slate-50 transition-colors p-1">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center font-bold text-primary italic text-xs">
                  {(user?.businessName || user?.name || 'U')[0]}
                </div>
                <span className="text-sm font-semibold hidden lg:block">{user?.businessName || user?.name || 'Admin'}</span>
              </button>
            </div>
          </header>
        )}

        <section className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
