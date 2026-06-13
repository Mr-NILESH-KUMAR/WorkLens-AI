"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  ScatterChart, Scatter, ZAxis,
} from "recharts";

// ── DATA ─────────────────────────────────────────────────────────────────────
const riskDistribution = [
  { name: "High Risk",   value: 6797, pct: 34.0, color: "#ef4444" },
  { name: "Medium Risk", value: 6601, pct: 33.0, color: "#f97316" },
  { name: "Low Risk",    value: 6602, pct: 33.0, color: "#22c55e" },
];
const industryRisk = [
  { industry: "Manufacturing", pct: 48.2 },
  { industry: "Logistics",     pct: 41.5 },
  { industry: "Retail",        pct: 40.7 },
  { industry: "Finance",       pct: 37.7 },
  { industry: "Telecom",       pct: 35.2 },
  { industry: "IT",            pct: 28.0 },
  { industry: "Healthcare",    pct: 20.8 },
  { industry: "Education",     pct: 20.1 },
];
const topJobRoles = [
  { role: "Operator",              pct: 50.2 },
  { role: "Prod. Supervisor",      pct: 48.3 },
  { role: "Quality Engineer",      pct: 46.0 },
  { role: "Inventory Analyst",     pct: 44.6 },
  { role: "Dispatcher",            pct: 42.1 },
  { role: "Warehouse Manager",     pct: 41.3 },
  { role: "Supply Chain Analyst",  pct: 41.2 },
  { role: "Sales Associate",       pct: 40.6 },
  { role: "Accountant",            pct: 39.6 },
  { role: "Auditor",               pct: 37.4 },
];
const automationData = [
  { x: 5,  high: 0,    med: 5.9,  low: 94.1 },
  { x: 15, high: 0.3,  med: 19.9, low: 79.8 },
  { x: 25, high: 4.5,  med: 46.4, low: 49.1 },
  { x: 35, high: 23.4, med: 54.7, low: 21.9 },
  { x: 45, high: 49.3, med: 43.1, low: 7.7  },
  { x: 55, high: 67.0, med: 29.6, low: 3.5  },
  { x: 65, high: 82.3, med: 16.9, low: 0.8  },
  { x: 75, high: 92.1, med: 7.8,  low: 0.1  },
  { x: 85, high: 96.2, med: 3.8,  low: 0    },
  { x: 95, high: 98.2, med: 1.8,  low: 0    },
];
const humanSkills = [
  { role: "Store Manager",       score: 53.2 },
  { role: "Nurse",               score: 53.0 },
  { role: "Teacher",             score: 51.9 },
  { role: "Operations Analyst",  score: 40.8 },
  { role: "Warehouse Manager",   score: 40.4 },
  { role: "Supply Chain",        score: 40.3 },
  { role: "ML Engineer",         score: 39.9 },
  { role: "Financial Analyst",   score: 39.9 },
  { role: "Support Specialist",  score: 39.8 },
  { role: "Sales Associate",     score: 41.3 },
].reverse();
const trainingVsRisk = [
  { range: "0-5",   high: 12.1, med: 34.8, low: 53.1 },
  { range: "5-10",  high: 24.1, med: 33.2, low: 42.6 },
  { range: "10-20", high: 57.7, med: 34.0, low: 8.3  },
  { range: "20-30", high: 58.0, med: 33.1, low: 8.8  },
  { range: "30+",   high: 80.4, med: 18.3, low: 1.3  },
];
const experienceVsRisk = [
  { range: "0-2 yrs",  high: 45.2, med: 32.3, low: 22.6 },
  { range: "3-5 yrs",  high: 31.9, med: 33.2, low: 35.0 },
  { range: "5-10 yrs", high: 32.2, med: 33.2, low: 34.6 },
  { range: "10+ yrs",  high: 30.1, med: 33.1, low: 36.8 },
];
const scatterData = Array.from({ length: 150 }, (_, i) => ({
  x: Math.random() * 3,
  y: Math.random() * 100,
  risk: i < 50 ? "High" : i < 100 ? "Medium" : "Low",
}));
const sparkHigh  = [28,32,35,31,38,40,42,39,44,47,43,34];
const sparkMed   = [32,30,33,36,34,37,35,38,33,34,36,33];
const sparkLow   = [40,38,32,33,28,23,23,23,23,19,21,33];
const sparkUsage = [5,6,6,7,7,7,8,7,7,7,7,7];
const sparkTrain = [11,11,12,12,12,13,13,12,13,13,13,13];

