import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, AlertTriangle, Bell, User, ShieldAlert, LogOut } from 'lucide-react';

export default function EmployeeSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'My Requests', path: '/employee/requests', icon: ListTodo },
    { name: 'At Risk', path: '/employee/at-risk', icon: AlertTriangle },
    { name: 'Notifications', path: '/employee/notifications', icon: Bell },
    { name: 'Profile', path: '/employee/profile', icon: User },
  ];

  return (
    <div className="w-64 h-screen bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 flex flex-col fixed left-0 top-0 z-40 hidden md:flex transition-colors">
      
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-gray-900 dark:bg-white p-1 rounded-md">
            <ShieldAlert size={20} className="text-white dark:text-[#0a0c10]" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white block leading-none">DELAYGUARD</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">AI-Powered SLA Protection</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.path || (currentPath.startsWith(link.path) && link.path !== '/employee/dashboard');
          
          return (
            <Link 
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-fuchsia-50 dark:bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon size={18} className={`${isActive ? 'text-fuchsia-600 dark:text-fuchsia-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Employee Info */}
      <div className="p-4 border-t border-gray-200 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-sm">
            RS
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Rahul Sharma</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Service Officer</p>
          </div>
        </div>
        
        <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-medium px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full">
          <LogOut size={16} />
          Logout
        </Link>
      </div>

    </div>
  );
}
