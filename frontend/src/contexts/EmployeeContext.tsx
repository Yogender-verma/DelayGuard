import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import processedDataRaw from '../data/processed_data.json';

interface ProcessedGrievance {
  original: {
    registration_no: string;
    date_of_receipt: string;
    org_code: string;
    current_status: string;
    subject_content_text: string;
    category_code: string;
  };
  derived: {
    service_type: string;
    sla_limit_days: number;
    elapsed_days: number;
    remaining_days: number;
    consumed_percentage: number;
    risk_score: number;
    risk_level: string;
    recommended_action: string;
    backlog: number;
    current_stage: string;
    historical_evidence: string[];
    stages: {
      name: string;
      duration: string;
      isCurrent: boolean;
      status: 'Completed' | 'Pending' | 'Current';
    }[];
  };
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type RequestStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Stage {
  name: string;
  duration: string;
  isCurrent: boolean;
  status: 'Completed' | 'Pending' | 'Current';
}

export interface WhatIfScenario {
  action: string;
  expectedRisk: number;
  expectedRiskLevel: RiskLevel;
}

export interface SLAData {
  totalSlaDays: number;
  elapsedDays: number;
  remainingDays: number;
  consumedPercentage: number;
}

export interface RiskFactors {
  slaConsumed: number;
  stageDelay: number;
  historicalStageRisk: number;
  teamBacklog: number;
}

export interface HistoricalInsight {
  title: string;
  description: string;
}

export interface RequestData {
  id: string;
  type: string;
  department: string;
  team: string;
  priority: Priority;
  createdAt: string;
  deadline: string;
  timeRemaining: string;
  currentStage: string;
  currentStageDuration: string;
  historicalAverage: string;
  historicalDelayRate: number;
  teamBacklog: number;
  riskScore: number;
  riskLevel: RiskLevel;
  bottleneck: string;
  recommendedAction: string;
  status: RequestStatus;
  stages: Stage[];
  slaData: SLAData;
  riskFactors: RiskFactors;
  whatIfScenarios: WhatIfScenario[];
  historicalInsights: HistoricalInsight[];
  reasoning: string[];
  isCpgrams?: boolean;
  originalGrievance?: any;
}

interface InterventionLog {
  date: string;
  action: string;
  targetId: string;
}

interface EmployeeContextType {
  requests: RequestData[];
  customSlas: Record<string, number>;
  toast: { message: string; type: 'success' | 'info' } | null;
  interventionHistory: InterventionLog[];
  executeIntervention: (requestId: string, action: string) => void;
  updateSlaConfig: (serviceType: string, days: number) => void;
  importRequests: (newRequests: any[]) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

const mapGrievanceToRequest = (g: ProcessedGrievance, customSlas: Record<string, number>): RequestData => {
  const orig = g.original;
  const der = g.derived;

  const serviceTypeLower = der.service_type.toLowerCase();
  const slaDays = customSlas[serviceTypeLower] !== undefined ? customSlas[serviceTypeLower] : der.sla_limit_days;
  
  const receiptDate = new Date(orig.date_of_receipt);
  const currentDate = new Date('2026-08-23');
  const diffTime = Math.abs(currentDate.getTime() - receiptDate.getTime());
  const elapsedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  
  const remainingDays = Math.max(0, slaDays - elapsedDays);
  const consumedPercentage = Math.min(100, Math.round((elapsedDays / slaDays) * 100));

  let riskScore = 15;
  const reasons: string[] = [];

  if (orig.current_status === 'Pending') {
    if (consumedPercentage >= 90) {
      riskScore += 40;
      reasons.push(`Critical SLA consumption: ${consumedPercentage}% of configured deadline elapsed.`);
    } else if (consumedPercentage >= 70) {
      riskScore += 25;
      reasons.push(`High SLA consumption: ${consumedPercentage}% of configured deadline elapsed.`);
    } else if (consumedPercentage >= 50) {
      riskScore += 10;
      reasons.push(`Moderate SLA consumption: ${consumedPercentage}% of deadline elapsed.`);
    }

    if (der.backlog >= 40) {
      riskScore += 30;
      reasons.push(`Team backlog overload: ${der.backlog} pending cases in current department queue.`);
    } else if (der.backlog >= 20) {
      riskScore += 15;
      reasons.push(`High department backlog: ${der.backlog} cases currently queueing.`);
    }

    const hasStageDelay = der.stages.some(s => s.isCurrent && s.name === 'Approval');
    if (hasStageDelay) {
      riskScore += 25;
      reasons.push("Severe bottleneck: current Approval stage duration exceeds historical averages.");
    }
  }

  riskScore = Math.min(100, riskScore);

  let riskLevel: RiskLevel = 'Low';
  let recommendedAction = 'Monitor';

  if (orig.current_status === 'Pending') {
    if (riskScore >= 80) {
      riskLevel = 'Critical';
      recommendedAction = 'Reassign';
    } else if (riskScore >= 60) {
      riskLevel = 'High';
      recommendedAction = 'Escalate';
    } else if (riskScore >= 40) {
      riskLevel = 'Medium';
      recommendedAction = 'Prioritize';
    }
  }

  return {
    id: orig.registration_no,
    type: der.service_type,
    department: orig.org_code,
    team: der.current_stage === 'Approval' ? 'Approval Team A' : 'Verification Team',
    priority: riskScore >= 80 ? 'Critical' : (riskScore >= 60 ? 'High' : (riskScore >= 40 ? 'Medium' : 'Low')),
    createdAt: new Date(orig.date_of_receipt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    deadline: new Date(receiptDate.getTime() + slaDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timeRemaining: remainingDays === 0 ? "Expired" : (remainingDays === 1 ? "1 day" : `${remainingDays} days`),
    currentStage: der.current_stage,
    currentStageDuration: `${Math.round(elapsedDays * 0.6)} days`,
    historicalAverage: der.current_stage === 'Approval' ? "1.5 days" : "1.0 days",
    historicalDelayRate: der.backlog >= 20 ? 68 : 15,
    teamBacklog: der.backlog,
    riskScore: orig.current_status === 'Pending' ? riskScore : 0,
    riskLevel: orig.current_status === 'Pending' ? riskLevel : 'Low',
    bottleneck: riskScore >= 60 ? `${orig.org_code} → ${der.current_stage}` : 'None',
    recommendedAction: orig.current_status === 'Pending' ? recommendedAction : 'Monitor',
    status: orig.current_status === 'Pending' ? 'Pending' : 'Completed',
    stages: der.stages,
    slaData: {
      totalSlaDays: slaDays,
      elapsedDays: elapsedDays,
      remainingDays: remainingDays,
      consumedPercentage: consumedPercentage
    },
    riskFactors: {
      slaConsumed: consumedPercentage,
      stageDelay: riskScore >= 60 ? 82 : 20,
      historicalStageRisk: der.backlog >= 20 ? 68 : 15,
      teamBacklog: Math.min(100, Math.round((der.backlog / 50) * 100))
    },
    whatIfScenarios: orig.current_status === 'Pending' ? [
      { action: 'Escalate', expectedRisk: Math.max(10, riskScore - 20), expectedRiskLevel: 'Medium' },
      { action: 'Prioritize', expectedRisk: Math.max(10, riskScore - 15), expectedRiskLevel: 'Medium' },
      { action: 'Reassign', expectedRisk: Math.max(10, riskScore - 40), expectedRiskLevel: 'Low' }
    ] : [],
    historicalInsights: [
      { title: "Department Workload", description: `${orig.org_code} is handling ${der.backlog} active grievances, increasing processing delays.` }
    ],
    reasoning: reasons.length > 0 ? reasons : ["Grievance is progressing normally within standard limits."],
    isCpgrams: true,
    originalGrievance: orig
  };
};

const mapImportedRowToGrievance = (row: any): ProcessedGrievance => {
  const serviceType = row.service_type || row.type || row.subject_content_text || 'General Grievance';
  
  const stages = [
    { name: "Submitted", duration: "1 day", isCurrent: false, status: "Completed" as const },
    { name: "Verification", duration: "2 days", isCurrent: row.current_stage !== 'Approval', status: row.current_stage === 'Approval' ? ("Completed" as const) : ("Current" as const) },
    { name: "Approval", duration: "Pending", isCurrent: row.current_stage === 'Approval', status: row.current_stage === 'Approval' ? ("Current" as const) : ("Pending" as const) }
  ];

  return {
    original: {
      registration_no: row.registration_no || row.id || `GOI-${Math.floor(210000 + Math.random() * 90000)}`,
      date_of_receipt: row.date_of_receipt || row.date || new Date().toISOString().split('T')[0],
      org_code: row.org_code || row.department || 'General Department',
      current_status: row.current_status || row.status || 'Pending',
      subject_content_text: row.subject_content_text || row.subject || `Imported grievance regarding ${serviceType.toLowerCase()}.`,
      category_code: row.category_code || 'CAT-000'
    },
    derived: {
      service_type: serviceType,
      sla_limit_days: parseInt(row.sla_limit_days || row.sla) || 15,
      elapsed_days: parseInt(row.elapsed_days) || 3,
      remaining_days: parseInt(row.remaining_days) || 12,
      consumed_percentage: parseInt(row.consumed_percentage) || 20,
      risk_score: parseInt(row.risk_score) || 15,
      risk_level: row.risk_level || 'Low',
      recommended_action: row.recommended_action || 'Monitor',
      backlog: parseInt(row.backlog) || 12,
      current_stage: row.current_stage || 'Verification',
      historical_evidence: row.historical_evidence ? (Array.isArray(row.historical_evidence) ? row.historical_evidence : [row.historical_evidence]) : [],
      stages: stages
    }
  };
};

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [customSlas, setCustomSlas] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('delayguard_sla_config');
    return saved ? JSON.parse(saved) : {};
  });

