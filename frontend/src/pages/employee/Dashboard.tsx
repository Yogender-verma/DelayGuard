import React from 'react';
import { useEmployeeData } from '../../contexts/EmployeeContext';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  AlertTriangle, 
  Clock, 
  Target, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function Dashboard() {
  const { requests } = useEmployeeData();

  // Calculations for summary cards
  const activeRequests = requests.filter(r => r.status !== 'Completed');
  const myRequestsCount = activeRequests.length;
  
  const atRiskRequests = activeRequests.filter(r => r.riskLevel === 'High' || r.riskLevel === 'Critical');
  const atRiskCount = atRiskRequests.length;
  
  const criticalRequests = activeRequests.filter(r => r.riskLevel === 'Critical');
  const criticalCount = criticalRequests.length;
  
  // Naive due today calculation for mock
  const dueTodayCount = activeRequests.filter(r => r.timeRemaining.includes('hours')).length;
  
  // Mock SLA success rate
  const slaSuccessRate = "91.4%";

  // Action Required - sorted by priority (Critical > High > Medium > Low) and then by riskScore
  const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
  const actionRequired = [...activeRequests]
    .sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.riskScore - a.riskScore;
    })
    .slice(0, 5); // top 5

  // Upcoming deadlines - sorted by time remaining (roughly)
  const upcomingDeadlines = [...activeRequests]
    .filter(r => r.timeRemaining.includes('hours') || r.timeRemaining.includes('1 day'))
    .sort((a, b) => {
      const getHours = (str: string) => {
        if (str.includes('hours')) return parseInt(str);
        if (str.includes('day')) return parseInt(str) * 24;
        return 999;
      };
      return getHours(a.timeRemaining) - getHours(b.timeRemaining);
    })
    .slice(0, 4);

  // Chart Data
  const riskDistribution = [
    { name: 'Critical', value: activeRequests.filter(r => r.riskLevel === 'Critical').length, color: '#ef4444' }, // red
    { name: 'High', value: activeRequests.filter(r => r.riskLevel === 'High').length, color: '#f97316' }, // orange
    { name: 'Medium', value: activeRequests.filter(r => r.riskLevel === 'Medium').length, color: '#eab308' }, // yellow
    { name: 'Low', value: activeRequests.filter(r => r.riskLevel === 'Low').length, color: '#22c55e' }, // green
  ].filter(d => d.value > 0);

  const riskTrendData = [
    { day: 'Mon', risk: 12 },
    { day: 'Tue', risk: 14 },
    { day: 'Wed', risk: 10 },
    { day: 'Thu', risk: 15 },
    { day: 'Fri', risk: 8 },
    { day: 'Sat', risk: 5 },
    { day: 'Sun', risk: 7 },
  ];

  return (
    <div className="space-y-8 animate-hero-entry">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Good morning, Rahul 👋</h1>
        <p className="text-gray-500 dark:text-gray-400">Here is your SLA protection overview.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">My Requests</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
              <FileText size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{myRequestsCount}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Currently assigned</p>
        </div>

        <div className="bg-white dark:bg-[#121524] border border-orange-200 dark:border-orange-500/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-4 relative">
            <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">At Risk</h3>
            <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg text-orange-600 dark:text-orange-400">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">{atRiskCount}</div>
          <p className="text-xs text-orange-500/80 dark:text-orange-400/80">Need attention</p>
        </div>

        <div className="bg-white dark:bg-[#121524] border border-red-200 dark:border-red-500/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-4 relative">
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Critical</h3>
            <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-red-600 dark:text-red-400">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">{criticalCount}</div>
          <p className="text-xs text-red-500/80 dark:text-red-400/80">Immediate action required</p>
        </div>

        <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Today</h3>
            <div className="p-2 bg-fuchsia-50 dark:bg-fuchsia-500/10 rounded-lg text-fuchsia-600 dark:text-fuchsia-400">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{dueTodayCount}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Approaching deadline</p>
        </div>

        <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Success Rate</h3>
            <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg text-green-600 dark:text-green-400">
              <Target size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{slaSuccessRate}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Your current performance</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Action Required Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">ACTION REQUIRED</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Requests with the highest probability of SLA breach.</p>
            </div>
            <Link to="/employee/at-risk" className="text-sm font-medium text-fuchsia-600 dark:text-fuchsia-400 hover:underline">
              View all at risk
            </Link>
          </div>

          <div className="space-y-4">
            {actionRequired.map((req) => (
              <div key={req.id} className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">#{req.id}</span>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{req.type}</h3>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                      req.riskLevel === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                      req.riskLevel === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                      {req.riskScore}% SLA BREACH RISK
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                      <Clock size={14} /> {req.timeRemaining} remaining
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <span>{req.department}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">{req.currentStage} Stage</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Priority:</span>
                    <span className={`font-bold ${
                      req.priority === 'Critical' ? 'text-red-600 dark:text-red-400' :
                      req.priority === 'High' ? 'text-orange-600 dark:text-orange-400' :
                      'text-gray-900 dark:text-white'
                    }`}>{req.priority.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">Action:</span>
                    <span className="font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider">{req.recommendedAction}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link 
                      to={`/employee/requests/${req.id}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white text-center text-sm font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                    {req.recommendedAction !== 'Monitor' && (
                      <Link 
                        to={`/employee/requests/${req.id}?action=true`}
                        className="flex-1 bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] hover:from-[#c026d3] hover:to-[#7c3aed] text-white text-center text-sm font-semibold py-2.5 rounded-lg transition-all shadow-md shadow-fuchsia-500/25"
                      >
                        Take Action
                      </Link>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Risk Distribution Chart */}
          <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">My Request Risk Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', backgroundColor: '#121524', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {riskDistribution.map(item => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">UPCOMING DEADLINES</h3>
            <div className="space-y-4">
              {upcomingDeadlines.map(req => (
                <Link to={`/employee/requests/${req.id}`} key={req.id} className="block group">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500">#{req.id}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-fuchsia-500 transition-colors">{req.type}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Clock size={12} /> {req.timeRemaining} remaining
                      </span>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 ${
                      req.riskLevel === 'Critical' ? 'bg-red-500' :
                      req.riskLevel === 'High' ? 'bg-orange-500' :
                      req.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Risk Trend Chart */}
          <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">YOUR SLA RISK TREND</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(217,70,239,0.1)' }}
                    contentStyle={{ borderRadius: '12px', backgroundColor: '#121524', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="risk" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
