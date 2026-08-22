import React, { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEmployeeData } from '../../contexts/EmployeeContext';
import { 
  ArrowLeft, AlertTriangle, Clock, Target, 
  Activity, RefreshCcw, TrendingUp, HelpCircle, 
  CheckCircle2, X
} from 'lucide-react';

export default function RequestDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { requests, executeIntervention } = useEmployeeData();
  
  const req = requests.find(r => r.id === id);
  const [modalOpen, setModalOpen] = useState(new URLSearchParams(location.search).get('action') === 'true');

  if (!req) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-bold mb-4">Request not found</h2>
        <Link to="/employee/requests" className="text-fuchsia-600 hover:underline">Back to My Requests</Link>
      </div>
    );
  }

  const handleAction = () => {
    executeIntervention(req.id, req.recommendedAction);
    setModalOpen(false);
    // Could show a toast here in a real app
  };

  const riskColor = 
    req.riskLevel === 'Critical' ? 'red' :
    req.riskLevel === 'High' ? 'orange' :
    req.riskLevel === 'Medium' ? 'yellow' : 'green';

  return (
    <div className="space-y-6 pb-20 animate-hero-entry relative">
      
      {/* Header */}
      <div>
        <Link to="/employee/requests" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-fuchsia-600 mb-6 font-medium transition-colors">
          <ArrowLeft size={16} /> Back to My Requests
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-sm font-semibold text-gray-500">REQUEST #{req.id}</span>
              <span className="px-2.5 py-1 bg-gray-200 dark:bg-white/10 rounded-md text-xs font-semibold">{req.department}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{req.type}</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right">
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Time Remaining</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-end gap-2">
                  <Clock size={20} className="text-gray-400" />
                  {req.timeRemaining}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* SLA Progress Visualization */}
      <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">SLA Progress</h3>
           <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 font-bold bg-${riskColor}-50 text-${riskColor}-700 border border-${riskColor}-200 dark:bg-${riskColor}-500/10 dark:text-${riskColor}-400 dark:border-${riskColor}-500/20`}>
             <AlertTriangle size={16} />
             {req.riskScore}% {req.riskLevel.toUpperCase()} RISK
           </div>
        </div>

        <div className="relative pt-6 pb-2">
           {/* Progress Line */}
           <div className="absolute top-8 left-0 w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full"></div>
           <div 
             className={`absolute top-8 left-0 h-1.5 rounded-full bg-gradient-to-r ${
               req.riskLevel === 'Critical' ? 'from-red-400 to-red-600' :
               req.riskLevel === 'High' ? 'from-orange-400 to-orange-600' :
               'from-green-400 to-green-600'
             }`}
             style={{ width: `${req.slaData.consumedPercentage}%` }}
           ></div>

           {/* Nodes */}
           <div className="flex justify-between relative z-10 text-xs font-semibold">
             <div className="flex flex-col items-center -ml-4">
               <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-[#121524] mb-2"></div>
               <span className="text-gray-500 dark:text-gray-400">Created</span>
             </div>
             
             <div className="flex flex-col items-center absolute" style={{ left: `${req.slaData.consumedPercentage}%`, transform: 'translateX(-50%)' }}>
               <div className="w-5 h-5 rounded-full bg-white dark:bg-[#121524] border-4 border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)] mb-2 -mt-0.5 relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded text-[10px] whitespace-nowrap font-bold">
                    NOW
                  </div>
               </div>
               <span className="text-gray-900 dark:text-white">Elapsed: {req.slaData.elapsedDays} days</span>
             </div>

             <div className="flex flex-col items-center -mr-4">
               <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-[#121524] mb-2"></div>
               <span className="text-gray-500 dark:text-gray-400">Deadline</span>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Why is this at risk? */}
          <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <HelpCircle size={18} className="text-fuchsia-500" />
              Why is this request at risk?
            </h3>
            <ul className="space-y-4">
              {req.reasoning.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <AlertTriangle size={18} className={`shrink-0 mt-0.5 ${req.riskLevel === 'Low' ? 'text-green-500' : 'text-orange-500'}`} />
                  <span className="text-gray-700 dark:text-gray-300">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Process Timeline */}
          <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Process Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:to-transparent dark:before:from-white/10">
              {req.stages.map((stage, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-4 border-white dark:border-[#121524] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${
                    stage.status === 'Completed' ? 'bg-green-500' : 
                    stage.isCurrent ? 'bg-fuchsia-500' : 'bg-gray-300 dark:bg-gray-700'
                  }`}>
                    {stage.status === 'Completed' && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  
                  <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border ${
                    stage.isCurrent ? 'bg-fuchsia-50 dark:bg-fuchsia-500/10 border-fuchsia-200 dark:border-fuchsia-500/20' : 
                    'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-bold ${stage.isCurrent ? 'text-fuchsia-700 dark:text-fuchsia-400' : 'text-gray-900 dark:text-white'}`}>{stage.name}</h4>
                      <span className="text-xs font-semibold text-gray-500">{stage.duration}</span>
                    </div>
                    {stage.isCurrent && (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-fuchsia-200 dark:bg-fuchsia-500/20 text-fuchsia-800 dark:text-fuchsia-300 mt-2">
                        CURRENT STAGE
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottleneck Section */}
          <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Target size={18} className="text-red-500" />
              Where is the Bottleneck?
            </h3>
            
            {req.bottleneck !== 'None' ? (
              <>
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl mb-6 inline-flex items-center gap-2 font-bold text-red-700 dark:text-red-400">
                  🔥 PRIMARY BOTTLENECK: {req.bottleneck}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Historical Avg</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{req.historicalAverage}</div>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-100 dark:border-orange-500/20">
                    <div className="text-xs text-orange-600 dark:text-orange-400 uppercase font-semibold mb-1">Current Duration</div>
                    <div className="text-lg font-bold text-orange-700 dark:text-orange-300">{req.currentStageDuration}</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Delay Rate</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{req.historicalDelayRate}%</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Queue Size</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{req.teamBacklog}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-500">No major bottlenecks detected for this request.</div>
            )}
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Recommended Action */}
          <div className="bg-gradient-to-br from-fuchsia-600 to-purple-700 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            
            <h3 className="font-bold text-fuchsia-100 uppercase tracking-wider mb-6 text-sm">What should you do?</h3>
            
            <div className="mb-6">
              <div className="text-xs text-fuchsia-200 uppercase font-semibold mb-1">Recommended Action</div>
              <div className="text-3xl font-bold flex items-center gap-2">
                <RefreshCcw size={28} /> {req.recommendedAction}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <div className="text-sm font-semibold text-fuchsia-200 mb-1">WHY?</div>
                <div className="text-sm text-fuchsia-50">Historical patterns suggest this intervention is most effective given the current bottleneck.</div>
              </div>
            </div>

            {req.recommendedAction !== 'Monitor' && (
              <button 
                onClick={() => setModalOpen(true)}
                className="w-full bg-white text-fuchsia-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
              >
                Take Action Now
              </button>
            )}
          </div>

          {/* Historical Insights */}
          {req.historicalInsights.length > 0 && (
            <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 text-sm">
                <TrendingUp size={16} className="text-blue-500" />
                Prediction Basis
              </h3>
              <div className="space-y-4">
                {req.historicalInsights.map((insight, idx) => (
                  <div key={idx} className="p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl">
                    <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-1">{insight.title}</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200/80">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Factors */}
          <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 text-sm">Risk Factors</h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">SLA Time Consumed</span>
                  <span className="font-bold text-gray-900 dark:text-white">{req.riskFactors.slaConsumed}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-fuchsia-500" style={{ width: `${req.riskFactors.slaConsumed}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Stage Delay</span>
                  <span className="font-bold text-gray-900 dark:text-white">{req.riskFactors.stageDelay}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${req.riskFactors.stageDelay}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Historical Stage Risk</span>
                  <span className="font-bold text-gray-900 dark:text-white">{req.riskFactors.historicalStageRisk}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: `${req.riskFactors.historicalStageRisk}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* What-If Analysis */}
          {req.whatIfScenarios.length > 0 && (
            <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1 text-sm flex items-center gap-2">
                <Activity size={16} className="text-indigo-500" />
                What-If Analysis
              </h3>
              <p className="text-xs text-gray-500 mb-4">Estimated impact of interventions.</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                   <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Risk</span>
                   <span className="font-bold text-gray-900 dark:text-white">{req.riskScore}%</span>
                </div>
                
                {req.whatIfScenarios.map((scenario, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${
                    scenario.action === req.recommendedAction 
                      ? 'bg-fuchsia-50 dark:bg-fuchsia-500/10 border-fuchsia-200 dark:border-fuchsia-500/20' 
                      : 'bg-white dark:bg-transparent border-gray-100 dark:border-white/10'
                  }`}>
                     <div className="flex items-center gap-2">
                       <span className={`text-sm font-semibold ${scenario.action === req.recommendedAction ? 'text-fuchsia-700 dark:text-fuchsia-400' : 'text-gray-700 dark:text-gray-300'}`}>
                         If {scenario.action}
                       </span>
                       {scenario.action === req.recommendedAction && (
                         <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-fuchsia-200 dark:bg-fuchsia-500/20 text-fuchsia-800 dark:text-fuchsia-300">BEST</span>
                       )}
                     </div>
                     <span className={`font-bold ${
                        scenario.expectedRiskLevel === 'Low' ? 'text-green-600 dark:text-green-400' :
                        scenario.expectedRiskLevel === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-orange-600 dark:text-orange-400'
                     }`}>
                       {scenario.expectedRisk}%
                     </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-4 text-center">Estimated using historical patterns. Not guaranteed.</p>
            </div>
          )}

        </div>
      </div>

      {/* Take Action Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-lg relative z-10 animate-hero-entry overflow-hidden">
            
            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-white/5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">{req.recommendedAction.toUpperCase()} REQUEST</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Target Request</div>
                <div className="font-bold text-gray-900 dark:text-white">#{req.id} - {req.type}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Current Team</div>
                  <div className="font-bold text-gray-900 dark:text-white">{req.team}</div>
                </div>
                {req.recommendedAction === 'Reassign' && (
                  <div className="p-4 bg-fuchsia-50 dark:bg-fuchsia-500/10 rounded-xl border border-fuchsia-100 dark:border-fuchsia-500/20">
                    <div className="text-xs text-fuchsia-600 dark:text-fuchsia-400 font-semibold uppercase tracking-wider mb-1">Target Team</div>
                    <div className="font-bold text-fuchsia-800 dark:text-fuchsia-300">Approval Team B</div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Intervention Reason</div>
                <div className="text-gray-700 dark:text-gray-300 text-sm">
                  The current team has a high backlog of {req.teamBacklog} items. Historical data indicates this intervention will reduce SLA breach risk from {req.riskScore}% to {req.whatIfScenarios.find(s => s.action === req.recommendedAction)?.expectedRisk || 'a safer level'}%.
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                Cancel
              </button>
              <button onClick={handleAction} className="px-5 py-2.5 rounded-xl font-semibold bg-fuchsia-600 hover:bg-fuchsia-700 text-white transition-colors shadow-lg shadow-fuchsia-500/25">
                Confirm {req.recommendedAction}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
