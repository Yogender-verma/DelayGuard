import { useState } from 'react';
import { useEmployeeData } from '../../contexts/EmployeeContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  AlertTriangle, 
  Clock, 
  Target, 
  ShieldAlert,
  Lightbulb,
  X
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { RequestData } from '../../data/mockRequests';

export default function Dashboard() {
  const navigate = useNavigate();
  const { requests, executeIntervention } = useEmployeeData();
  const [selectedReq, setSelectedReq] = useState<RequestData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Calculations for summary cards
  const activeRequests = requests.filter(r => r.status !== 'Completed');
  const myRequestsCount = activeRequests.length;
  
  const atRiskRequests = activeRequests.filter(r => r.riskLevel === 'High' || r.riskLevel === 'Critical');
  const atRiskCount = atRiskRequests.length;

  const riskTrendData = [
    { name: 'Mon', riskCount: Math.max(1, atRiskCount - 2) },
    { name: 'Tue', riskCount: Math.max(2, atRiskCount - 1) },
    { name: 'Wed', riskCount: Math.max(3, atRiskCount + 1) },
    { name: 'Thu', riskCount: Math.max(2, atRiskCount) },
    { name: 'Fri', riskCount: Math.max(4, atRiskCount + 2) },
    { name: 'Sat', riskCount: Math.max(1, atRiskCount - 1) },
    { name: 'Sun', riskCount: atRiskCount }
  ];
  
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



  return (
    <div className="space-y-8 animate-hero-entry">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Good morning, Rahul 👋</h1>
        <p className="text-gray-500 dark:text-gray-400">Here is your SLA protection overview.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <Link 
          to="/employee/requests"
          className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-fuchsia-500/30 hover:-translate-y-1 transition-all cursor-pointer block group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-fuchsia-500 transition-colors">My Requests</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
              <FileText size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{myRequestsCount}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Currently assigned</p>
        </Link>

        <Link 
          to="/employee/at-risk"
          className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-orange-200 dark:border-orange-500/30 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-orange-500/50 hover:-translate-y-1 transition-all cursor-pointer block group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-4 relative">
            <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider group-hover:text-orange-500 transition-colors">At Risk</h3>
            <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg text-orange-600 dark:text-orange-400">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">{atRiskCount}</div>
          <p className="text-xs text-orange-500/80 dark:text-orange-400/80">Need attention</p>
        </Link>

        <Link 
          to="/employee/at-risk?risk=critical"
          className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-red-200 dark:border-red-500/30 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-red-500/50 hover:-translate-y-1 transition-all cursor-pointer block group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-4 relative">
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider group-hover:text-red-500 transition-colors">Critical</h3>
            <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-red-600 dark:text-red-400">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">{criticalCount}</div>
          <p className="text-xs text-red-500/80 dark:text-red-400/80">Immediate action required</p>
        </Link>

        <Link 
          to="/employee/requests?deadline=today"
          className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-fuchsia-500/30 hover:-translate-y-1 transition-all cursor-pointer block group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-fuchsia-500 transition-colors">Due Today</h3>
            <div className="p-2 bg-fuchsia-50 dark:bg-fuchsia-500/10 rounded-lg text-fuchsia-600 dark:text-fuchsia-400">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{dueTodayCount}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Approaching deadline</p>
        </Link>

        <div className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
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
              <div 
                key={req.id} 
                onClick={() => navigate(`/employee/requests/${req.id}`)}
                className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-fuchsia-500/20 hover:-translate-y-0.5 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer group"
              >
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">#{req.id}</span>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">{req.type}</h3>
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

                <div className="flex flex-col gap-3 min-w-[200px]" onClick={(e) => e.stopPropagation()}>
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
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white text-center text-sm font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                    {req.recommendedAction !== 'Monitor' && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedReq(req);
                          setModalOpen(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] hover:from-[#c026d3] hover:to-[#7c3aed] text-white text-center text-sm font-semibold py-2.5 rounded-lg transition-all shadow-md shadow-fuchsia-500/25"
                      >
                        Take Action
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
          
          {/* SLA Risk Volume Trend Chart */}
          <div className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 text-sm">
              SLA Risk Volume Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskTrendData}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', backgroundColor: '#121524', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="riskCount" stroke="#d946ef" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" name="At-Risk Requests" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* DelayGuard Insight */}
          <Link 
            to="/employee/at-risk?stage=Approval" 
            className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-fuchsia-500/20 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-fuchsia-500/50 hover:-translate-y-1 transition-all cursor-pointer block relative overflow-hidden group"
          >
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 dark:bg-fuchsia-500/5 rounded-full blur-[40px] -mr-10 -mt-10" />
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={20} className="text-fuchsia-600 dark:text-fuchsia-400" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">DELAYGUARD INSIGHT</h3>
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
              3 of your 7 high-risk requests are currently stuck in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] font-bold">Approval</span> stage.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              Approval is currently taking 2.1&times; longer than its historical average.
            </p>
            <div className="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wide flex items-center gap-1">
              Recommended: Prioritize Approval-stage requests &rarr;
            </div>
          </Link>
          
          {/* Risk Distribution Chart */}
          <div className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
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
              {riskDistribution.map(item => {
                const targetUrl = item.name.toLowerCase() === 'low' 
                  ? '/employee/requests?risk=low' 
                  : `/employee/at-risk?risk=${item.name.toLowerCase()}`;
                  
                return (
                  <Link 
                    key={item.name} 
                    to={targetUrl} 
                    className="flex items-center justify-between text-sm p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">UPCOMING DEADLINES</h3>
            <div className="space-y-3">
              {upcomingDeadlines.map(req => (
                <Link to={`/employee/requests/${req.id}`} key={req.id} className="block group">
                  <div className="flex items-start justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all cursor-pointer">
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
                      req.riskLevel === 'Critical' ? 'bg-red-500 animate-pulse' :
                      req.riskLevel === 'High' ? 'bg-orange-500' :
                      req.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

 
        </div>
      </div>

      {/* Take Action Modal */}
      {modalOpen && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setModalOpen(false); setSelectedReq(null); }}></div>
          <div className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-lg relative z-10 animate-hero-entry overflow-hidden">
            
            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-white/5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">{selectedReq.recommendedAction.toUpperCase()} REQUEST</h2>
              <button onClick={() => { setModalOpen(false); setSelectedReq(null); }} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Target Request</div>
                <div className="font-bold text-gray-900 dark:text-white">#{selectedReq.id} - {selectedReq.type}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Current Team</div>
                  <div className="font-bold text-gray-900 dark:text-white">{selectedReq.team}</div>
                </div>
                {selectedReq.recommendedAction === 'Reassign' && (
                  <div className="p-4 bg-fuchsia-50 dark:bg-fuchsia-500/10 rounded-xl border border-fuchsia-100 dark:border-fuchsia-500/20">
                    <div className="text-xs text-fuchsia-600 dark:text-fuchsia-400 font-semibold uppercase tracking-wider mb-1">Target Team</div>
                    <div className="font-bold text-fuchsia-800 dark:text-fuchsia-300">Approval Team B</div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Intervention Reason</div>
                <div className="text-gray-700 dark:text-gray-300 text-sm">
                  The current team has a high backlog of {selectedReq.teamBacklog} items. Historical data indicates this intervention will reduce SLA breach risk from {selectedReq.riskScore}% to {selectedReq.whatIfScenarios.find(s => s.action === selectedReq.recommendedAction)?.expectedRisk || 'a safer level'}%.
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3">
              <button onClick={() => { setModalOpen(false); setSelectedReq(null); }} className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => {
                  executeIntervention(selectedReq.id, selectedReq.recommendedAction);
                  setModalOpen(false);
                  setSelectedReq(null);
                }} 
                className="px-5 py-2.5 rounded-xl font-semibold bg-fuchsia-600 hover:bg-fuchsia-700 text-white transition-colors shadow-lg shadow-fuchsia-500/25"
              >
                Confirm {selectedReq.recommendedAction}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
