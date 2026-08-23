import { Outlet } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import { EmployeeProvider, useEmployeeData } from '../../contexts/EmployeeContext';

// We import the ThemeToggle from App directly or recreate it here if needed.
// For now, let's just create a simplified mobile header with theme toggle placeholder.
import { Menu, CheckCircle2, Info } from 'lucide-react';
import { useState } from 'react';

function ToastNotification() {
  const { toast } = useEmployeeData();
  if (!toast) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-hero-entry">
      <div className="bg-white/95 dark:bg-[#121524]/95 backdrop-blur-xl border border-fuchsia-500/30 text-gray-900 dark:text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm border-l-4 border-l-green-500">
        {toast.type === 'success' ? (
          <CheckCircle2 className="text-green-500 shrink-0" size={20} />
        ) : (
          <Info className="text-blue-500 shrink-0" size={20} />
        )}
        <div className="text-sm font-semibold leading-relaxed">{toast.message}</div>
      </div>
    </div>
  );
}

export function EmployeeLayoutInner() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0c10] text-gray-900 dark:text-gray-200 font-sans selection:bg-fuchsia-500/30">
      
      {/* Desktop Sidebar */}
      <EmployeeSidebar />
      
      {/* Mobile Header */}
      <div className="md:hidden h-16 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-30">
        <div className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">DELAYGUARD</div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay (Simplified for demo) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl" onClick={e => e.stopPropagation()}>
             <EmployeeSidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Toast Alert */}
      <ToastNotification />
      
    </div>
  );
}

export default function EmployeeLayout() {
  return (
    <EmployeeProvider>
      <EmployeeLayoutInner />
    </EmployeeProvider>
  );
}
