export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type RequestStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Stage {
  name: string;
  duration: string; // e.g., "2 hours", "0.8 days"
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
}

export const MOCK_REQUESTS: RequestData[] = [
  {
    id: '1042',
    type: 'Certificate Request',
    department: 'Revenue',
    team: 'Approval Team A',
    priority: 'Critical',
    createdAt: 'Aug 18, 2026',
    deadline: 'Aug 23, 2026',
    timeRemaining: '4 hours',
    currentStage: 'Approval',
    currentStageDuration: '3.2 days',
    historicalAverage: '1.5 days',
    historicalDelayRate: 68,
    teamBacklog: 42,
    riskScore: 93,
    riskLevel: 'Critical',
    bottleneck: 'Revenue → Approval',
    recommendedAction: 'Reassign',
    status: 'Pending',
    slaData: {
      totalSlaDays: 5,
      elapsedDays: 4.8,
      remainingDays: 0.2,
      consumedPercentage: 96,
    },
    riskFactors: {
      slaConsumed: 96,
      stageDelay: 82,
      historicalStageRisk: 68,
      teamBacklog: 60,
    },
    stages: [
      { name: 'Submitted', duration: '2 hours', isCurrent: false, status: 'Completed' },
      { name: 'Document Verification', duration: '0.8 days', isCurrent: false, status: 'Completed' },
      { name: 'Eligibility Check', duration: '0.6 days', isCurrent: false, status: 'Completed' },
      { name: 'Approval', duration: '3.2 days', isCurrent: true, status: 'Current' },
      { name: 'Final Processing', duration: 'Pending', isCurrent: false, status: 'Pending' }
    ],
    whatIfScenarios: [
      { action: 'Escalate', expectedRisk: 72, expectedRiskLevel: 'High' },
      { action: 'Prioritize', expectedRisk: 61, expectedRiskLevel: 'Medium' },
      { action: 'Add Resources', expectedRisk: 55, expectedRiskLevel: 'Medium' },
      { action: 'Reassign', expectedRisk: 48, expectedRiskLevel: 'Medium' },
    ],
    historicalInsights: [
      {
        title: "Stage Delay Pattern",
        description: "Historically, when the Approval stage exceeds 2.5 days, 85% of Certificate Requests breach their SLA."
      },
      {
        title: "Team Workload Impact",
        description: "Approval Team A currently has 42 pending requests. Backlogs over 30 typically slow processing times by 40%."
      }
    ],
    reasoning: [
      "96% of the SLA time has already been consumed.",
      "The request has been in the Approval stage for 3.2 days.",
      "Similar requests historically take only 1.5 days in this stage.",
      "The Approval stage has a historical delay rate of 68%.",
      "The current team has a high pending workload (42 items)."
    ]
  },
  {
    id: '1087',
    type: 'License Renewal',
    department: 'Licensing',
    team: 'Verification Team',
    priority: 'High',
    createdAt: 'Aug 19, 2026',
    deadline: 'Aug 23, 2026',
    timeRemaining: '6 hours',
    currentStage: 'Verification',
    currentStageDuration: '2.5 days',
    historicalAverage: '1.0 days',
    historicalDelayRate: 55,
    teamBacklog: 18,
    riskScore: 89,
    riskLevel: 'Critical',
    bottleneck: 'Licensing → Verification',
    recommendedAction: 'Escalate',
    status: 'Pending',
    slaData: {
      totalSlaDays: 4,
      elapsedDays: 3.75,
      remainingDays: 0.25,
      consumedPercentage: 94,
    },
    riskFactors: {
      slaConsumed: 94,
      stageDelay: 75,
      historicalStageRisk: 55,
      teamBacklog: 40,
    },
    stages: [
      { name: 'Submitted', duration: '4 hours', isCurrent: false, status: 'Completed' },
      { name: 'Verification', duration: '2.5 days', isCurrent: true, status: 'Current' },
      { name: 'Approval', duration: 'Pending', isCurrent: false, status: 'Pending' }
    ],
    whatIfScenarios: [
      { action: 'Escalate', expectedRisk: 45, expectedRiskLevel: 'Medium' },
      { action: 'Prioritize', expectedRisk: 65, expectedRiskLevel: 'Medium' },
    ],
    historicalInsights: [
      {
        title: "Escalation Efficacy",
        description: "License renewals escalated at this stage have a 90% SLA success recovery rate."
      }
    ],
    reasoning: [
      "94% of the SLA time has been consumed.",
      "Verification stage is taking 2.5x longer than historical average."
    ]
  },
  {
    id: '1102',
    type: 'Permit Application',
    department: 'Revenue',
    team: 'Review Team B',
    priority: 'Medium',
    createdAt: 'Aug 20, 2026',
    deadline: 'Aug 24, 2026',
    timeRemaining: '1 day',
    currentStage: 'Review',
    currentStageDuration: '1.8 days',
    historicalAverage: '1.2 days',
    historicalDelayRate: 40,
    teamBacklog: 22,
    riskScore: 72,
    riskLevel: 'High',
    bottleneck: 'Revenue → Review',
    recommendedAction: 'Prioritize',
    status: 'Pending',
    slaData: {
      totalSlaDays: 4,
      elapsedDays: 3,
      remainingDays: 1,
      consumedPercentage: 75,
    },
    riskFactors: {
      slaConsumed: 75,
      stageDelay: 60,
      historicalStageRisk: 40,
      teamBacklog: 45,
    },
    stages: [
      { name: 'Submitted', duration: '1 day', isCurrent: false, status: 'Completed' },
      { name: 'Review', duration: '1.8 days', isCurrent: true, status: 'Current' },
      { name: 'Issue', duration: 'Pending', isCurrent: false, status: 'Pending' }
    ],
    whatIfScenarios: [
      { action: 'Prioritize', expectedRisk: 30, expectedRiskLevel: 'Low' },
    ],
    historicalInsights: [
      {
        title: "Review Delays",
        description: "Permits stuck in review for >1.5 days benefit most from internal prioritization flags."
      }
    ],
    reasoning: [
      "Approaching final 24 hours of SLA.",
      "Moderate delay in Review stage."
    ]
  },
  {
    id: '1115',
    type: 'Complaint Resolution',
    department: 'Public Grievance',
    team: 'Resolution Desk',
    priority: 'Low',
    createdAt: 'Aug 21, 2026',
    deadline: 'Aug 25, 2026',
    timeRemaining: '2 days',
    currentStage: 'Investigation',
    currentStageDuration: '0.5 days',
    historicalAverage: '2 days',
    historicalDelayRate: 20,
    teamBacklog: 12,
    riskScore: 24,
    riskLevel: 'Low',
    bottleneck: 'None',
    recommendedAction: 'Monitor',
    status: 'In Progress',
    slaData: {
      totalSlaDays: 4,
      elapsedDays: 2,
      remainingDays: 2,
      consumedPercentage: 50,
    },
    riskFactors: {
      slaConsumed: 50,
      stageDelay: 10,
      historicalStageRisk: 20,
      teamBacklog: 25,
    },
    stages: [
      { name: 'Submitted', duration: '1.5 days', isCurrent: false, status: 'Completed' },
      { name: 'Investigation', duration: '0.5 days', isCurrent: true, status: 'Current' },
      { name: 'Resolution', duration: 'Pending', isCurrent: false, status: 'Pending' }
    ],
    whatIfScenarios: [],
    historicalInsights: [],
    reasoning: [
      "Processing normally on schedule."
    ]
  },
  {
    id: '1051',
    type: 'Tax Clearance',
    department: 'Tax',
    team: 'Audit Team',
    priority: 'Medium',
    createdAt: 'Aug 17, 2026',
    deadline: 'Aug 27, 2026',
    timeRemaining: '5 days',
    currentStage: 'Audit',
    currentStageDuration: '4 days',
    historicalAverage: '5 days',
    historicalDelayRate: 35,
    teamBacklog: 8,
    riskScore: 35,
    riskLevel: 'Low',
    bottleneck: 'None',
    recommendedAction: 'Monitor',
    status: 'In Progress',
    slaData: {
      totalSlaDays: 10,
      elapsedDays: 5,
      remainingDays: 5,
      consumedPercentage: 50,
    },
    riskFactors: {
      slaConsumed: 50,
      stageDelay: 20,
      historicalStageRisk: 35,
      teamBacklog: 15,
    },
    stages: [
      { name: 'Submitted', duration: '1 day', isCurrent: false, status: 'Completed' },
      { name: 'Audit', duration: '4 days', isCurrent: true, status: 'Current' },
      { name: 'Approval', duration: 'Pending', isCurrent: false, status: 'Pending' }
    ],
    whatIfScenarios: [],
    historicalInsights: [],
    reasoning: [
      "Plenty of SLA buffer remains."
    ]
  },
  {
    id: '1130',
    type: 'Zoning Approval',
    department: 'Urban Planning',
    team: 'Zoning Board',
    priority: 'High',
    createdAt: 'Aug 10, 2026',
    deadline: 'Aug 24, 2026',
    timeRemaining: '1 day',
    currentStage: 'Committee Review',
    currentStageDuration: '8 days',
    historicalAverage: '5 days',
    historicalDelayRate: 75,
    teamBacklog: 20,
    riskScore: 82,
    riskLevel: 'High',
    bottleneck: 'Urban Planning → Committee Review',
    recommendedAction: 'Prioritize',
    status: 'Pending',
    slaData: {
      totalSlaDays: 14,
      elapsedDays: 13,
      remainingDays: 1,
      consumedPercentage: 93,
    },
    riskFactors: {
      slaConsumed: 93,
      stageDelay: 90,
      historicalStageRisk: 75,
      teamBacklog: 50,
    },
    stages: [
      { name: 'Submitted', duration: '2 days', isCurrent: false, status: 'Completed' },
      { name: 'Initial Survey', duration: '3 days', isCurrent: false, status: 'Completed' },
      { name: 'Committee Review', duration: '8 days', isCurrent: true, status: 'Current' }
    ],
    whatIfScenarios: [
      { action: 'Prioritize', expectedRisk: 40, expectedRiskLevel: 'Medium' }
    ],
    historicalInsights: [
      {
        title: "Committee Scheduling",
        description: "Committee reviews often stall without a priority tag flagging it for the next agenda."
      }
    ],
    reasoning: [
      "Committee review has taken 3 days longer than average."
    ]
  },
  // Adding more standard mock records to fill out the table
  ...Array.from({ length: 9 }).map((_, i) => {
    const id = (1150 + i).toString();
    const isMedium = i % 3 === 0;
    const isHigh = i % 4 === 0;
    const riskLevel = isHigh ? 'High' : (isMedium ? 'Medium' : 'Low');
    const riskScore = isHigh ? 75 + i : (isMedium ? 45 + i : 15 + i);
    
    return {
      id,
      type: ['Birth Certificate', 'Property Tax', 'Business License', 'Water Connection'][i % 4],
      department: ['Certificates', 'Tax', 'Licensing', 'Utilities'][i % 4],
      team: 'Standard Processing',
      priority: isHigh ? 'High' : 'Medium' as Priority,
      createdAt: 'Aug 22, 2026',
      deadline: `Aug ${25 + i}, 2026`,
      timeRemaining: `${3 + i} days`,
      currentStage: 'Initial Review',
      currentStageDuration: '0.5 days',
      historicalAverage: '2 days',
      historicalDelayRate: 30,
      teamBacklog: 15,
      riskScore,
      riskLevel: riskLevel as RiskLevel,
      bottleneck: isHigh ? 'Processing Delay' : 'None',
      recommendedAction: isHigh ? 'Prioritize' : 'Monitor',
      status: 'Pending' as RequestStatus,
      slaData: {
        totalSlaDays: 7,
        elapsedDays: 2,
        remainingDays: 5,
        consumedPercentage: 30 + (i*5),
      },
      riskFactors: {
        slaConsumed: 30,
        stageDelay: 20,
        historicalStageRisk: 30,
        teamBacklog: 15,
      },
      stages: [
        { name: 'Submitted', duration: '1 day', isCurrent: false, status: 'Completed' as const },
        { name: 'Initial Review', duration: '0.5 days', isCurrent: true, status: 'Current' as const }
      ],
      whatIfScenarios: [],
      historicalInsights: [],
      reasoning: ["Routine request following standard processing time."]
    };
  })
];
