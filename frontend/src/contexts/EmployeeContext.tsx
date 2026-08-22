import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_REQUESTS, RequestData } from '../data/mockRequests';

interface EmployeeContextType {
  requests: RequestData[];
  executeIntervention: (requestId: string, action: string) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<RequestData[]>(MOCK_REQUESTS);

  // Shared state action simulating an intervention
  const executeIntervention = (requestId: string, action: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        // Lower the risk score and change the status/recommendation based on action taken
        const newRiskScore = Math.max(10, req.riskScore - 40); 
        const newRiskLevel = newRiskScore < 40 ? 'Low' : (newRiskScore < 70 ? 'Medium' : 'High');
        return {
          ...req,
          riskScore: newRiskScore,
          riskLevel: newRiskLevel,
          recommendedAction: 'Monitor', // Action taken, now just monitor
          status: 'In Progress'
        };
      }
      return req;
    }));
  };

  return (
    <EmployeeContext.Provider value={{ requests, executeIntervention }}>
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
