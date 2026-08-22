import React from 'react';
import { AlertTriangle, CheckCircle2, TrendingUp, CheckCircle } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: 'critical',
      title: 'HIGH RISK',
      message: 'Request #1042 reached 93% breach probability. 4 hours remaining.',
      time: '2 minutes ago',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      id: 2,
      type: 'warning',
      title: 'RISK INCREASED',
      message: 'Request #1087 increased from 62% → 89%. Recommended action: Escalate.',
      time: '15 minutes ago',
      icon: TrendingUp,
      color: 'orange'
    },
    {
      id: 3,
      type: 'success',
      title: 'ACTION COMPLETED',
      message: 'Request #1051 was successfully reassigned.',
      time: '1 hour ago',
      icon: CheckCircle2,
      color: 'green'
    }
  ];

  return (
    <div className="space-y-6 animate-hero-entry max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400">Recent alerts and updates on your requests.</p>
        </div>
        <button className="text-sm font-medium text-fuchsia-600 dark:text-fuchsia-400 hover:underline flex items-center gap-1.5">
          <CheckCircle size={16} /> Mark all as read
        </button>
      </div>

      <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-white/5">
          {notifications.map(notif => {
            const Icon = notif.icon;
            return (
              <div key={notif.id} className="p-5 md:p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className={`p-2 rounded-lg bg-${notif.color}-50 text-${notif.color}-600 dark:bg-${notif.color}-500/10 dark:text-${notif.color}-400`}>
                    <Icon size={20} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm font-bold uppercase tracking-wider text-${notif.color}-700 dark:text-${notif.color}-400`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {notif.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
