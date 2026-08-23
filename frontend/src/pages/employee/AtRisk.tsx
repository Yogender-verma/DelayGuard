import { useEmployeeData } from '../../contexts/EmployeeContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Zap, Clock, AlertTriangle, ArrowRight, X } from 'lucide-react';

export default function AtRisk() {
  const { requests } = useEmployeeData();
  const [searchParams] = useSearchParams();
  const riskParam = searchParams.get('risk');
  const stageParam = searchParams.get('stage');
  
  // Filter only High and Critical risk by default, or specific params if supplied
  const atRiskRequests = requests
    .filter(r => {
      const isNotCompleted = r.status !== 'Completed';
      
      if (riskParam) {
        return isNotCompleted && r.riskLevel.toLowerCase() === riskParam.toLowerCase();
      }
      
      return isNotCompleted && (r.riskLevel === 'High' || r.riskLevel === 'Critical');
    })
    .filter(r => {
      if (stageParam) {
        return r.currentStage.toLowerCase() === stageParam.toLowerCase();
      }
      return true;
    })
    .sort((a, b) => b.riskScore - a.riskScore);

  const hasActiveFilters = !!riskParam || !!stageParam;

  return (
    <div className="space-y-6 animate-hero-entry">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">At-Risk Requests</h1>
        <p className="text-gray-500 dark:text-gray-400">Requests that may miss their SLA if no preventive action is taken.</p>
      </div>

      {/* Proactive Alert Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 border border-orange-200 dark:border-orange-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-xl" />
        <div className="flex gap-4 relative z-10">
          <div className="shrink-0 mt-1">
            <div className="p-2 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg">
              <Zap size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-2">
              ⚡ PROACTIVE ALERT
            </h3>
            <p className="text-orange-700 dark:text-orange-200/80 leading-relaxed max-w-3xl">
              These requests have <strong>NOT necessarily breached their SLA yet</strong>.<br/>
              DelayGuard has identified them as likely to miss their deadline based on historical patterns and current processing conditions. Taking action now can prevent a breach.
            </p>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Active Filter:</span>
          {riskParam && (
            <span className="px-2 py-0.5 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 rounded-lg text-xs font-semibold capitalize flex items-center gap-1.5">
              Risk: {riskParam}
            </span>
          )}
          {stageParam && (
            <span className="px-2 py-0.5 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 rounded-lg text-xs font-semibold capitalize flex items-center gap-1.5">
              Stage: {stageParam}
            </span>
          )}
          <Link to="/employee/at-risk" className="ml-auto text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
            <X size={14} /> Clear all filters
          </Link>
        </div>
      )}

      {/* Request Cards */}
      <div className="grid grid-cols-1 gap-6">
        {atRiskRequests.length > 0 ? (
          atRiskRequests.map(req => (
            <div key={req.id} className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              
              {/* Header */}
              <div className="p-5 md:p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">REQUEST #{req.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{req.type}</h3>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold ${
                    req.riskLevel === 'Critical' ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
                    'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
                  }`}>
                    <AlertTriangle size={18} />
                    <span className="text-lg">{req.riskScore}%</span>
                    <span className="text-xs uppercase tracking-wider opacity-80">SLA BREACH RISK</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Time Remaining</h4>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                    <Clock size={16} className="text-gray-400" />
                    {req.timeRemaining}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Current Stage</h4>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {req.currentStage}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Bottleneck</h4>
                  <div className="text-red-600 dark:text-red-400 font-medium">
                    {req.bottleneck}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Recommended Action</h4>
                  <div className="text-fuchsia-600 dark:text-fuchsia-400 font-bold uppercase tracking-wider">
                    {req.recommendedAction}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-white/5 p-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                   <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority:</span>
                   <span className={`text-sm font-bold ${
                      req.priority === 'Critical' ? 'text-red-600 dark:text-red-400' :
                      req.priority === 'High' ? 'text-orange-600 dark:text-orange-400' :
                      req.priority === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' : ''
                    }`}>{req.priority}</span>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                  <Link 
                    to={`/employee/requests/${req.id}`}
                    className="flex-1 md:flex-none text-center bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 font-semibold py-2 px-6 rounded-xl transition-colors"
                  >
                    View Risk Analysis
                  </Link>
                  <Link 
                    to={`/employee/requests/${req.id}?action=true`}
                    className="flex-1 md:flex-none text-center bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] hover:from-[#c026d3] hover:to-[#7c3aed] text-white font-semibold py-2 px-6 rounded-xl transition-all shadow-md shadow-fuchsia-500/25 flex items-center justify-center gap-2 group"
                  >
                    Take Action
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-12 text-center">
             <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
               <span className="text-2xl">🎉</span>
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No At-Risk Requests</h3>
             <p className="text-gray-500 dark:text-gray-400">All your current requests are within their expected SLA risk range.</p>
          </div>
        )}
      </div>

    </div>
  );
}
