import React, { useState } from 'react';
import { useEmployeeData } from '../../contexts/EmployeeContext';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye } from 'lucide-react';

export default function MyRequests() {
  const { requests } = useEmployeeData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.id.includes(searchTerm) || 
      req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRisk = riskFilter === 'All' || req.riskLevel === riskFilter;
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || req.priority === priorityFilter;
    const matchesDept = deptFilter === 'All' || req.department === deptFilter;

    return matchesSearch && matchesRisk && matchesStatus && matchesPriority && matchesDept;
  });

  return (
    <div className="space-y-6 animate-hero-entry">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Requests</h1>
        <p className="text-gray-500 dark:text-gray-400">All service requests currently assigned to you.</p>
      </div>

      <div className="bg-white dark:bg-[#121524] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        
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
                  <tr key={req.id} className="hover:bg-gray-50/50 dark:hover:bg-white-[0.02] transition-colors">
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
    </div>
  );
}
