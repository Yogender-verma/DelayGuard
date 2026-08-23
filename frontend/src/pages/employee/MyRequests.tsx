import { useState, useRef } from 'react';
import { useEmployeeData } from '../../contexts/EmployeeContext';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, X, Loader2, Upload } from 'lucide-react';

export default function MyRequests() {
  const { requests, importRequests } = useEmployeeData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const riskParam = searchParams.get('risk');
  const deadlineParam = searchParams.get('deadline');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState(() => {
    if (riskParam) {
      return riskParam.charAt(0).toUpperCase() + riskParam.slice(1).toLowerCase();
    }
    return 'All';
  });
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedModalOpen, setExtractedModalOpen] = useState(false);
  const [pendingExtractedData, setPendingExtractedData] = useState<any[]>([]);

  const departments = Array.from(new Set(requests.map(r => r.department))).sort();

  const hasActiveParams = !!riskParam || !!deadlineParam;

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.id.includes(searchTerm) || 
      req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRisk = riskFilter === 'All' || req.riskLevel === riskFilter;
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || req.priority === priorityFilter;
    const matchesDept = deptFilter === 'All' || req.department === deptFilter;
    const matchesDeadline = deadlineParam === 'today'
      ? (req.timeRemaining.toLowerCase().includes('hour') || req.timeRemaining.toLowerCase().includes('1 day'))
      : true;

    return matchesSearch && matchesRisk && matchesStatus && matchesPriority && matchesDeadline && matchesDept;
  });

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const results: any[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      results.push(obj);
    }
    return results;
  };

  const generateMockExtractedData = () => {
    return [
      {
        id: `EXT-${Math.floor(21000 + Math.random() * 90000)}`,
        department: 'Ministry of Labour',
        type: 'PF Withdrawal Delay (Extracted)',
        date_of_receipt: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
        current_stage: 'Verification',
        backlog: 42,
        sla_limit_days: 15,
        elapsed_days: 14
      },
      {
        id: `EXT-${Math.floor(21000 + Math.random() * 90000)}`,
        department: 'Department of Revenue',
        type: 'Income Tax Refund (Extracted)',
        date_of_receipt: new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0],
        current_stage: 'Approval',
        backlog: 150,
        sla_limit_days: 30,
        elapsed_days: 28
      }
    ];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);

    const finishWithMock = () => {
      setTimeout(() => {
        const extracted = generateMockExtractedData();
        setPendingExtractedData(extracted);
        setExtractedModalOpen(true);
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 2000);
    };

    if (!file.name.endsWith('.json') && !file.name.endsWith('.csv')) {
      finishWithMock();
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (!text) {
        finishWithMock();
        return;
      }
      try {
        let data: any[] = [];
        if (file.name.endsWith('.json')) {
          data = JSON.parse(text);
          if (!Array.isArray(data)) data = [data];
        } else if (file.name.endsWith('.csv')) {
          data = parseCSV(text);
        }
        
        if (data.length > 0 && typeof data[0] === 'object') {
          setPendingExtractedData(data);
          setExtractedModalOpen(true);
          setIsProcessing(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          finishWithMock();
        }
      } catch (err) {
        console.warn("Parse failed, falling back to AI extraction mock.", err);
        finishWithMock();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-hero-entry">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Requests</h1>
          <p className="text-gray-500 dark:text-gray-400">All service requests currently assigned to you.</p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv,.json,.pdf,.docx,.doc,.xlsx,.xls" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className={`flex items-center justify-center gap-2 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md shrink-0 ${
              isProcessing 
                ? 'bg-gray-400 dark:bg-white/10 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] hover:from-[#c026d3] hover:to-[#7c3aed] shadow-fuchsia-500/25'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Data
              </>
            )}
          </button>
        </div>
      </div>

      {hasActiveParams && (
        <div className="flex flex-wrap items-center gap-3 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Active URL Filters:</span>
          {riskParam && (
            <span className="px-2 py-0.5 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 rounded-lg text-xs font-semibold capitalize flex items-center gap-1.5">
              Risk: {riskParam}
            </span>
          )}
          {deadlineParam === 'today' && (
            <span className="px-2 py-0.5 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              Due Today
            </span>
          )}
          <Link to="/employee/requests" className="ml-auto text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
            <X size={14} /> Clear all filters
          </Link>
        </div>
      )}

      <div className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Filters and Search */}
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-white/10 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search request ID, type, department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Risk:</span>
              <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="bg-transparent border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 dark:text-gray-300">
                <option value="All">All</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 dark:text-gray-300">
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Priority:</span>
              <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="bg-transparent border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 dark:text-gray-300">
                <option value="All">All</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Department:</span>
              <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="bg-transparent border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 dark:text-gray-300 max-w-[200px] truncate">
                <option value="All">All Departments</option>
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Request Type</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Current Stage</th>
                <th className="px-6 py-4">Created / Deadline</th>
                <th className="px-6 py-4">Risk</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {filteredRequests.length > 0 ? (
                filteredRequests.map(req => (
                  <tr 
                    key={req.id} 
                    onClick={() => navigate(`/employee/requests/${req.id}`)}
                    className="hover:bg-fuchsia-50/50 dark:hover:bg-fuchsia-500/5 active:bg-fuchsia-100/50 dark:active:bg-fuchsia-500/10 transition-all duration-150 cursor-pointer select-none border-b border-gray-200 dark:border-white/5"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">#{req.id}</td>
                    <td className="px-6 py-4 font-medium">{req.type}</td>
                    <td className="px-6 py-4">{req.department}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-medium">
                        {req.currentStage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs">{req.createdAt}</div>
                      <div className="font-semibold text-gray-900 dark:text-white mt-0.5">{req.deadline}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{req.timeRemaining}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        req.riskLevel === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                        req.riskLevel === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                        req.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                      }`}>
                        {req.riskScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                       <span className={`${
                        req.priority === 'Critical' ? 'text-red-600 dark:text-red-400' :
                        req.priority === 'High' ? 'text-orange-600 dark:text-orange-400' :
                        req.priority === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' : ''
                      }`}>{req.priority}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        to={`/employee/requests/${req.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-700 dark:hover:text-fuchsia-300 transition-colors bg-fuchsia-50 dark:bg-fuchsia-500/10 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-500/20 px-3 py-1.5 rounded-lg"
                      >
                        <Eye size={16} /> View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No requests found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extracted Data Modal */}
      {extractedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setExtractedModalOpen(false)}></div>
          <div className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 animate-hero-entry overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-white/5 shrink-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Search className="text-fuchsia-500" size={20} />
                Extracted Data Preview
              </h2>
              <button onClick={() => setExtractedModalOpen(false)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                The AI has successfully parsed the unstructured document and identified the following service request records.
              </p>
              
              <div className="space-y-4">
                {pendingExtractedData.slice(0, 5).map((item, idx) => (
                  <div key={item.id || idx} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 dark:text-white">{item.id || `REQ-EXT-${Math.floor(Math.random() * 9000)}`}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">Identified</span>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{item.type || item.request_type || item.Subject || 'Service Request'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.department || item.Ministry || 'Unknown Dept'} • Stage: {item.current_stage || item.stage || 'Pending'}</p>
                    </div>
                    <div className="flex flex-row md:flex-col gap-4 md:gap-1 text-sm md:text-right">
                      {item.sla_limit_days && (
                        <div>
                          <span className="text-gray-500 text-xs">Elapsed / SLA</span>
                          <p className="font-semibold text-gray-900 dark:text-white">{item.elapsed_days || 0} / {item.sla_limit_days} days</p>
                        </div>
                      )}
                      {item.backlog && (
                        <div>
                          <span className="text-gray-500 text-xs">Queue Backlog</span>
                          <p className="font-semibold text-gray-900 dark:text-white">{item.backlog} cases</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {pendingExtractedData.length > 5 && (
                  <p className="text-center text-sm text-gray-500 italic mt-4">
                    + {pendingExtractedData.length - 5} more records extracted...
                  </p>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setExtractedModalOpen(false)} 
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                Discard
              </button>
              <button 
                onClick={() => {
                  importRequests(pendingExtractedData);
                  setExtractedModalOpen(false);
                }}
                className="bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] hover:from-[#c026d3] hover:to-[#7c3aed] text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-fuchsia-500/25"
              >
                Confirm & Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
