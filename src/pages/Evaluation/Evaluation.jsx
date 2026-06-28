import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Search, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  FileDown,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Database
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const Evaluation = () => {
  const { logout } = usePlatform();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [impactFilter, setImpactFilter] = useState('all');
  const [dbReviews, setDbReviews] = useState([]);

  // Fetch human review logs on mount
  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:8000/reviews');
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setDbReviews(data.reviews || []);
      } catch (err) {
        console.warn('Backend offline or reviews fetch failed. Showing local mock reviews.', err);
      }
    };
    fetchReviews();
  }, []);

  // Static mock fallback database records
  const mockDecisions = [
    { 
      id: 'flow-101', 
      decision: 'Q3 Global Supply Chain Rerouting via Algeciras', 
      date: '2026-06-27', 
      recTime: '0.52s', 
      confidence: '94%', 
      impact: 'High ($142.4K tariff savings)', 
      status: 'approved' 
    },
    { 
      id: 'flow-102', 
      decision: 'AWS m5.xlarge Instances Downsize Consolidation', 
      date: '2026-06-25', 
      recTime: '0.34s', 
      confidence: '89%', 
      impact: 'Medium ($4.2K/mo infrastructure reduction)', 
      status: 'approved' 
    },
    { 
      id: 'flow-103', 
      decision: 'Supplier credit limit reduction on Credit Drop', 
      date: '2026-06-22', 
      recTime: '0.45s', 
      confidence: '97%', 
      impact: 'High ($140K risk exposure avoidance)', 
      status: 'approved' 
    },
    { 
      id: 'flow-104', 
      decision: 'Competitor Price matching indices synchronization', 
      date: '2026-06-18', 
      recTime: '0.28s', 
      confidence: '32%', 
      impact: 'Low (Crashed SKU alignment)', 
      status: 'failed' 
    },
    { 
      id: 'flow-099', 
      decision: 'Q2 Raw Sourcing logistics re-allocation', 
      date: '2026-06-15', 
      recTime: '0.61s', 
      confidence: '95%', 
      impact: 'High ($48.0K tariff savings)', 
      status: 'approved' 
    },
    { 
      id: 'flow-098', 
      decision: 'AWS Enterprise cloud savings contract lock-in', 
      date: '2026-06-10', 
      recTime: '0.41s', 
      confidence: '92%', 
      impact: 'Medium ($9.2K budget optimization)', 
      status: 'approved' 
    }
  ];

  // Map database reviews to table format
  const mappedDbReviews = dbReviews.map((rev, idx) => {
    const formattedDate = rev.reviewed_at ? rev.reviewed_at.substring(0, 10) : '2026-06-28';
    return {
      id: `rev-${idx + 200}`,
      decision: `${rev.customer}: ${rev.recommendation}`,
      date: formattedDate,
      recTime: '0.52s',
      confidence: '94%',
      impact: rev.decision === 'accepted' ? 'High (Savings Realized)' : 'Low (Strategy Rejected)',
      status: rev.decision === 'accepted' ? 'approved' : 'failed'
    };
  });

  // Combine database reviews at the top of the history list
  const historicalDecisions = [...mappedDbReviews, ...mockDecisions];

  // Filtering
  const filteredDecisions = historicalDecisions.filter(item => {
    const matchesSearch = item.decision.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesImpact = impactFilter === 'all' || 
                          (impactFilter === 'high' && item.impact.toLowerCase().includes('high')) ||
                          (impactFilter === 'medium' && item.impact.toLowerCase().includes('medium')) ||
                          (impactFilter === 'low' && item.impact.toLowerCase().includes('low'));
    return matchesSearch && matchesImpact;
  });

  // Calculate dynamic KPIs based on combined database and mock history
  const totalDecisions = historicalDecisions.length;
  
  const avgRecTime = totalDecisions > 0 
    ? (historicalDecisions.reduce((acc, item) => {
        const val = parseFloat(item.recTime.replace('s', ''));
        return acc + (isNaN(val) ? 0 : val);
      }, 0) / totalDecisions).toFixed(2) + 's'
    : '0.43s';

  const avgConfidence = totalDecisions > 0
    ? (historicalDecisions.reduce((acc, item) => {
        const val = parseFloat(item.confidence.replace('%', ''));
        return acc + (isNaN(val) ? 0 : val);
      }, 0) / totalDecisions).toFixed(1) + '%'
    : '91.8%';

  const approvedCount = historicalDecisions.filter(item => item.status === 'approved').length;
  const adoptionRate = totalDecisions > 0 
    ? ((approvedCount / totalDecisions) * 100).toFixed(1) + '%'
    : '92.0%';

  const overriddenRate = totalDecisions > 0
    ? (((totalDecisions - approvedCount) / totalDecisions) * 100).toFixed(1) + '%'
    : '8.0%';

  const totalImpactK = historicalDecisions.reduce((acc, item) => {
    if (item.status !== 'approved') return acc;
    // Extract number in K from impact string
    const match = item.impact.match(/\$(\d+\.?\d*)K/);
    if (match) {
      return acc + parseFloat(match[1]);
    }
    if (item.impact.includes('Savings Realized')) {
      return acc + 450; // ABC Technologies contract value baseline
    }
    return acc;
  }, 0);
  const formattedImpact = `$${totalImpactK.toFixed(1)}K`;

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Evaluation Summary</h1>
          <p className="text-sm text-slate-500">Post-execution audit report measuring recommendation latency, model confidence, and ROI impact.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2 bg-white border-slate-200">
          <FileDown className="h-4 w-4 text-slate-500" />
          <span>Export Audit Summary</span>
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Recommendation Time */}
        <Card>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Recommendation Time</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{avgRecTime}</h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-slate-550 mt-4 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">↑ 92% faster</span>
            <span>than manual reviews</span>
          </div>
        </Card>

        {/* KPI 2: Confidence */}
        <Card>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Solver Confidence</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{avgConfidence}</h3>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-slate-550 mt-4 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">96.4% accuracy</span>
            <span>realization profile</span>
          </div>
        </Card>

        {/* KPI 3: Decision Realization */}
        <Card>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Decision Adoption Rate</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{adoptionRate}</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-slate-550 mt-4 flex items-center gap-1">
            <span className="text-slate-650 font-semibold">{overriddenRate} overridden</span>
            <span>by administration</span>
          </div>
        </Card>

        {/* KPI 4: Expected Business Impact */}
        <Card>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Projected Business Impact</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{formattedImpact}</h3>
            </div>
            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-slate-550 mt-4 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">100% compliant</span>
            <span>safety audit logs</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Historical Decisions Summary Table */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-5 border-b border-slate-100">
          <div>
            <CardTitle>Historical Decisions Registry</CardTitle>
            <CardDescription>Audited trace records comparing recommendation speed, solver confidence, and expected impact metrics.</CardDescription>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search decision details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-9 pr-3 py-1.75 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400 w-full md:w-48"
              />
            </div>
            
            <select
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value)}
              className="text-xs font-semibold px-2 py-1.75 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Impacts</option>
              <option value="high">High Impact</option>
              <option value="medium">Medium Impact</option>
              <option value="low">Low Impact</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-3.5">Audit ID</th>
                  <th className="px-4 py-3.5">Decision Path Details</th>
                  <th className="px-4 py-3.5">Rec. Time</th>
                  <th className="px-4 py-3.5">Confidence</th>
                  <th className="px-4 py-3.5">Expected Business Impact</th>
                  <th className="px-6 py-3.5 text-right">Review Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredDecisions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400 text-xs italic">
                      No matching historical records found.
                    </td>
                  </tr>
                ) : (
                  filteredDecisions.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                      {/* ID */}
                      <td className="px-6 py-4.5 font-mono text-xs font-bold text-slate-400">
                        {item.id}
                      </td>

                      {/* Decision Details */}
                      <td className="px-4 py-4.5 font-bold text-slate-900">
                        {item.decision}
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          <span>Audited on {item.date}</span>
                        </div>
                      </td>

                      {/* Recommendation Time */}
                      <td className="px-4 py-4.5 text-xs text-slate-650 font-bold font-mono">
                        {item.recTime}
                      </td>

                      {/* Confidence */}
                      <td className="px-4 py-4.5 text-xs font-bold text-blue-600 font-mono">
                        {item.confidence}
                      </td>

                      {/* Expected Impact */}
                      <td className="px-4 py-4.5 text-xs font-semibold text-slate-700">
                        {item.impact}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4.5 text-right">
                        <Badge 
                          variant={item.status === 'approved' ? 'emerald' : 'red'}
                        >
                          {item.status === 'approved' ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-red-650" />
                          )}
                          <span className="capitalize">{item.status}</span>
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Flow Wizard Navigation Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md mt-8">
        <div>
          <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Flow Step 6 of 6</span>
          <h3 className="text-lg font-bold mt-1.5">End of Demo Flow</h3>
          <p className="text-xs text-slate-400">You have completed the entire decision lifecycle. You can restart the loop or switch personas.</p>
        </div>
        <Button 
          onClick={() => {
            logout();
            navigate('/login');
          }} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold shrink-0 flex items-center gap-2"
        >
          <span>Restart Demo (Logout)</span>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Evaluation;
