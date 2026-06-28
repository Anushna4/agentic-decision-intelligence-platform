import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Cpu, 
  BrainCircuit, 
  ArrowRight,
  RefreshCw,
  Sparkles,
  Loader2,
  Trash2
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const { flows, setSelectedFlowId, selectedRole, injectAnalysisResult, setActiveAnalysisFile, setActiveAnalysis } = usePlatform();
  const navigate = useNavigate();

  // State for drag & drop file upload
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analyzingFile, setAnalyzingFile] = useState(null);

  // State for meeting notes analysis queue
  const [analyses, setAnalyses] = useState([
    { id: 'an-001', filename: 'supplier_renegotiation_minutes_q2.pdf', date: '2026-06-25 14:10', size: '1.2 MB', status: 'completed', actionItems: 5, confidence: '94%' },
    { id: 'an-002', filename: 'saas_infrastructure_sync_notes.docx', date: '2026-06-22 09:30', size: '420 KB', status: 'completed', actionItems: 3, confidence: '89%' },
    { id: 'an-003', filename: 'q3_global_logistic_alignment.txt', date: '2026-06-27 18:30', size: '15 KB', status: 'analyzing', actionItems: 0, confidence: 'Pending' },
    { id: 'an-004', filename: 'competitor_pricing_session.pdf', date: '2026-06-14 11:15', size: '2.4 MB', status: 'failed', actionItems: 0, confidence: 'N/A' }
  ]);

  // Drag & drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    }
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  };

  const addFiles = async (files) => {
    const formattedFiles = files.map(file => ({
      name: file.name,
      size: formatBytes(file.size),
      status: 'uploading',
      rawFile: file
    }));
    setUploadedFiles(prev => [...prev, ...formattedFiles]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const result = await response.json();
        console.log('Upload success:', result);

        setUploadedFiles(prev => prev.map(f => {
          if (f.name === file.name) {
            return {
              ...f,
              status: 'ready',
              file_id: result.file_id,
              analysis: result.analysis
            };
          }
          return f;
        }));
      } catch (error) {
        console.warn('Backend offline or upload failed. Falling back to local ready state.', error);
        // Fallback mock upload data
        setUploadedFiles(prev => prev.map(f => {
          if (f.name === file.name) {
            return {
              ...f,
              status: 'ready',
              file_id: `doc_mock_${Math.random().toString(36).substring(7)}`,
              analysis: {
                customer: 'ABC Technologies',
                sentiment: 'Negative',
                keywords: ['Pricing'],
                summary: 'Customer complaining about high pricing structures.'
              }
            };
          }
          return f;
        }));
      }
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Trigger analysis sets variables and navigates directly to processing checklist
  const triggerAnalysis = (file, index) => {
    setActiveAnalysisFile(file);
    setActiveAnalysis(null);
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    navigate('/processing');
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  // Status mapping
  const statusDetails = {
    analyzing: { label: 'Analyzing', variant: 'blue', pulse: true, icon: Loader2 },
    completed: { label: 'Analysis Complete', variant: 'emerald', pulse: false, icon: CheckCircle2 },
    failed: { label: 'Parsing Failed', variant: 'red', pulse: false, icon: AlertCircle }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Meeting Intelligence Center</h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload conversation logs and meeting notes. Autonomic agents parse tasks, ROI models, and check compliance.
          </p>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Documents Analyzed</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">14 <span className="text-xs text-slate-400 font-normal">files</span></h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">100% compliance</span>
            <span>audit logging</span>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Action Items Found</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">28 <span className="text-xs text-slate-400 font-normal">items</span></h3>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Cpu className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4 flex items-center gap-1.5">
            <span className="font-semibold text-blue-600">Avg 4.2 items</span>
            <span>per document</span>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agent Parser Accuracy</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">91.8%</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">↑ +0.4%</span>
            <span>realignment drift</span>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operational Cost</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">$2.14</h3>
            </div>
            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4 flex items-center gap-1">
            <span>LLM tokens billing:</span>
            <span className="font-semibold text-slate-700">$0.15 / doc</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Upload Center & Recent Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1/3: Document Upload Center */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader className="pb-4">
                <CardTitle>Notes Ingestion</CardTitle>
                <CardDescription>Drag and drop text transcripts or audio transcript files to begin parsing.</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-5">
                {/* Drag and Drop Zone */}
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer
                    ${dragActive 
                      ? 'border-blue-600 bg-blue-50/30' 
                      : 'border-slate-200 hover:border-slate-350 hover:bg-slate-50/30'}
                  `}
                >
                  <input 
                    type="file" 
                    id="file-upload-input"
                    multiple 
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".txt,.doc,.docx,.pdf"
                  />
                  
                  <label htmlFor="file-upload-input" className="cursor-pointer block space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-blue-600 hover:text-blue-700 block">Click to select files</span>
                      <span className="text-[11px] text-slate-400 block mt-1">or drag & drop them here</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block bg-slate-50 py-1 rounded">
                      TXT, DOCX, PDF (MAX. 10MB)
                    </span>
                  </label>
                </div>

                {/* Queue of Staged Files to Analyze */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Staged Documents ({uploadedFiles.length})</h4>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                            <div className="truncate font-semibold text-slate-700" title={file.name}>
                              {file.name}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold shrink-0">({file.size})</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            {analyzingFile === file.name ? (
                              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                            ) : (
                              <>
                                <button 
                                  onClick={() => triggerAnalysis(file, idx)}
                                  className="text-[10px] font-bold px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                  disabled={analyzingFile !== null}
                                >
                                  Analyze
                                </button>
                                <button 
                                  onClick={() => removeFile(idx)}
                                  className="text-slate-400 hover:text-red-500 p-0.5"
                                  disabled={analyzingFile !== null}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/40 mt-4 rounded-b-xl">
              <div className="flex gap-2 text-[10px] text-slate-400 font-semibold items-start leading-relaxed">
                <BrainCircuit className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Documents processed locally within sandbox rules. Action matrices generated directly connect to decision logic nodes.</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 2/3: Recent Analyses Table queue */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader className="flex flex-row justify-between items-center pb-5 border-b border-slate-100">
                <div>
                  <CardTitle>Recent Notes Analyses</CardTitle>
                  <CardDescription>Queue of meeting notes audited and parsed by autonomic agent nodes.</CardDescription>
                </div>
                <Badge variant="slate">{analyses.length} Total Logs</Badge>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                        <th className="px-6 py-3.5">Document Details</th>
                        <th className="px-4 py-3.5">Uploaded</th>
                        <th className="px-4 py-3.5">Action Items</th>
                        <th className="px-4 py-3.5">Confidence</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {analyses.map((item) => {
                        const state = statusDetails[item.status] || statusDetails.failed;
                        const StateIcon = state.icon;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                            {/* Filename & size */}
                            <td className="px-6 py-4.5">
                              <div className="font-bold text-slate-900 truncate max-w-[200px]" title={item.filename}>
                                {item.filename}
                              </div>
                              <span className="text-[10px] text-slate-400 font-semibold">{item.size}</span>
                            </td>

                            {/* Timestamp */}
                            <td className="px-4 py-4.5 text-xs font-semibold text-slate-500 whitespace-nowrap">
                              {item.date}
                            </td>

                            {/* Actions found */}
                            <td className="px-4 py-4.5 text-xs font-bold text-slate-700">
                              {item.actionItems > 0 ? (
                                <Badge variant="indigo">{item.actionItems} items</Badge>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>

                            {/* Confidence Score */}
                            <td className="px-4 py-4.5 text-xs font-bold text-blue-600 font-mono">
                              {item.confidence}
                            </td>

                            {/* Status label */}
                            <td className="px-4 py-4.5">
                              <Badge variant={state.variant} pulse={state.pulse}>
                                <StateIcon className={`h-3 w-3 shrink-0 ${state.pulse ? 'animate-spin' : ''}`} />
                                <span>{state.label}</span>
                              </Badge>
                            </td>

                            {/* View link */}
                            <td className="px-6 py-4.5 text-right">
                              <button 
                                onClick={() => navigate('/processing')}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 hover:underline disabled:opacity-50"
                                disabled={item.status === 'analyzing' || item.status === 'failed'}
                              >
                                <span>Report</span>
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end bg-slate-50/20">
              <button 
                onClick={() => navigate('/processing')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1.5"
              >
                <span>View Full Agent Processing Pipeline</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </Card>
        </div>

      </div>

      {/* Flow Wizard Navigation Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md mt-8">
        <div>
          <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Flow Step 3 of 6</span>
          <h3 className="text-lg font-bold mt-1.5">Dashboard View Complete?</h3>
          <p className="text-xs text-slate-400">Proceed to the Processing pipeline to monitor active agent logic in real time.</p>
        </div>
        <Button 
          onClick={() => navigate('/processing')} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold shrink-0 flex items-center gap-2"
        >
          <span>Run Agent Pipeline</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
