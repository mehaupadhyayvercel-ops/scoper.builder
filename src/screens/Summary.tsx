import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { useState, useEffect, type ReactNode, type CSSProperties } from 'react';
import { Download, ArrowRight, Loader2, Users, Clock, Zap, IndianRupee, TrendingUp } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useSound } from '../hooks/useSound';

interface SummaryData {
  recommendedSolution: string;
  features: string[];
  complexity: string;
  timeline: string;
  investmentRange: string;
  team: string[];
  costBreakdown: { category: string; amount: number }[];
  timelinePhases: { phase: string; weeks: number }[];
}

const COLORS = ['#8b4513', '#a0522d', '#cd853f', '#deb887', '#f4a460', '#d2b48c', '#c4a882'];

/* ─── reusable primitives ─── */
function Card({ children, className = '', style = {} }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 ${className}`}
      style={{
        boxShadow: '10px 10px 22px rgba(209,205,199,0.45), -10px -10px 22px rgba(255,255,255,0.95), inset 2px 2px 5px rgba(255,255,255,0.8), inset -2px -2px 5px rgba(209,205,199,0.2)',
        border: '1.5px solid rgba(255,255,255,0.8)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-outline mb-2 clay-text">
      {children}
    </p>
  );
}


/* ── Static fallback (shown instantly, upgraded by AI if available) ── */
const FALLBACK_SUMMARY: SummaryData = {
  recommendedSolution:
    'A scalable, cloud-native web and mobile platform built with a modern tech stack, tailored to your business requirements and optimised for performance, security, and growth.',
  features: [
    'User Authentication & Role Management',
    'Admin Dashboard & Analytics',
    'Real-time Notifications',
    'Payment Gateway Integration',
    'Reports & Data Export (CSV/PDF)',
    'REST API & Third-party Integrations',
    'Mobile-responsive Progressive Web App',
    'Audit Logs & Compliance Tracking',
    'Multi-language / Localisation Support',
    'Cloud Storage & Media Management',
  ],
  complexity: 'Medium',
  timeline: '14–18 weeks',
  investmentRange: '₹20–35L',
  team: [
    'Project Manager / Scrum Master',
    'Senior UI/UX Designer',
    'Senior Full-Stack Developer',
    'Backend Developer',
    'QA Engineer',
    'DevOps Engineer',
  ],
  costBreakdown: [
    { category: 'UI/UX Design', amount: 15 },
    { category: 'Frontend Dev', amount: 30 },
    { category: 'Backend & API', amount: 30 },
    { category: 'QA & Testing', amount: 12 },
    { category: 'DevOps & Cloud', amount: 8 },
    { category: 'Management', amount: 5 },
  ],
  timelinePhases: [
    { phase: 'Discovery & Planning', weeks: 2 },
    { phase: 'UI/UX Design', weeks: 3 },
    { phase: 'Frontend Development', weeks: 5 },
    { phase: 'Backend & API Development', weeks: 5 },
    { phase: 'QA & Testing', weeks: 2 },
    { phase: 'Deployment & Handover', weeks: 1 },
  ],
};

/* ─── main component ─── */
export function SummaryScreen() {
  const { data } = useAppContext();
  const { click, success } = useSound();
  // Start with fallback so the screen renders immediately — no blocking spinner
  const [summary, setSummary] = useState<SummaryData>(FALLBACK_SUMMARY);
  const [aiLoading, setAiLoading] = useState(true); // subtle indicator only

  useEffect(() => {
    async function fetchSummary() {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      try {
        const response = await fetch('/api/generate-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('API Error');
        const result = await response.json();
        setSummary(result); // silently upgrade data
        success(); // 🎵 play chime when AI data arrives
      } catch {
        // Silently keep fallback — no error state shown
      } finally {
        clearTimeout(timeoutId);
        setAiLoading(false);
      }
    }
    fetchSummary();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const complexityColor =
    summary.complexity?.toLowerCase() === 'high' ? '#b85c38' :
    summary.complexity?.toLowerCase() === 'medium' ? '#cd853f' : '#5a7a5a';

  const platformCount = (data.preferences as any)?.platforms?.length || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-4 max-w-full">
        <div>
          <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-on-surface clay-title leading-tight">
            Your Project Summary
          </h2>
          <p className="text-secondary text-xs mt-0.5 clay-text flex items-center gap-2">
            Based on your inputs — here is a preliminary roadmap for your project.
            {aiLoading && (
              <span className="inline-flex items-center gap-1 text-[10px] text-primary font-semibold">
                <Loader2 size={10} className="animate-spin" /> Refining with AI…
              </span>
            )}
          </p>
        </div>
        <button onClick={click} className="clay-btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 shrink-0">
          <Download size={12} /> Download
        </button>
      </div>

      {/* ════════════════════════════════
          BENTO DASHBOARD GRID
          ════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-3 auto-rows-auto">

        {/* ── ROW 1 ── */}

        {/* [1] Recommended Solution — 6 cols */}
        <Card className="col-span-12 lg:col-span-6 flex flex-col gap-3">
          <CardLabel>Recommended Solution</CardLabel>
          <p className="font-serif text-base lg:text-lg font-medium text-on-surface leading-snug clay-title flex-1">
            {summary.recommendedSolution}
          </p>
          <div className="flex gap-2 flex-wrap mt-auto pt-3 border-t border-outline-variant/20">
            {[`${platformCount} Platform${platformCount > 1 ? 's' : ''}`, `${summary.features.length} Features`, summary.complexity + ' Complexity'].map(tag => (
              <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full clay-text"
                style={{ background: '#8b4b2d15', color: '#8b4b2d', border: '1px solid #8b4b2d20' }}>
                {tag}
              </span>
            ))}
          </div>
        </Card>

        {/* [2] Complexity — 2 cols */}
        <Card className="col-span-12 sm:col-span-4 lg:col-span-2 flex flex-col items-center justify-center text-center gap-1">
          <CardLabel>Complexity</CardLabel>
          <Zap size={20} className="opacity-30 mb-1" style={{ color: complexityColor }} />
          <div className="font-serif font-bold clay-title leading-none" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: complexityColor }}>
            {summary.complexity}
          </div>
          <p className="text-[10px] text-secondary clay-text mt-1 leading-snug">
            {platformCount} platform{platformCount > 1 ? 's' : ''} &amp; {summary.features.length} capabilities
          </p>
        </Card>

        {/* [3] Timeline — 2 cols */}
        <Card className="col-span-12 sm:col-span-4 lg:col-span-2 flex flex-col items-center justify-center text-center gap-1">
          <CardLabel>Est. Timeline</CardLabel>
          <Clock size={20} className="text-primary opacity-25 mb-1" />
          <div className="font-serif font-bold text-on-surface clay-title leading-none" style={{ fontSize: 'clamp(1.4rem,2.5vw,1.9rem)' }}>
            {summary.timeline}
          </div>
        </Card>

        {/* [4] Investment — 2 cols */}
        <Card className="col-span-12 sm:col-span-4 lg:col-span-2 flex flex-col items-center justify-center text-center gap-1">
          <CardLabel>Investment</CardLabel>
          <IndianRupee size={20} className="text-primary opacity-25 mb-1" />
          <div className="font-serif font-bold text-on-surface clay-title leading-none" style={{ fontSize: 'clamp(1.3rem,2.2vw,1.75rem)' }}>
            {summary.investmentRange}
          </div>
        </Card>

        {/* ── ROW 2 ── */}

        {/* [5] Suggested Features — 6 cols */}
        <Card className="col-span-12 lg:col-span-6 flex flex-col">
          <CardLabel>Suggested Features</CardLabel>
          <div className="grid grid-cols-2 gap-x-5 gap-y-2 flex-1">
            {summary.features.slice(0, 10).map((f, i) => (
              <div key={i} className="flex items-start gap-2 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-[5px] opacity-70" />
                <span className="text-[11px] text-secondary clay-text leading-snug line-clamp-2 flex-1">{f}</span>
              </div>
            ))}
            {summary.features.length > 10 && (
              <p className="text-[10px] text-primary font-semibold col-span-2 mt-1">
                +{summary.features.length - 10} more features
              </p>
            )}
          </div>
        </Card>

        {/* [6] Recommended Team — 3 cols */}
        <Card className="col-span-12 lg:col-span-3 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <CardLabel>Recommended Team</CardLabel>
            <Users size={14} className="text-primary opacity-40 shrink-0" />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {summary.team.slice(0, 5).map((member, i) => (
              <div key={i} className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: COLORS[i % COLORS.length] }}>
                  {member.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <span className="text-[11px] font-medium text-secondary clay-text leading-snug line-clamp-1 flex-1">{member}</span>
              </div>
            ))}
            {summary.team.length > 5 && (
              <p className="text-[10px] text-primary font-bold mt-auto">+{summary.team.length - 5} more roles</p>
            )}
          </div>
        </Card>

        {/* [7] Resource Allocation — 3 cols */}
        <Card className="col-span-12 lg:col-span-3 flex flex-col">
          <CardLabel>Resource Allocation</CardLabel>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary.costBreakdown}
                  cx="50%" cy="50%"
                  innerRadius={48} outerRadius={68}
                  paddingAngle={3}
                  dataKey="amount"
                  nameKey="category"
                  stroke="none"
                >
                  {summary.costBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ borderRadius: '0.75rem', border: 'none', background: '#fbf9f5', fontSize: 11, boxShadow: '4px 4px 10px rgba(209,205,199,0.5)' }}
                  formatter={(v: number) => [`${v}%`, 'Allocation']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
            {summary.costBreakdown.slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 min-w-0">
                <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-[9px] text-secondary clay-text truncate">{item.category}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* ── ROW 3 — Timeline chart full width ── */}

        {/* [8] Timeline Breakdown — 12 cols */}
        <Card className="col-span-12 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <CardLabel>Timeline Breakdown (Weeks)</CardLabel>
            <TrendingUp size={14} className="text-primary opacity-40" />
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={summary.timelinePhases}
                layout="vertical"
                margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="2 6" horizontal={false} vertical stroke="rgba(209,205,199,0.35)" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#86736c' }} />
                <YAxis
                  dataKey="phase" type="category"
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 9, fill: '#53433d' }}
                  width={140}
                  tickFormatter={(val: string) => val.length > 26 ? val.slice(0, 24) + '…' : val}
                />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(209,205,199,0.12)' }}
                  contentStyle={{ borderRadius: '0.75rem', border: 'none', background: '#fbf9f5', fontSize: 11, boxShadow: '4px 4px 10px rgba(209,205,199,0.5)' }}
                  formatter={(v: number) => [`${v} Weeks`, 'Duration']}
                />
                <Bar dataKey="weeks" radius={[0, 5, 5, 0]} barSize={12}>
                  {summary.timelinePhases.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
      {/* ── END BENTO GRID ── */}

      {/* ── Footer: disclaimer + CTA ── */}
      <div className="flex items-center gap-3 mt-3">
        <Card className="flex-1 !p-3" style={{ borderRadius: '0.875rem' }}>
          <p className="text-[10px] text-secondary leading-relaxed clay-text">
            <strong className="text-on-surface font-semibold">Disclaimer:</strong> This AI-generated assessment provides a
            preliminary understanding of your project structure based on standard industry metrics.
            Final timelines, pricing and scope will be confirmed after a detailed consultation with OpenXcell.
          </p>
        </Card>
        <button onClick={click} className="clay-btn px-5 py-2.5 text-sm font-semibold flex items-center gap-2 shrink-0">
          Continue to Let's Connect
          <ArrowRight size={14} />
        </button>
      </div>

    </motion.div>
  );
}
