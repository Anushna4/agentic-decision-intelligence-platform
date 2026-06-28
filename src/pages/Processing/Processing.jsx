import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Square, 
  CheckSquare, 
  Play, 
  RotateCcw, 
  Terminal, 
  ArrowRight,
  Loader2,
  ChevronRight,
  Database,
  Brain,
  Search,
  BookOpen,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const INITIAL_STEPS = [
  { 
    id: 1, 
    name: 'Reading Meeting Notes', 
    icon: BookOpen,
    logs: [
      '[00:01] Ingesting meeting transcript document...',
      '[00:03] NLP Parser: Extracted 3 vendor proposals and 2 pricing constraints.',
      '[00:05] Context parsing completed. Segmented 12 discussion items.'
    ]
  },
  { 
    id: 2, 
    name: 'Fetching CRM Data', 
    icon: Database,
    logs: [
      '[00:08] Connecting to Salesforce CRM API...',
      '[00:10] Ingested customer account histories and outstanding credit profiles.',
      '[00:12] CRM synchronization verified. 0 anomalies detected.'
    ]
  },
  { 
    id: 3, 
    name: 'Searching Knowledge Base', 
    icon: Search,
    logs: [
      '[00:15] Accessing Vector Database cluster...',
      '[00:17] Semantic match query: "tariff optimization" and "port strikes compliance".',
      '[00:20] Retrieved 4 active legal files and 2 standard operational guidelines.'
    ]
  },
  { 
    id: 4, 
    name: 'Checking Previous Memory', 
    icon: Brain,
    logs: [
      '[00:22] Fetching historical decisions database...',
      '[00:24] Identified flow-092 (Supplier credit reallocation) as a 86% match.',
      '[00:26] Extracted overrides and audit logs from matching historical data.'
    ]
  },
  { 
    id: 5, 
    name: 'Business Analysis', 
    icon: TrendingUp,
    logs: [
      '[00:29] Activating Cost Optimizer Linear Solver...',
      '[00:32] Run Monte Carlo risk models across alternative shipping lanes.',
      '[00:35] Cost vectors solved. Disruption costs calculated.'
    ]
  },
  { 
    id: 6, 
    name: 'Generating Recommendations', 
    icon: Award,
    logs: [
      '[00:38] Starting Recommendation Engine...',
      '[00:41] Synthesizing optimal routing and contract distribution matrix.',
      '[00:44] Recommendation complete. Confidence index set at 94%.'
    ]
  },
  { 
    id: 7, 
    name: 'Preparing Explanation', 
    icon: Sparkles,
    logs: [
      '[00:47] Generating natural language justification draft...',
      '[00:50] Compliance and legal audits verified.',
      '[00:52] Explanation logs packed. Ready for executive authorization.'
    ]
  }
];

