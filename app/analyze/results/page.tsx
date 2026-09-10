'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { OperatorAnalysis } from '@/types/analysis';
import Link from 'next/link';

function ResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || 'Summit Trails Expeditions';
  const [data, setData] = useState<OperatorAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to analyze');
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#110c1d] text-white flex flex-col items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 mb-4"></div>
        <p className="text-purple-300 text-sm">Scraping hashtags & calculating safety framework scores for {query}...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#110c1d] text-white flex flex-col items-center justify-center p-6">
        <p className="text-red-400 mb-4">Error: {error || 'Could not load analysis data'}</p>
        <Link href="/" className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-medium">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#110c1d] text-white font-sans selection:bg-purple-500 selection:text-white pb-16">
      
      <header className="border-b border-purple-950 px-6 py-4 flex justify-between items-center max-w-6xl mx-auto text-sm">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg tracking-wide">Wondlo</span>
          <Link href="/" className="text-purple-400 hover:text-white transition">HOME</Link>
          <span className="text-purple-500 font-medium">COMMUNITY</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="bg-[#24193b] border border-purple-800/60 px-4 py-1.5 rounded-full text-purple-200 text-xs flex items-center gap-2 hover:bg-[#2d204a] transition">
            <span>🔍 Analyse Another Adventure</span>
          </Link>
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs shadow">U</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        
        <div className="flex justify-between items-center text-xs text-purple-400">
          <Link href="/" className="hover:text-white transition">← Back to Search</Link>
          <div className="flex gap-4">
            <span>Assessment Version: v1.3</span>
            <span>Generated: {data.reportGeneratedDate}</span>
          </div>
        </div>

        <div className="bg-[#1b142d] border border-purple-900/40 p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-lg">⛰️</div>
              <h1 className="text-xl md:text-2xl font-bold">{data.operatorName}</h1>
              {data.verified && <span className="text-blue-400 text-base" title="Verified Operator">✔</span>}
            </div>
            <div className="flex items-center gap-4 text-xs text-purple-300 pt-1">
              <span>📍 {data.location}</span>
              <span>🧗 {data.activityType}</span>
            </div>
            <div className="flex flex-wrap gap-4 pt-3 text-[11px] text-purple-400 font-mono">
              <span className="bg-[#140e24] px-3 py-1 rounded-md border border-purple-950">📅 Report Generated: {data.reportGeneratedDate}</span>
              <span className="bg-[#140e24] px-3 py-1 rounded-md border border-purple-950">📊 Data Collected Up To: {data.dataCollectedUpTo}</span>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto">
            {data.images.map((imgUrl, i) => (
              <div key={i} className="w-32 h-20 rounded-xl overflow-hidden border border-purple-800/40 bg-purple-950 flex-shrink-0 shadow-inner">
                <img src={imgUrl} alt="Adventure preview" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1b142d] border border-purple-900/40 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-purple-400 uppercase tracking-wider font-medium">Overall Safety Score</span>
              <span className="text-purple-400 text-xs cursor-help" title="Weighted score across 7 dimensions">ⓘ</span>
            </div>
            <div className="flex items-baseline gap-4 mt-2">
              <span className="text-4xl md:text-5xl font-ext500 font-bold">{data.overallSafetyScore} / 100</span>
              <span className="px-3 py-1 bg-[#281c42] text-purple-200 text-xs rounded-full border border-purple-800/80">{data.riskLevel}</span>
            </div>
            <div className="w-full bg-[#140e24] h-2 rounded-full mt-5 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${data.overallSafetyScore}%` }} />
            </div>
          </div>

          <div className="bg-[#1b142d] border border-purple-900/40 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-purple-400 uppercase tracking-wider font-medium">Confidence</span>
              <span className="text-purple-400 text-xs cursor-help" title="Model confidence rating">ⓘ</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="p-2 bg-purple-950 rounded-lg text-purple-300 border border-purple-800/50">🛡️</div>
              <span className="text-4xl md:text-5xl font-bold">{data.confidenceScore}%</span>
            </div>
            <p className="text-xs text-purple-300 mt-4 leading-relaxed">This operator satisfies our trained model's 7 required dimensions for safety.</p>
          </div>
        </div>

        <div className="bg-[#1b142d] border border-purple-900/40 p-6 rounded-2xl shadow-lg">
          <h2 className="text-sm font-semibold mb-2 flex items-center gap-1.5 text-purple-200">
            Safety Summary <span className="text-purple-400">✦</span>
          </h2>
          <p className="text-purple-200 text-xs md:text-sm leading-relaxed">{data.summary}</p>
          
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-purple-950">
            {Object.keys(data.dimensions).map((dim) => (
              <span key={dim} className="text-[11px] bg-[#140e24] border border-purple-900/60 text-purple-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                <span>⚠️</span> <span className="capitalize">{dim.replace(/([A-Z])/g, ' $1')}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#1b142d] border border-purple-900/40 p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-semibold text-purple-200">Risk Breakdown</h2>
            <button className="text-xs text-purple-400 hover:text-white transition">View full breakdown →</button>
          </div>

          <div className="space-y-4">
            {Object.entries(data.dimensions).map(([key, score]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <div className="w-48 text-purple-300 capitalize flex items-center gap-2">
                  <span className="text-[10px] text-purple-500">🛡️</span>
                  <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                </div>
                <div className="flex-1 mx-6 bg-[#140e24] h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${score < 70 ? 'bg-amber-500' : 'bg-purple-500'}`} 
                    style={{ width: `${score}%` }} 
                  />
                </div>
                <div className="w-16 text-right font-mono font-medium text-purple-200">
                  {score} <span className="text-purple-500">/ 100 ⓘ</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-purple-400 mt-5">ⓘ Hover over a category to see what it includes</p>
        </div>

        <div className="bg-[#1b142d] border border-purple-900/40 p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-semibold text-purple-200">Incident Timeline</h2>
            <button className="text-xs text-purple-400 hover:text-white transition">View full incident history →</button>
          </div>

          <div className="space-y-6 border-l-2 border-purple-900/80 ml-3 pl-6 relative">
            {data.incidents.map((incident, idx) => (
              <div key={idx} className="relative space-y-1">
                <div className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-[#1b142d] ${incident.severity === 'Moderate' ? 'bg-amber-500' : incident.severity === 'Minor' ? 'bg-purple-400' : 'bg-purple-600'}`} />
                <div className="text-[11px] text-purple-400 font-mono">{incident.date} • <span className="capitalize">{incident.severity}</span></div>
                <h3 className="font-semibold text-white text-xs md:text-sm">{incident.title}</h3>
                <p className="text-xs text-purple-300 leading-relaxed">{incident.description}</p>
                <span className="text-[10px] text-purple-400 block pt-1">Source: {incident.source}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1b142d] border border-purple-900/40 p-5 rounded-2xl shadow">
          <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">Assessment</h3>
          <p className="text-xs text-purple-200">{data.assessmentConclusion}</p>
        </div>

        <div className="bg-[#1b142d] border border-purple-900/40 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">Recommended Documents To Request</h3>
          <p className="text-[11px] text-purple-300 mb-4">Requesting these documents can help verify the operator's safety practices.</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {['Safety Plan', 'Equipment Inspection Records', 'Emergency Response Plan', 'Insurance', 'Permits & Authorizations'].map((doc, i) => (
              <div key={i} className="bg-[#140e24] border border-purple-900/50 p-3 rounded-xl flex flex-col items-center text-center gap-2 hover:border-purple-700 transition cursor-pointer">
                <span className="text-lg">📄</span>
                <span className="text-[11px] text-purple-200 font-medium leading-tight">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#24193b] border border-purple-800/60 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <button className="flex-1 min-w-[140px] bg-[#1b142d] hover:bg-[#140e24] border border-purple-700/60 text-purple-200 py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition shadow">
            <span>🛡️</span> REPORT A BUG
          </button>
          <button className="flex-1 min-w-[140px] bg-[#1b142d] hover:bg-[#140e24] border border-purple-700/60 text-purple-200 py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition shadow">
            <span>💡</span> REQUEST A FEATURE
          </button>
          <button className="flex-1 min-w-[140px] bg-[#1b142d] hover:bg-[#140e24] border border-purple-700/60 text-purple-200 py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition shadow">
            <span>❓</span> REQUEST SAFETY HELP
          </button>
          <button className="flex-1 min-w-[160px] bg-[#1b142d] hover:bg-[#140e24] border border-purple-700/60 text-purple-200 py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition shadow">
            <span>📥</span> DOWNLOAD RECOMMENDED QUESTIONS
          </button>
        </div>

        <div className="text-center text-[11px] text-purple-400 space-y-1 pt-4 pb-8">
          <p>All-inclusive safety assessments issued in good faith. Available information via social support — official travel safety advisories.</p>
          <p>Safety as a System® • Copyright © Wondlo 2026.</p>
        </div>

      </main>
    </div>
  );
}

export default function AnalysisResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#110c1d] text-white flex items-center justify-center text-sm">Loading analysis engine...</div>}>
      <ResultsContent />
    </Suspense>
  );
}