const navItems = [
  { label: "Dashboard",             icon: "⊞", href: "/" },
  { label: "Risk Analysis",         icon: "⚠", href: "/risk-analysis" },
  { label: "Industry Insights",     icon: "🏭", href: "/industry-insights" },
  { label: "Job Role Insights",     icon: "👤", href: "/job-role-insights" },
  { label: "AI Adoption Analysis",  icon: "🤖", href: "/ai-adoption-analysis" },
  { label: "Skills & Protection",   icon: "🛡", href: "/skills-protection" },
  { label: "Risk Predictor",        icon: "🔮", href: "/risk-predictor", badge: "New" },
  { label: "Career Recommendations",icon: "🎯", href: "/career-recommendations" },
  { label: "Reports",               icon: "📊", href: "/reports" },
  { label: "About Dataset",         icon: "ℹ", href: "/about" },
];

// ── MINI SPARKLINE ────────────────────────────────────────────────────────────
function Spark({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 110, h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

// ── DARK TOOLTIP ──────────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#e2e8f0" }}>
      {label && <div style={{ marginBottom: 4, color: "#94a3b8" }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}%</div>
      ))}
    </div>
  );
};

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);

  const bg      = dark ? "#0B0F19" : "#f1f5f9";
  const sidebar  = dark ? "#0d1220" : "#ffffff";
  const cardBg   = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";
  const cardBorder = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.10)";
  const textPrimary = dark ? "#e2e8f0" : "#0f172a";
  const textSecondary = dark ? "#94a3b8" : "#475569";
  const textMuted = dark ? "#64748b" : "#94a3b8";
  const headerBg = dark ? "#0d1220" : "#ffffff";
  const inputBg  = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const inputBorder = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)";
  const gridLine = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)";

  const T = { bg, sidebar, cardBg, cardBorder, textPrimary, textSecondary, textMuted, headerBg, inputBg, inputBorder, gridLine };

  // ── KPI CARD ─────────────────────────────────────────────────────────────
  function KpiCard({ icon, iconBg, label, value, sub, sparkData, sparkColor }: any) {
    const [hovered, setHovered] = useState(false);
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered
            ? dark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)"
            : T.cardBg,
          border: `1px solid ${hovered ? "#6366f1" : T.cardBorder}`,
          borderRadius: 14, padding: "14px 16px", flex: 1, minWidth: 0,
          display: "flex", flexDirection: "column", gap: 6,
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.25s ease",
          boxShadow: hovered ? "0 12px 32px rgba(99,102,241,0.25)" : "none",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
          <span style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: T.textPrimary, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: T.textMuted }}>{sub}</div>
        {sparkData && <Spark data={sparkData} color={sparkColor} />}
        {hovered && (
          <div style={{ fontSize: 10, color: "#6366f1", marginTop: 2, fontWeight: 600 }}>Click to drill down →</div>
        )}
      </div>
    );
  }

  // ── GLASS CARD ───────────────────────────────────────────────────────────
  function Card({ title, children, style = {}, hoverable = false }: any) {
    const [hovered, setHovered] = useState(false);
    return (
      <div
        onMouseEnter={() => hoverable && setHovered(true)}
        onMouseLeave={() => hoverable && setHovered(false)}
        style={{
          background: T.cardBg,
          border: `1px solid ${hovered ? "rgba(99,102,241,0.4)" : T.cardBorder}`,
          borderRadius: 14, padding: 16,
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: "all 0.25s ease",
          boxShadow: hovered ? "0 8px 24px rgba(99,102,241,0.15)" : "none",
          ...style
        }}
      >
        {title && (
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>{title}</div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: bg, color: T.textPrimary, fontFamily: "Inter, Arial, sans-serif", overflow: "hidden", transition: "background 0.3s ease" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 210, background: T.sidebar, borderRight: `1px solid ${T.cardBorder}`, display: "flex", flexDirection: "column", flexShrink: 0, transition: "background 0.3s ease" }}>
        
        {/* Logo */}
        <div style={{ padding: "16px 14px 12px", borderBottom: `1px solid ${T.cardBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/logo.png" alt="Worklens AI Logo" width={40} height={40} style={{ objectFit: "contain" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, background: "linear-gradient(90deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Worklens AI</div>
              <div style={{ fontSize: 9, color: T.textMuted, lineHeight: 1.3 }}>Workforce Risk Analytics</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
  {navItems.map(item => {
    const isActive = pathname === item.href;
    return (
      <Link key={item.label} href={item.href} style={{
        display: "flex", alignItems: "center", gap: 9, width: "100%",
        padding: "9px 10px", borderRadius: 9, border: "none", cursor: "pointer",
        background: isActive ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "transparent",
        color: isActive ? "#fff" : T.textMuted,
        fontSize: 12, fontWeight: isActive ? 600 : 400,
        marginBottom: 2, textAlign: "left",
        textDecoration: "none",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.08)"; e.currentTarget.style.color = "#6366f1"; } }}
      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMuted; } }}
      >
        <span style={{ fontSize: 15 }}>{item.icon}</span>
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.badge && <span style={{ fontSize: 9, background: "#6366f1", color: "#fff", borderRadius: 4, padding: "1px 5px" }}>{item.badge}</span>}
      </Link>
    );
  })}
</nav>
        

        {/* Dataset Summary */}
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.cardBorder}` }}>
          <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Dataset Summary</div>
          {[["Total Records","20,000"],["Features","16"],["Last Updated","May 29, 2024"]].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
              <span style={{ color: T.textMuted }}>{k}</span>
              <span style={{ color: T.textPrimary, fontWeight:600 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, background: "linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius: 10, padding: "12px 10px", textAlign:"center" }}>
            <Image src="/logo.png" alt="logo" width={48} height={48} style={{ objectFit:"contain", marginBottom:6 }} />
            <div style={{ fontSize:10, color:"#a5b4fc", lineHeight:1.4 }}>AI is transforming the future of work. Analyze. Adapt. Grow.</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflowY:"auto", minWidth:0 }}>

        {/* ── HEADER ── */}
        <header style={{ background: T.headerBg, borderBottom:`1px solid ${T.cardBorder}`, padding:"11px 20px", display:"flex", alignItems:"center", gap:12, flexShrink:0, transition:"background 0.3s" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:17, fontWeight:800, color: T.textPrimary, letterSpacing:0.5 }}>AI JOB IMPACT ANALYTICS PLATFORM</div>
            <div style={{ fontSize:11, color: T.textMuted }}>AI-Powered Workforce Risk & Career Analytics Platform.</div>
          </div>

          {/* Search */}
          <div style={{ display:"flex", alignItems:"center", background: T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"7px 12px", gap:8, width:180 }}>
            <span style={{ color: T.textMuted, fontSize:13 }}>🔍</span>
            <span style={{ color: T.textMuted, fontSize:12 }}>Search anything...</span>
          </div>

          {/* Industry */}
          <div style={{ background: T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"7px 12px", fontSize:12, color: T.textSecondary, display:"flex", alignItems:"center", gap:6 }}>
            All Industries <span>▾</span>
          </div>

          {/* Date */}
          <div style={{ background: T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"7px 12px", fontSize:12, color: T.textSecondary, display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
            May 1 – May 26, 2024 ⇄
          </div>

          {/* Dark/Light Toggle */}
          <button
            onClick={() => setDark(!dark)}
            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
              border: `1px solid ${T.inputBorder}`,
              borderRadius: 8, width: 36, height: 36,
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", fontSize:17, transition:"all 0.2s",
            }}
          >
            {dark ? "🌙" : "☀️"}
          </button>

          {/* Export */}
          <button style={{ background:"linear-gradient(90deg,#6366f1,#8b5cf6)", border:"none", borderRadius:8, padding:"8px 16px", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", boxShadow:"0 4px 14px rgba(99,102,241,0.35)", transition:"transform 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
          >
            Export Report ↓
          </button>
        </header>

        {/* ── CONTENT ── */}
        <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:16, flex:1 }}>

          {/* ── KPI ROW ── */}
          <div style={{ display:"flex", gap:12 }}>
            <KpiCard icon="👥" iconBg="linear-gradient(135deg,#6366f1,#818cf8)" label="Total Employees" value="20,000" sub="100% of dataset" sparkData={[18,19,20,19,20,20,20,20,20,20,20,20]} sparkColor="#818cf8" />
            <KpiCard icon="⚠️" iconBg="linear-gradient(135deg,#ef4444,#f87171)" label="High Risk Jobs" value="6,797" sub="33.99% of total" sparkData={sparkHigh} sparkColor="#ef4444" />
            <KpiCard icon="📈" iconBg="linear-gradient(135deg,#f97316,#fb923c)" label="Medium Risk Jobs" value="6,601" sub="33.0% of total" sparkData={sparkMed} sparkColor="#f97316" />
            <KpiCard icon="🛡️" iconBg="linear-gradient(135deg,#22c55e,#4ade80)" label="Low Risk Jobs" value="6,602" sub="33.0% of total" sparkData={sparkLow} sparkColor="#22c55e" />
            <KpiCard icon="🤖" iconBg="linear-gradient(135deg,#3b82f6,#60a5fa)" label="Avg AI Usage" value="6.8 hrs/week" sub="Per employee" sparkData={sparkUsage} sparkColor="#3b82f6" />
            <KpiCard icon="🎓" iconBg="linear-gradient(135deg,#a855f7,#c084fc)" label="Avg AI Training" value="12.6 hrs" sub="Per employee" sparkData={sparkTrain} sparkColor="#a855f7" />
          </div>

          {/* ── ROW 1: CHARTS ── */}
          <div style={{ display:"flex", gap:12, minHeight:280 }}>

            {/* Donut */}
            <Card title="Layoff Risk Distribution" hoverable style={{ flex:"0 0 240px" }}>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={54} outerRadius={82} dataKey="value" startAngle={90} endAngle={-270}>
                    {riskDistribution.map((e,i)=><Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position:"relative", marginTop:-105, textAlign:"center", pointerEvents:"none" }}>
                <div style={{ fontSize:17, fontWeight:700, color: T.textPrimary }}>20,000</div>
                <div style={{ fontSize:10, color: T.textMuted }}>Total</div>
              </div>
              <div style={{ marginTop:74, display:"flex", flexDirection:"column", gap:5 }}>
                {riskDistribution.map(d=>(
                  <div key={d.name} style={{ display:"flex", alignItems:"center", gap:8, fontSize:11 }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background:d.color, display:"inline-block", flexShrink:0 }} />
                    <span style={{ color:d.color, fontWeight:600 }}>{d.name}</span>
                    <span style={{ color: T.textMuted, marginLeft:"auto" }}>{d.value.toLocaleString()} ({d.pct}%)</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:8, fontSize:10, color: T.textMuted, borderTop:`1px solid ${T.cardBorder}`, paddingTop:8 }}>
                ⚠ High risk employees require immediate attention and reskilling.
              </div>
            </Card>

            {/* Industry */}
            <Card title="Layoff Risk by Industry" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={225}>
                <BarChart data={industryRisk} layout="vertical" margin={{ left:10, right:30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} horizontal={false} />
                  <XAxis type="number" domain={[0,60]} tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="industry" tick={{ fill: T.textSecondary, fontSize:11 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="pct" name="High Risk %" fill="#ef4444" radius={[0,4,4,0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Top Jobs */}
            <Card title="Top 10 Job Roles by High Risk" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={225}>
                <BarChart data={topJobRoles} layout="vertical" margin={{ left:10, right:30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} horizontal={false} />
                  <XAxis type="number" domain={[0,80]} tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="role" tick={{ fill: T.textSecondary, fontSize:10 }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="pct" name="High Risk %" fill="#8b5cf6" radius={[0,4,4,0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Scatter */}
            <Card title="AI Adoption vs Layoff Risk" hoverable style={{ flex:"0 0 255px" }}>
              <div style={{ fontSize:10, color: T.textMuted, marginBottom:6, display:"flex", gap:10, flexWrap:"wrap" }}>
                {[["#ef4444","High"],["#f97316","Medium"],["#22c55e","Low"]].map(([c,l])=>(
                  <span key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}} />{l} Risk
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={196}>
                <ScatterChart margin={{ top:0, right:10, bottom:20, left:-10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="x" type="number" domain={[0,3]} ticks={[0,1,2,3]} tickFormatter={v=>["Low","","Med","High"][v]||""} tick={{ fill: T.textMuted, fontSize:9 }} axisLine={false} tickLine={false} label={{ value:"AI Adoption Level", position:"insideBottom", offset:-12, fill: T.textMuted, fontSize:10 }} />
                  <YAxis dataKey="y" domain={[0,100]} tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:9 }} axisLine={false} tickLine={false} />
                  <ZAxis range={[18,18]} />
                  <Scatter data={scatterData.filter(d=>d.risk==="High")} fill="#ef4444" fillOpacity={0.65} />
                  <Scatter data={scatterData.filter(d=>d.risk==="Medium")} fill="#f97316" fillOpacity={0.65} />
                  <Scatter data={scatterData.filter(d=>d.risk==="Low")} fill="#22c55e" fillOpacity={0.65} />
                </ScatterChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>💡 Higher AI adoption is associated with lower layoff risk.</div>
            </Card>
          </div>

          {/* ── ROW 2: CHARTS ── */}
          <div style={{ display:"flex", gap:12, minHeight:270 }}>

            {/* Automation Line */}
            <Card title="Automation Impact on Risk" hoverable style={{ flex:1 }}>
              <div style={{ fontSize:10, color: T.textMuted, marginBottom:6, display:"flex", gap:12 }}>
                {[["#ef4444","High Risk"],["#f97316","Medium Risk"],["#22c55e","Low Risk"]].map(([c,l])=>(
                  <span key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}} />{l}
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={205}>
                <LineChart data={automationData} margin={{ right:10, bottom:20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="x" tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} label={{ value:"Tasks Automated (%)", position:"insideBottom", offset:-10, fill: T.textMuted, fontSize:10 }} />
                  <YAxis tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Line type="monotone" dataKey="high" name="High Risk" stroke="#ef4444" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="med"  name="Medium Risk" stroke="#f97316" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="low"  name="Low Risk" stroke="#22c55e" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>💡 As automation increases, high risk rises significantly.</div>
            </Card>

            {/* Human Skills */}
            <Card title="Human Skills Protection Index" hoverable style={{ flex:1 }}>
              <div style={{ fontSize:10, color: T.textMuted, marginBottom:10 }}>Based on Creativity + Human Interaction − Routine Tasks</div>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {humanSkills.map(s=>(
                  <div key={s.role} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:10, color: T.textSecondary, width:130, textAlign:"right", flexShrink:0 }}>{s.role}</span>
                    <div style={{ flex:1, background: T.inputBg, borderRadius:4, height:10, overflow:"hidden" }}>
                      <div style={{ width:`${(s.score/60)*100}%`, height:"100%", background:"linear-gradient(90deg,#22c55e,#4ade80)", borderRadius:4, transition:"width 0.5s ease" }} />
                    </div>
                    <span style={{ fontSize:10, color:"#22c55e", width:30 }}>{s.score}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:10, color: T.textMuted, marginTop:8 }}>💡 Higher score = More protected from AI impact.</div>
            </Card>

            {/* Training vs Risk */}
            <Card title="AI Training Hours vs Risk" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={trainingVsRisk} margin={{ right:10, bottom:20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="range" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} label={{ value:"AI Training Hours", position:"insideBottom", offset:-10, fill: T.textMuted, fontSize:10 }} />
                  <YAxis tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="high" name="High Risk"   stackId="a" fill="#ef4444" />
                  <Bar dataKey="med"  name="Medium Risk" stackId="a" fill="#f97316" />
                  <Bar dataKey="low"  name="Low Risk"    stackId="a" fill="#22c55e" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>💡 More training is associated with lower layoff risk.</div>
            </Card>

            {/* Experience vs Risk */}
            <Card title="Experience Level vs Risk" hoverable style={{ flex:1 }}>
              <div style={{ fontSize:10, color: T.textMuted, marginBottom:6, display:"flex", gap:10 }}>
                {[["#22c55e","Low"],["#f97316","Med"],["#ef4444","High"]].map(([c,l])=>(
                  <span key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}} />{l} Risk
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={205}>
                <BarChart data={experienceVsRisk} margin={{ right:10, bottom:20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="range" tick={{ fill: T.textMuted, fontSize:9 }} axisLine={false} tickLine={false} label={{ value:"Experience Level", position:"insideBottom", offset:-10, fill: T.textMuted, fontSize:10 }} />
                  <YAxis tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="low"  name="Low Risk"    stackId="a" fill="#22c55e" />
                  <Bar dataKey="med"  name="Medium Risk" stackId="a" fill="#f97316" />
                  <Bar dataKey="high" name="High Risk"   stackId="a" fill="#ef4444" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>💡 Mid experience level (3–10 yrs) faces higher risk.</div>
            </Card>
          </div>

          {/* ── BOTTOM ROW ── */}
          <div style={{ display:"flex", gap:12 }}>

            {/* Risk Predictor */}
            <Card style={{ flex:2 }} hoverable>
              <div style={{ display:"flex", gap:20 }}>
                <div style={{ flex:"0 0 200px" }}>
                  <div style={{ fontSize:13, fontWeight:700, color: T.textPrimary, marginBottom:4, textTransform:"uppercase", letterSpacing:0.8 }}>AI Risk Predictor</div>
                  <div style={{ fontSize:11, color: T.textMuted, marginBottom:16 }}>Predict the layoff risk for any job profile using AI and Machine Learning.</div>
                  <button style={{ background:"linear-gradient(90deg,#6366f1,#8b5cf6)", border:"none", borderRadius:8, padding:"10px 20px", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", boxShadow:"0 4px 14px rgba(99,102,241,0.35)", transition:"transform 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                  >Try Risk Predictor →</button>
                </div>
                <div style={{ flex:1, background: T.inputBg, borderRadius:10, padding:"12px 16px" }}>
                  <div style={{ fontSize:10, color:"#6366f1", fontWeight:700, marginBottom:10, textTransform:"uppercase" }}>Example Prediction</div>
                  <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                    {[["Job Role","Financial Analyst"],["Industry","Finance"],["Job Title","4.5 Years"],["AI Usage (hrs/week)","8"],["Training Hours","10"]].map(([k,v])=>(
                      <div key={k}>
                        <div style={{ fontSize:10, color: T.textMuted }}>{k}</div>
                        <div style={{ fontSize:12, color: T.textPrimary, fontWeight:600 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ flex:"0 0 220px", background: T.inputBg, borderRadius:10, padding:"12px 16px" }}>
                  <div style={{ display:"flex", gap:16 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:10, color: T.textMuted, marginBottom:8 }}>Predicted Risk</div>
                      <div style={{ fontSize:20, fontWeight:700, color:"#ef4444" }}>HIGH RISK</div>
                      <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:6 }}>
                        {[["High","82%","#ef4444"],["Medium","12%","#f97316"],["Low","6%","#22c55e"]].map(([l,v,c])=>(
                          <div key={l} style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <span style={{ fontSize:11, color: T.textSecondary, width:50 }}>{l}</span>
                            <div style={{ flex:1, background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)", borderRadius:4, height:6 }}>
                              <div style={{ width:v, height:"100%", background:c, borderRadius:4 }} />
                            </div>
                            <span style={{ fontSize:11, color:c }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <div style={{ width:68, height:68, borderRadius:"50%", border:"5px solid #ef4444", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:700, color:"#ef4444" }}>82%</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Key Insights + Recommendations */}
            <Card title="Key Insights" hoverable style={{ flex:1 }}>
              {[
                ["#ef4444","⚠","33.99% of jobs are at high risk of AI-driven disruption."],
                ["#f97316","⚠","Manufacturing, Logistics & Retail show highest risk exposure."],
                ["#8b5cf6","🔮","Higher AI adoption is linked to lower layoff risk."],
                ["#22c55e","🛡","AI training significantly reduces job displacement risk."],
                ["#3b82f6","💡","Human skills like creativity are key protection factors."],
              ].map(([c,icon,text],i)=>(
                <div key={i} style={{ display:"flex", gap:8, marginBottom:9, alignItems:"flex-start" }}>
                  <span style={{ fontSize:15, color:c, flexShrink:0, marginTop:1 }}>{icon}</span>
                  <span style={{ fontSize:11, color: T.textSecondary, lineHeight:1.5 }}>{text}</span>
                </div>
              ))}
              <div style={{ marginTop:6, fontSize:11, fontWeight:700, color: T.textPrimary, textTransform:"uppercase", letterSpacing:0.8, borderTop:`1px solid ${T.cardBorder}`, paddingTop:10 }}>Recommendations</div>
              {[
                "Invest in AI training and upskilling programs.",
                "Focus on roles requiring creativity and human interaction.",
                "Monitor high-risk roles and prepare transition plans.",
                "Encourage continuous learning and adaptability.",
              ].map((r,i)=>(
                <div key={i} style={{ display:"flex", gap:8, marginTop:6, alignItems:"flex-start" }}>
                  <span style={{ color:"#22c55e", fontSize:12, flexShrink:0 }}>✓</span>
                  <span style={{ fontSize:11, color: T.textSecondary, lineHeight:1.5 }}>{r}</span>
                </div>
              ))}
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}