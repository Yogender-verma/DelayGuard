import { Shield, Briefcase, Mail, Phone, Calendar, RefreshCcw, ArrowUpCircle, AlertTriangle } from 'lucide-react';
import { useEmployeeData } from '../../contexts/EmployeeContext';

export default function Profile() {
  const { interventionHistory } = useEmployeeData();

  const employeeData = {
    name: 'Rahul Sharma',
    id: 'EMP-1042',
    role: 'Service Officer',
    department: 'Revenue Department',
    team: 'Approval Team',
    email: 'rahul.s@gov.in',
    phone: '+91 98765 43210',
    joined: 'Jan 2024'
  };

  const actionHistory = interventionHistory.map(item => {
    let icon = AlertTriangle;
    let color = 'blue';
    if (item.action === 'Reassigned' || item.action === 'Reassign') {
      icon = RefreshCcw;
      color = 'fuchsia';
    } else if (item.action === 'Escalated' || item.action === 'Escalate') {
      icon = ArrowUpCircle;
      color = 'orange';
    } else if (item.action === 'Prioritized' || item.action === 'Prioritize') {
      icon = AlertTriangle;
      color = 'red';
    }
    return {
      date: item.date,
      action: item.action,
      target: item.targetId.startsWith('GOI-') ? `Request #${item.targetId.replace('GOI-', '')}` : `Request #${item.targetId}`,
      icon,
      color
    };
  });

  return (
    <div className="space-y-6 animate-hero-entry max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account settings and view recent activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4">
              RS
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{employeeData.name}</h2>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{employeeData.id}</p>
            <span className="inline-block px-3 py-1 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 rounded-full text-xs font-bold uppercase tracking-wider">
              {employeeData.role}
            </span>
          </div>

          <div className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm mb-4">Contact Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail size={16} /> {employeeData.email}
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone size={16} /> {employeeData.phone}
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Calendar size={16} /> Joined {employeeData.joined}
              </div>
            </div>
          </div>
        </div>

        {/* Details & History */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
              <Briefcase size={16} className="text-blue-500" />
              Department Information
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Department</div>
                <div className="font-medium text-gray-900 dark:text-white">{employeeData.department}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Team</div>
                <div className="font-medium text-gray-900 dark:text-white">{employeeData.team}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Clearance Level</div>
                <div className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Shield size={14} className="text-green-500" /> Level 2 (Standard)
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</div>
                <div className="font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm mb-6">Recent Actions</h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-0 md:before:translate-x-4 before:h-full before:w-0.5 before:bg-gray-200 dark:before:bg-white/10">
              {actionHistory.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="relative flex gap-4 pl-10 md:pl-12">
                    <div className={`absolute left-0 w-8 h-8 rounded-full border-4 border-white dark:border-[#121524] bg-${item.color}-100 dark:bg-${item.color}-500/20 text-${item.color}-600 dark:text-${item.color}-400 flex items-center justify-center shrink-0`}>
                      <Icon size={12} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">{item.date}</div>
                      <div className="text-sm">
                        <span className="font-bold text-gray-900 dark:text-white mr-1">{item.action}</span>
                        <span className="text-gray-600 dark:text-gray-400">{item.target}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
