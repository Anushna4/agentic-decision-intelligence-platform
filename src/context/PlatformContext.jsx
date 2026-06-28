import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PlatformContext = createContext(null);

export const ROLES = {
  ANALYST: {
    id: 'analyst',
    name: 'Decision Analyst',
    description: 'Build, configure, and edit decision logic pipelines and coordinate agent schemas.',
    color: 'blue',
    icon: 'Brain'
  },
  SUPERVISOR: {
    id: 'supervisor',
    name: 'Agent Supervisor',
    description: 'Monitor real-time multi-agent execution, check process logs, and override agent pathways.',
    color: 'indigo',
    icon: 'Eye'
  },
  EXECUTIVE: {
    id: 'executive',
    name: 'Executive Approver',
    description: 'Review final synthesis recommendations, authorize actions, and compare scenarios.',
    color: 'sky',
    icon: 'Award'
  },
  ADMIN: {
    id: 'admin',
    name: 'System Administrator',
    description: 'Manage API integrations, coordinate knowledge sources, and view resource costs.',
    color: 'slate',
    icon: 'Shield'
  }
};

const INITIAL_FLOWS = [
  {
    id: 'flow-101',
    name: 'Q3 Global Supply Chain Allocation',
    description: 'Rerouting and supplier selection to mitigate European port strikes and rising fuel tariffs.',
    status: 'processing', // 'processing', 'pending_approval', 'completed', 'failed'
    progress: 30,
    timestamp: '2026-06-27 18:30',
    initiator: 'Sarah Jenkins',
    agentCost: '$18.45',
    confidenceScore: 94,
    domain: 'Logistics & Supply Chain',
    agents: [
      { name: 'Data Ingestion Agent', status: 'completed' },
      { name: 'Market Forecasting Agent', status: 'completed' },
      { name: 'Monte Carlo Simulator', status: 'active' },
      { name: 'Compliance Auditor', status: 'idle' }
    ],
    steps: [
      { 
        id: 1, 
        name: 'Ingest Global Inventory & Freight Logs', 
        status: 'completed', 
        logs: [
          '[00:01] Initializing data ingestion pipeline...',
          '[00:03] Connected to Oracle ERP & active shipment APIs.',
          '[00:05] Ingested 1.4M active transaction records.',
          '[00:07] Checked integrity. Corrected 12 incomplete shipment locations.',
          '[00:10] Ingestion complete. Output schema verified.'
        ] 
      },
      { 
        id: 2, 
        name: 'Evaluate Global Freight Tariffs & Weather', 
        status: 'completed', 
        logs: [
          '[00:12] Activating Market Intelligence Agent...',
          '[00:15] Fetching live fuel rates and strike updates for Rotterdam and Antwerp ports.',
          '[00:18] Identified a 22% risk of disruption in Rotterdam route over next 14 days.',
          '[00:21] Running route alternative simulations (Cape of Good Hope vs. Suez Canal).',
          '[00:25] Route cost-benefit vectors computed.'
        ] 
      },
      { 
        id: 3, 
        name: 'Monte Carlo Decision-Risk Profiling', 
        status: 'processing', 
        logs: [
          '[00:27] Starting Monte Carlo engine (10,000 iterations)...',
          '[00:29] Simulating supplier bottleneck risk factors...',
          '[00:32] Scenario 1,400: Primary supplier defaults; lead time increases by +18 days.'
        ] 
      },
      { 
        id: 4, 
        name: 'Optimize Vendor Bid Configurations', 
        status: 'pending', 
        logs: [] 
      },
      { 
        id: 5, 
        name: 'Audit Trade Compliance & Sanctions', 
        status: 'pending', 
        logs: [] 
      }
    ]
  },
  {
    id: 'flow-102',
    name: 'SaaS Infrastructure Cost Optimization',
    description: 'Downsizing idle instances and shifting workload distributions across AWS & Azure.',
    status: 'pending_approval',
    progress: 100,
    timestamp: '2026-06-27 17:15',
    initiator: 'Sarah Jenkins',
    agentCost: '$8.12',
    confidenceScore: 89,
    domain: 'IT Operations',
    agents: [
      { name: 'Cloud Monitor Agent', status: 'completed' },
      { name: 'Billing Cost Auditor', status: 'completed' },
      { name: 'Risk Predictor Agent', status: 'completed' }
    ],
    steps: [
      { id: 1, name: 'Cloud Metric Parsing', status: 'completed', logs: ['Parsed cloud utilization metrics.', 'Identified 32 underutilized EC2 nodes.'] },
      { id: 2, name: 'Billing Audit', status: 'completed', logs: ['Reconciled invoices with active nodes.', 'Calculated potential savings: $4,200/mo.'] },
      { id: 3, name: 'Risk and Latency Forecasts', status: 'completed', logs: ['Simulated impact of resource downsizing.', 'Calculated latency drift: +4ms (negligible).'] }
    ],
    recommendation: {
      action: 'Downsize 12 EC2 instances from m5.xlarge to m5.large and purchase Savings Plans.',
      savings: '$4,180 / month',
      riskLevel: 'Low',
      confidence: '89%',
      alternatives: [
        { name: 'Downsize all 32 nodes immediately', cost: 'Saves $9,400', risk: 'High (Latency spike risk)', score: '62%' },
        { name: 'Do nothing (Keep current config)', cost: 'Saves $0', risk: 'None', score: '50%' }
      ]
    }
  },
  {
    id: 'flow-103',
    name: 'Supplier Credit & Risk Re-Evaluation',
    description: 'Assessing liquidity reports, credit defaults, and regional economic stability factors.',
    status: 'completed',
    progress: 100,
    timestamp: '2026-06-27 15:40',
    initiator: 'David Chen',
    agentCost: '$12.90',
    confidenceScore: 97,
    domain: 'Finance & Risk',
    agents: [
      { name: 'Finance Scraper Agent', status: 'completed' },
      { name: 'NLP Sentiment Auditor', status: 'completed' }
    ],
    steps: [
      { id: 1, name: 'Finance Data Scan', status: 'completed', logs: ['Scanned financial filings for Top 20 suppliers.', 'Flagged credit score drops for 2 vendors.'] },
      { id: 2, name: 'Sentiment Assessment', status: 'completed', logs: ['Analyzed earnings calls transcripts.', 'Identified high risk rating for Supplier B.'] }
    ],
    recommendation: {
      action: 'Decrease credit exposure to Supplier B by 40% and establish secondary vendor contracts.',
      savings: 'Avoided potential $140,000 supply breach',
      riskLevel: 'Medium',
      confidence: '97%',
      alternatives: [
        { name: 'Terminate Supplier B immediately', cost: 'Breach penalty $25k', risk: 'Medium-High', score: '78%' },
        { name: 'Maintain current relationship with extra insurance', cost: 'Insurance premiums +$15k', risk: 'Low', score: '82%' }
      ]
    }
  },
  {
    id: 'flow-104',
    name: 'Dynamic Product Pricing Engine Update',
    description: 'Adjusting pricing thresholds based on competitor changes and current inventory levels.',
    status: 'failed',
    progress: 60,
    timestamp: '2026-06-27 14:10',
    initiator: 'System Cron',
    agentCost: '$4.20',
    confidenceScore: 32,
    domain: 'Marketing & Sales',
    agents: [
      { name: 'Competitor Scraper', status: 'completed' },
      { name: 'Elasticity Calculator', status: 'failed' }
    ],
    steps: [
      { id: 1, name: 'Competitor Price Scraping', status: 'completed', logs: ['Scraped pricing from 5 competitor websites.', 'Processed 1,200 SKUs successfully.'] },
      { id: 2, name: 'Price Elasticity Modeling', status: 'failed', logs: ['Running demand model regressions...', '[Error] Encountered singularity matrix in competitor product matching.', 'Elasticity Agent crashed due to bad SKU alignment. Process halted.'] }
    ]
  }
];