  const [interventions, setInterventions] = useState<Record<string, Partial<RequestData>>>({});

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const [interventionHistory, setInterventionHistory] = useState<InterventionLog[]>([
    { date: 'Yesterday, 03:20 PM', action: 'Escalated', targetId: 'GOI-204234' },
    { date: 'Aug 20, 11:15 AM', action: 'Prioritized', targetId: 'GOI-204235' }
  ]);

  const [importedGrievances, setImportedGrievances] = useState<ProcessedGrievance[]>([]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const updateSlaConfig = (serviceType: string, days: number) => {
    setCustomSlas(prev => {
      const updated = { ...prev, [serviceType.toLowerCase()]: days };
      localStorage.setItem('delayguard_sla_config', JSON.stringify(updated));
      return updated;
    });
  };

  const executeIntervention = (requestId: string, action: string) => {
    setInterventions(prev => ({
      ...prev,
      [requestId]: {
        riskScore: 10,
        riskLevel: 'Low',
        recommendedAction: 'Monitor',
        status: 'In Progress'
      }
    }));
    setInterventionHistory(prev => [
      {
        date: 'Just Now',
        action: action,
        targetId: requestId
      },
      ...prev
    ]);
    showToast(`Successfully executed ${action} for Request #${requestId}!`, 'success');
  };

  const importRequests = (rawRows: any[]) => {
    try {
      const mapped = rawRows.map(row => mapImportedRowToGrievance(row));
      setImportedGrievances(prev => [...mapped, ...prev]);
      showToast(`Successfully imported ${rawRows.length} requests!`, 'success');
    } catch (e) {
      showToast('Failed to import dataset.', 'info');
      console.error(e);
    }
  };

  const requests = useMemo(() => {
    const combined = [...importedGrievances, ...(processedDataRaw as ProcessedGrievance[])];
    return combined.map(g => {
      const mapped = mapGrievanceToRequest(g, customSlas);
      if (interventions[mapped.id]) {
        return {
          ...mapped,
          ...interventions[mapped.id]
        };
      }
      return mapped;
    });
  }, [customSlas, interventions, importedGrievances]);

  return (
    <EmployeeContext.Provider value={{ requests, customSlas, toast, interventionHistory, executeIntervention, updateSlaConfig, importRequests }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployeeData() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployeeData must be used within an EmployeeProvider');
  }
  return context;
}