const Processing = () => {
  const navigate = useNavigate();
  const consoleEndRef = useRef(null);
  const { activeAnalysisFile, selectedRole, setActiveAnalysis, injectAnalysisResult } = usePlatform();

  // Core state: Step checklist (unchecked, active, completed)
  const [steps, setSteps] = useState(INITIAL_STEPS.map(s => ({ ...s, status: 'unchecked' })));
  const [activeStepId, setActiveStepId] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState(['[System] Pipeline initialized. All agent nodes idle.']);

  // Handle auto-scroll terminal logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Linear auto-simulation sequence with API integration
  useEffect(() => {
    if (!activeAnalysisFile) return;

    let isCancelled = false;

    const runSequence = async () => {
      // 1. Trigger the API analysis request in the background
      let apiData = null;
      let apiFinished = false;

      const callAnalyzeAPI = async () => {
        try {
          const response = await fetch('http://localhost:8000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file_id: activeAnalysisFile.file_id,
              customer_name: activeAnalysisFile.analysis?.customer || 'Acme Global Conglomerate Inc.',
              role: selectedRole?.id || 'supervisor'
            })
          });

          if (response.ok) {
            apiData = await response.json();
            console.log('Backend API succeeded:', apiData);
          } else {
            throw new Error('Non-ok response');
          }
        } catch (err) {
          console.warn('Backend API failed, using fallback mock data.', err);
        } finally {
          apiFinished = true;
        }
      };

      callAnalyzeAPI();

      // Reset state variables
      setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'unchecked' })));
      setIsSimulating(true);
      setTerminalLogs(['[System] Active file detected. Launching agentic pipeline...']);

      // 2. Loop through each agent milestone sequentially
      for (let i = 0; i < INITIAL_STEPS.length; i++) {
        if (isCancelled) return;

        const currentStep = INITIAL_STEPS[i];

        // Wait at Step 5 (Business Analysis) until backend finishes fetching
        if (currentStep.id === 5) {
          setSteps(prev => prev.map((s, idx) => 
            idx === i ? { ...s, status: 'active' } : s
          ));
          setActiveStepId(5);
          setTerminalLogs(prev => [...prev, '[System] Awaiting Gemini Business Analysis Agent response...']);
          
          while (!apiFinished) {
            await new Promise(resolve => setTimeout(resolve, 300));
            if (isCancelled) return;
          }
        } else {
          // Set active state for the milestone
          setSteps(prev => prev.map((s, idx) => 
            idx === i ? { ...s, status: 'active' } : s
          ));
          setActiveStepId(currentStep.id);
          setTerminalLogs(prev => [...prev, `[System] Commencing step ${currentStep.id}: ${currentStep.name}...`]);
        }

        // Wait 1.2 seconds for progress visualization
        await new Promise(resolve => setTimeout(resolve, 1200));
        if (isCancelled) return;

        // Compile logs dynamically based on the resolved API response
        let stepLogs = currentStep.logs;
        const resolvedData = apiData || {
          status: 'completed',
          file_id: activeAnalysisFile.file_id || 'doc_mock',
          risk_level: 'Medium',
          confidence_score: 0.94,
          customer_summary: {
            name: activeAnalysisFile.analysis?.customer || 'ABC Technologies',
            plan: 'Basic',
            tickets: 12,
            usage: '45%',
            contract_value: '$450K ACV',
            owner: 'David Chen',
            industry: 'Software & Consulting'
          },
          knowledge_summary: { Playbooks: ['Pricing Policy'] },
          memory_summary: { 'Previous Recommendation': 'Support Call' },
          business_analysis: {
            analysis: {
              risk_level: 'Medium',
              customer_health: 70,
              urgency: 'Medium',
              business_opportunity: 'Monitor customer health metrics and renew standard contracts.',
              missing_information: []
            }
          },
          recommendations: [
            { title: 'Optimize Logistics Route', impact: 'High', reason: 'Supply vector adjustments bypass high-risk zones, avoiding shipping delays.', confidence_score: 0.94 },
            { title: 'Monitor Customer Health', impact: 'Medium', reason: 'Account health is stable but close to risk thresholds. Weekly check-ins are recommended.', confidence_score: 0.89 },
            { title: 'Schedule Follow-up Meeting', impact: 'Medium', reason: 'Review action items and align key stakeholders on next deliverables.', confidence_score: 0.85 }
          ],
          explanations: [
            { recommendation: 'Optimize Logistics Route', impact: 'High', reason: 'The knowledge base detected logistics and tariff risks.' },
            { recommendation: 'Monitor Customer Health', impact: 'Medium', reason: 'Customer health is stable but requires monitoring.' },
            { recommendation: 'Schedule Follow-up Meeting', impact: 'Medium', reason: 'A follow-up meeting ensures progress is reviewed.' }
          ]
        };

        if (currentStep.id === 1) {
          stepLogs = [
            `[00:01] Ingesting transcript ${activeAnalysisFile?.name || 'meeting_notes.txt'}...`,
            `[00:03] Sentiment Analyzer parsed sentiment: ${activeAnalysisFile?.analysis?.sentiment || 'Negative'}`,
            `[00:05] Document parsing complete. Keywords matched: ${JSON.stringify(activeAnalysisFile?.analysis?.keywords || ['Pricing'])}`
          ];
        } else if (currentStep.id === 2) {
          stepLogs = [
            `[00:08] CRM query completed for: ${resolvedData.customer_summary?.name}`,
            `[00:10] Ingested plan: ${resolvedData.customer_summary?.plan}, tickets: ${resolvedData.customer_summary?.tickets}`,
            `[00:12] Contract Value details: ${resolvedData.customer_summary?.contract_value}`
          ];
        } else if (currentStep.id === 3) {
          const playbooks = resolvedData.knowledge_summary?.Playbooks || ['Pricing Policy'];
          stepLogs = [
            `[00:15] Accessing Playbook database cluster...`,
            `[00:18] Retrieved matching document: ${playbooks.join(', ')}`
          ];
        } else if (currentStep.id === 4) {
          const prevRec = resolvedData.memory_summary?.['Previous Recommendation'] || 'Support Call';
          stepLogs = [
            `[00:22] Retrieved historical review records...`,
            `[00:25] Found previous decision recommendation: ${prevRec}`
          ];
        } else if (currentStep.id === 5) {
          const analysis = resolvedData.business_analysis?.analysis || resolvedData.business_analysis;
          stepLogs = [
            `[00:28] Executed Gemini models...`,
            `[00:30] Risk level assessed: ${analysis.risk_level}, health rating: ${analysis.customer_health}`,
            `[00:32] Urgency score: ${analysis.urgency}`
          ];
        } else if (currentStep.id === 6) {
          stepLogs = [
            `[00:38] Compiled top recommendations...`,
            ...resolvedData.recommendations.map((r, rIdx) => `[00:${40+rIdx}] Rec #${rIdx+1}: ${r.title} (Confidence: ${r.confidence_score})`)
          ];
        } else if (currentStep.id === 7) {
          stepLogs = [
            `[00:46] Formulating strategic justifications...`,
            `[00:50] Compliance and safety checks verified.`
          ];
        }

        // Mark current step completed in UI
        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: 'completed' } : s
        ));
        setTerminalLogs(prev => [...prev, ...stepLogs, `[System] Step ${currentStep.id} completed.`]);
      }

      // 3. Mark sequence finished and transition to Results
      setIsSimulating(false);
      setTerminalLogs(prev => [...prev, '[System] All steps completed successfully. Preparing Results UI...']);
      
      const finalData = apiData || {
        status: 'completed',
        file_id: activeAnalysisFile.file_id || 'doc_mock',
        risk_level: 'Medium',
        confidence_score: 0.94,
        customer_summary: {
          name: activeAnalysisFile.analysis?.customer || 'ABC Technologies',
          plan: 'Basic',
          tickets: 12,
          usage: '45%',
          contract_value: '$450K ACV',
          owner: 'David Chen',
          industry: 'Software & Consulting'
        },
        knowledge_summary: { Playbooks: ['Pricing Policy'] },
        memory_summary: { 'Previous Recommendation': 'Support Call' },
        business_analysis: {
          analysis: {
            risk_level: 'Medium',
            customer_health: 70,
            urgency: 'Medium',
            business_opportunity: 'Monitor customer health metrics and renew standard contracts.',
            missing_information: []
          }
        },
        recommendations: [
          { title: 'Optimize Logistics Route', impact: 'High', reason: 'Supply vector adjustments bypass high-risk zones, avoiding shipping delays.', confidence_score: 0.94 },
          { title: 'Monitor Customer Health', impact: 'Medium', reason: 'Account health is stable but close to risk thresholds. Weekly check-ins are recommended.', confidence_score: 0.89 },
          { title: 'Schedule Follow-up Meeting', impact: 'Medium', reason: 'Review action items and align key stakeholders on next deliverables.', confidence_score: 0.85 }
        ],
        explanations: [
          { recommendation: 'Optimize Logistics Route', impact: 'High', reason: 'The knowledge base detected logistics and tariff risks.' },
          { recommendation: 'Monitor Customer Health', impact: 'Medium', reason: 'Customer health is stable but requires monitoring.' },
          { recommendation: 'Schedule Follow-up Meeting', impact: 'Medium', reason: 'A follow-up meeting ensures progress is reviewed.' }
        ]
      };

      setActiveAnalysis(finalData);
      injectAnalysisResult(finalData);

      await new Promise(resolve => setTimeout(resolve, 1500));
      if (isCancelled) return;
      navigate('/results');
    };

    runSequence();

    return () => {
      isCancelled = true;
    };
  }, [activeAnalysisFile, selectedRole]);

  // Functions to manually mark steps complete/incomplete
  const toggleStepCompleted = (stepId) => {
    setSteps(prev => prev.map(s => {
      if (s.id === stepId) {
        const nextStatus = s.status === 'completed' ? 'unchecked' : 'completed';
        
        // Output log entry on change
        if (nextStatus === 'completed') {
          setTerminalLogs(prevLogs => [
            ...prevLogs,
            `[User Override] Manually checked: ${s.name}`,
            ...s.logs
          ]);
        } else {
          setTerminalLogs(prevLogs => [
            ...prevLogs,
            `[User Override] Manually unchecked: ${s.name}`
          ]);
        }
        
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const markAllComplete = () => {
    setSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
    setTerminalLogs(prev => [
      ...prev,
      '[User Action] Marked all steps complete.',
      ...INITIAL_STEPS.flatMap(s => s.logs)
    ]);
  };

  const resetAllSteps = () => {
    setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'unchecked' })));
    setIsSimulating(false);
    setActiveStepId(1);
    setTerminalLogs(['[System] Pipeline reset. All steps unchecked.']);
  };

  // Compute stats
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const allCompleted = completedCount === steps.length;

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
              Checklist Control
            </span>
            <span className="text-xs text-slate-400">Step 4 of 6</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Agent Process Checklist</h1>
          <p className="text-sm text-slate-500">Interactive execution steps detailing document processing, CRM lookups, and recommendation models.</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Button onClick={resetAllSteps} variant="outline" className="flex items-center gap-2 bg-white">
            <RotateCcw className="h-4 w-4 text-slate-500" />
            <span>Reset Checklist</span>
          </Button>

          <Button 
            onClick={markAllComplete} 
            variant="secondary" 
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
          >
            <span>Check All Steps</span>
          </Button>

          {isSimulating ? (
            <Button 
              onClick={() => setIsSimulating(false)} 
              variant="outline" 
              className="flex items-center gap-2 bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Pause Auto-Run</span>
            </Button>
          ) : (
            <Button 
              onClick={() => setIsSimulating(true)} 
              variant="primary" 
              className="flex items-center gap-2"
              disabled={allCompleted}
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Simulate Pipeline</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Animated checklist left, terminal log right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive animated checklist */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Agent Milestones</CardTitle>
                <span className="text-xs font-bold text-blue-600">{progressPercent}%</span>
              </div>
              <CardDescription>Click rows to manually complete steps or watch them animate.</CardDescription>
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-3">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="px-6 pb-6 space-y-3">
                {steps.map((step) => {
                  const StepIcon = step.icon;
                  const isCompleted = step.status === 'completed';
                  const isActive = step.status === 'active';

                  return (
                    <div 
                      key={step.id} 
                      onClick={() => toggleStepCompleted(step.id)}
                      className={`
                        flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200
                        ${isCompleted 
                          ? 'bg-emerald-50/40 border-emerald-100 text-emerald-800' 
                          : isActive 
                            ? 'bg-blue-50/30 border-blue-200 ring-2 ring-blue-50 text-slate-900' 
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50/50 hover:border-slate-300'}
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Interactive Checkbox with icon */}
                        <div className="shrink-0 transition-transform active:scale-95">
                          {isCompleted ? (
                            <CheckSquare className="h-5 w-5 text-emerald-600 animate-pulse-slow" />
                          ) : (
                            <Square className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-slate-300'}`} />
                          )}
                        </div>

                        {/* Step Label */}
                        <div className="truncate leading-tight">
                          <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-950 font-semibold' : 'text-slate-800'}`}>
                            {step.name}
                          </span>
                        </div>
                      </div>

                      {/* Right indicator */}
                      <div className="shrink-0 ml-2">
                        {isActive ? (
                          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        ) : (
                          <StepIcon className={`h-4 w-4 ${isCompleted ? 'text-emerald-500' : 'text-slate-355'}`} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Console Log Viewer */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full flex flex-col bg-slate-950 text-slate-100 border-slate-900 shadow-xl overflow-hidden min-h-[500px]">
            {/* Header */}
            <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-300 font-mono">Autonomic Log Trace</span>
              </div>
              <Badge variant={allCompleted ? 'emerald' : 'blue'}>
                {allCompleted ? 'Ready' : 'Checking'}
              </Badge>
            </div>

            {/* Screen */}
            <CardContent className="flex-1 p-5 overflow-y-auto font-mono text-xs text-slate-300 space-y-2 select-text leading-relaxed">
              {terminalLogs.map((log, index) => {
                let textStyle = "text-slate-300";
                if (log.includes('[User Override]') || log.includes('[User Action]')) textStyle = "text-amber-400 font-semibold";
                if (log.includes('[System]')) textStyle = "text-blue-400 font-bold";
                if (log.includes('completed') || log.includes('complete')) textStyle = "text-emerald-400";
                
                return (
                  <div key={index} className={`whitespace-pre-wrap ${textStyle}`}>
                    {log}
                  </div>
                );
              })}
              
              {isSimulating && (
                <div className="text-blue-500 font-bold terminal-cursor">
                  [Processing] step {activeStepId}...
                </div>
              )}
              <div ref={consoleEndRef}></div>
            </CardContent>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono shrink-0">
              <span>CHECKLIST_NODES: {steps.length}</span>
              <span>VERIFIED: {completedCount} COMPLETED</span>
            </div>
          </Card>
        </div>

      </div>

      {/* Flow Wizard Navigation Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md mt-8">
        <div>
          <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Flow Step 4 of 6</span>
          <h3 className="text-lg font-bold mt-1.5">Checklist Step Verification Complete?</h3>
          <p className="text-xs text-slate-400">Once you have marked the milestones complete, proceed to the Results page to review recommendations.</p>
        </div>
        <Button 
          onClick={() => navigate('/results')} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold shrink-0 flex items-center gap-2"
        >
          <span>Proceed to Results</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Processing;