export const PlatformProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Sarah Jenkins',
    email: 's.jenkins@enterprise.ai',
    avatar: 'SJ',
    company: 'Apex Decision Corp'
  });
  const [selectedRole, setSelectedRole] = useState(ROLES.SUPERVISOR); // Default for demo
  const [flows, setFlows] = useState(INITIAL_FLOWS);
  const [selectedFlowId, setSelectedFlowId] = useState('flow-101');
  const [activeAnalysisFile, setActiveAnalysisFile] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);

  // Simulation timer for 'processing' status on flow-101
  const processingRef = useRef(null);

  useEffect(() => {
    // Set up active simulation for flow-101
    const runSimulation = () => {
      setFlows(prevFlows => {
        return prevFlows.map(flow => {
          if (flow.id !== 'flow-101' || flow.status !== 'processing') {
            return flow;
          }

          const currentProgress = flow.progress;
          let nextProgress = currentProgress + 4;
          let nextStatus = 'processing';
          const updatedSteps = [...flow.steps];

          // Locate current active step (step 3 is active)
          const activeStepIndex = updatedSteps.findIndex(s => s.status === 'processing');
          
          if (activeStepIndex !== -1) {
            const step = { ...updatedSteps[activeStepIndex] };
            const newLogs = [...step.logs];

            // Add simulated logs
            if (currentProgress % 12 === 0) {
              newLogs.push(`[00:${Math.floor(currentProgress * 0.8) + 30}] Processing Monte Carlo simulation iteration ${Math.floor(currentProgress * 100)}...`);
            }
            if (currentProgress % 20 === 0) {
              newLogs.push(`[00:${Math.floor(currentProgress * 0.8) + 32}] Risk model variance checked: acceptable tolerance. [Risk score: 0.14]`);
            }

            // Progress steps
            if (nextProgress >= 60 && step.id === 3) {
              // Complete step 3, start step 4
              step.status = 'completed';
              step.logs.push('[00:35] Monte Carlo simulations completed. Risk bounds defined.');
              updatedSteps[activeStepIndex] = step;

              const nextStep = { ...updatedSteps[activeStepIndex + 1] };
              nextStep.status = 'processing';
              nextStep.logs = [
                '[00:36] Ingesting optimized vendor constraints...',
                '[00:38] Starting Solver. Resolving multi-objective supply vectors...'
              ];
              updatedSteps[activeStepIndex + 1] = nextStep;
            } else if (nextProgress >= 85 && updatedSteps[3].status === 'processing') {
              // Complete step 4, start step 5
              const step4 = { ...updatedSteps[3] };
              step4.status = 'completed';
              step4.logs.push('[00:44] Vendor allocations optimized. Primary route savings calculated: +$142,000.');
              updatedSteps[3] = step4;

              const nextStep = { ...updatedSteps[4] };
              nextStep.status = 'processing';
              nextStep.logs = [
                '[00:45] Launching Compliance Auditor Agent...',
                '[00:46] cross-referencing European Maritime Board regulations...',
                '[00:48] Sanctions check: Clean. Port fees validation: Verified.'
              ];
              updatedSteps[4] = nextStep;
            } else {
              step.logs = newLogs;
              updatedSteps[activeStepIndex] = step;
            }
          }

          // Complete the entire flow
          if (nextProgress >= 100) {
            nextProgress = 100;
            nextStatus = 'pending_approval';
            
            // Complete final step
            const lastStepIndex = updatedSteps.length - 1;
            const finalStep = { ...updatedSteps[lastStepIndex] };
            finalStep.status = 'completed';
            finalStep.logs.push('[00:52] Compliance verification verified. Generation of recommendations finished.');
            updatedSteps[lastStepIndex] = finalStep;
          }

          const updatedFlow = {
            ...flow,
            progress: nextProgress,
            status: nextStatus,
            steps: updatedSteps
          };

          // If the flow completed, inject the mock recommendation
          if (nextStatus === 'pending_approval') {
            updatedFlow.recommendation = {
              action: 'Reroute 60% of shipments via Algeciras and Valencia ports; secure 20% spot rate cargo contracts with Hapag-Lloyd.',
              savings: '$142,400 projected tariff optimization',
              riskLevel: 'Low-Medium',
              confidence: '94%',
              alternatives: [
                { name: 'Reroute 100% via Algeciras (Fastest)', cost: 'Saves $92,000', risk: 'Medium (Port congestion risk)', score: '88%' },
                { name: 'Redirect shipments through Baltic Ports', cost: 'Saves $48,000', risk: 'High (Transit delay risk)', score: '71%' },
                { name: 'Do nothing (Continue original path)', cost: 'Tariff cost -$85,000', risk: 'Extreme (Port strike disruption)', score: '42%' }
              ]
            };
          }

          return updatedFlow;
        });
      });
    };

    processingRef.current = setInterval(runSimulation, 2500);

    return () => {
      if (processingRef.current) {
        clearInterval(processingRef.current);
      }
    };
  }, []);

  // Action methods
  const login = (email, password) => {
    setUser({
      name: 'Sarah Jenkins',
      email: email || 's.jenkins@enterprise.ai',
      avatar: 'SJ',
      company: 'Apex Decision Corp'
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    setSelectedRole(null);
  };

  const selectRole = (roleId) => {
    const role = Object.values(ROLES).find(r => r.id === roleId);
    if (role) {
      setSelectedRole(role);
    }
  };

  const restartSimulation = () => {
    setFlows(prevFlows => {
      return prevFlows.map(flow => {
        if (flow.id === 'flow-101') {
          return {
            ...INITIAL_FLOWS[0],
            status: 'processing',
            progress: 0,
            steps: INITIAL_FLOWS[0].steps.map((step, idx) => ({
              ...step,
              status: idx === 0 ? 'processing' : 'pending',
              logs: idx === 0 ? ['[00:01] Re-initializing decision audit flow...'] : []
            }))
          };
        }
        return flow;
      });
    });
  };

  const approveDecision = (flowId) => {
    setFlows(prevFlows => {
      return prevFlows.map(flow => {
        if (flow.id === flowId) {
          return { ...flow, status: 'completed' };
        }
        return flow;
      });
    });
  };

  const rejectDecision = (flowId) => {
    setFlows(prevFlows => {
      return prevFlows.map(flow => {
        if (flow.id === flowId) {
          return { ...flow, status: 'failed' };
        }
        return flow;
      });
    });
  };

  const injectAnalysisResult = (result) => {
    setFlows(prevFlows => {
      return prevFlows.map(flow => {
        if (flow.id === 'flow-101') {
          return {
            ...flow,
            status: 'pending_approval',
            progress: 100,
            recommendation: {
              action: result.recommendations[0]?.title || result.explanation,
              savings: result.customer_summary?.contract_value || '$12,000 baseline',
              riskLevel: result.risk_level || 'Medium',
              confidence: `${Math.round(result.confidence_score * 100)}%`,
              alternatives: result.recommendations.map(r => ({
                name: r.title,
                cost: r.cost,
                risk: 'Low-Medium',
                score: '85%'
              }))
            }
          };
        }
        return flow;
      });
    });
    setSelectedFlowId('flow-101');
  };

  const getSelectedFlow = () => {
    return flows.find(f => f.id === selectedFlowId) || flows[0];
  };

  return (
    <PlatformContext.Provider value={{
      user,
      selectedRole,
      flows,
      selectedFlowId,
      setSelectedFlowId,
      login,
      logout,
      selectRole,
      restartSimulation,
      approveDecision,
      rejectDecision,
      injectAnalysisResult,
      activeAnalysisFile,
      setActiveAnalysisFile,
      activeAnalysis,
      setActiveAnalysis,
      selectedFlow: getSelectedFlow()
    }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
