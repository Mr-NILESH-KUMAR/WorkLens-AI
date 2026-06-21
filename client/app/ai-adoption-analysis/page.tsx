"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

// ── DATA (derived from aiimpactjobslayoffriskdataset.csv) ─────────────────────

// Overall adoption level distribution + risk breakdown within each level
const adoptionDistribution = [
  { name: "Low",    value: 10539, pct: 52.7, high: 9.2,  med: 34.6, low: 56.2, color: "#ef4444" },
  { name: "Medium", value: 8046,  pct: 40.2, high: 58.2, med: 33.6, low: 8.3,  color: "#f97316" },
  { name: "High",   value: 1415,  pct: 7.1,  high: 80.8, med: 18.0, low: 1.2,  color: "#22c55e" },
];

// Behavioral metrics by adoption level
const adoptionMetrics = [
  { level: "Low",    tools: 1.00, usage: 2.51, automated: 23.89, training: 4.49 },
  { level: "Medium", tools: 3.50, usage: 9.56, automated: 50.33, training: 16.81 },
  { level: "High",   tools: 7.46, usage: 22.70, automated: 62.08, training: 49.38 },
];

// Adoption level spread by industry (%)
const adoptionByIndustry = [
  { industry: "IT",            High: 8.0, Medium: 40.0, Low: 52.0 },
  { industry: "Manufacturing", High: 7.5, Medium: 41.3, Low: 51.2 },
  { industry: "Education",     High: 7.1, Medium: 41.8, Low: 51.0 },
  { industry: "Finance",       High: 7.0, Medium: 41.2, Low: 51.8 },
  { industry: "Healthcare",    High: 7.0, Medium: 40.0, Low: 53.0 },
  { industry: "Telecom",       High: 6.8, Medium: 38.7, Low: 54.5 },
  { industry: "Logistics",     High: 6.6, Medium: 40.2, Low: 53.2 },
  { industry: "Retail",        High: 6.6, Medium: 38.7, Low: 54.7 },
];

// Top 10 job roles by % High adoption
const topHighAdoptionRoles = [
  { role: "Data Analyst",           pct: 9.0 },
  { role: "Production Supervisor",  pct: 8.9 },
  { role: "ML Engineer",            pct: 8.4 },
  { role: "Accountant",             pct: 8.2 },
  { role: "Inventory Analyst",      pct: 7.9 },
  { role: "Operator",               pct: 7.9 },
  { role: "Network Engineer",       pct: 7.5 },
  { role: "Medical Assistant",      pct: 7.5 },
  { role: "Teacher",                pct: 7.5 },
  { role: "Academic Coordinator",   pct: 7.2 },
];

// Tasks automated % bucketed vs Layoff Risk — the strongest relationship in the dataset
const automationVsRisk = [
  { bucket: "0-20%",   high: 0.4,  med: 17.6, low: 82.0 },
  { bucket: "20-40%",  high: 15.7, med: 51.0, low: 33.3 },
  { bucket: "40-60%",  high: 58.9, med: 36.0, low: 5.2  },
  { bucket: "60-80%",  high: 86.8, med: 12.7, low: 0.5  },
  { bucket: "80-100%", high: 96.4, med: 3.6,  low: 0.0  },
];

// Number of AI tools used — frequency distribution
const toolsUsedDistribution = [
  { tools: "0",  count: 3505 },
  { tools: "1",  count: 3566 },
  { tools: "2",  count: 5503 },
  { tools: "3",  count: 1990 },
  { tools: "4",  count: 1995 },
  { tools: "5",  count: 2286 },
  { tools: "6",  count: 228 },
  { tools: "7",  count: 235 },
  { tools: "8",  count: 226 },
  { tools: "9",  count: 226 },
  { tools: "10", count: 240 },
];

// Radar comparing behavioral profile across adoption levels (normalized 0-100)
const adoptionRadar = [
  { metric: "AI Tools (x10)",     Low: 10.0, Medium: 35.0, High: 74.6 },
  { metric: "Usage Hrs (x3)",     Low: 7.5,  Medium: 28.7, High: 68.1 },
  { metric: "Automated %",        Low: 23.9, Medium: 50.3, High: 62.1 },
  { metric: "Training Hrs (x2)",  Low: 9.0,  Medium: 33.6, High: 98.8 },
  { metric: "High Risk %",        Low: 9.2,  Medium: 58.2, High: 80.8 },
];

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

// ── DARK TOOLTIP ──────────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#e2e8f0" }}>
      {label && <div style={{ marginBottom: 4, color: "#94a3b8" }}>{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}{typeof p.value === "number" ? "%" : ""}</div>
      ))}
    </div>
  );
};

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function AIAdoptionAnalysis() {
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

  // ── DERIVED STATS ─────────────────────────────────────────────────────────
  const totalEmployees = adoptionDistribution.reduce((s, d) => s + d.value, 0);
  const lowAdoption = adoptionDistribution.find(d => d.name === "Low")!;
  const medAdoption = adoptionDistribution.find(d => d.name === "Medium")!;
  const highAdoption = adoptionDistribution.find(d => d.name === "High")!;
  const riskMultiplier = (highAdoption.high / lowAdoption.high).toFixed(1);

  function adoptionColor(level: string) {
    if (level === "High") return "#22c55e";
    if (level === "Medium") return "#f97316";
    return "#ef4444";
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

  // ── KPI CARD ─────────────────────────────────────────────────────────────
  function KpiCard({ icon, iconBg, label, value, sub }: any) {
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
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
          <span style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.textPrimary, lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: 11, color: T.textMuted }}>{sub}</div>
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
            <Image src="/logo-icon.png" alt="Worklens AI Logo" width={40} height={40} style={{ objectFit: "contain" }} />
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
          <div style={{ marginTop: 14 }}>
            <Image src="/logo.png" alt="logo" width={210} height={80} style={{ objectFit:"contain", width:"100%", height:"auto", marginBottom:8, display:"block", borderRadius:14 }} />
            <div style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius: 10, padding: "12px 10px", textAlign:"center" }}>
              <div style={{ fontSize:10, color:"#a5b4fc", lineHeight:1.4 }}>AI is transforming the future of work. Analyze. Adapt. Grow.</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflowY:"auto", minWidth:0 }}>

        {/* ── HEADER ── */}
        <header style={{ background: T.headerBg, borderBottom:`1px solid ${T.cardBorder}`, padding:"11px 20px", display:"flex", alignItems:"center", gap:12, flexShrink:0, transition:"background 0.3s" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:17, fontWeight:800, color: T.textPrimary, letterSpacing:0.5 }}>AI ADOPTION ANALYSIS</div>
            <div style={{ fontSize:11, color: T.textMuted }}>How AI tool usage, training and automation shape layoff risk.</div>
          </div>

          {/* Search */}
          <div style={{ display:"flex", alignItems:"center", background: T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"7px 12px", gap:8, width:180 }}>
            <span style={{ color: T.textMuted, fontSize:13 }}>🔍</span>
            <span style={{ color: T.textMuted, fontSize:12 }}>Search anything...</span>
          </div>

          {/* Industry filter */}
          <div style={{ background: T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"7px 12px", fontSize:12, color: T.textSecondary, display:"flex", alignItems:"center", gap:6 }}>
            All Industries <span>▾</span>
          </div>

          {/* Date range */}
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
            <KpiCard icon="🤖" iconBg="linear-gradient(135deg,#6366f1,#818cf8)" label="Total Employees" value={totalEmployees.toLocaleString()} sub="100% of dataset" />
            <KpiCard icon="🔴" iconBg="linear-gradient(135deg,#ef4444,#f87171)" label="Low Adoption" value={`${lowAdoption.pct}%`} sub={`${lowAdoption.value.toLocaleString()} employees`} />
            <KpiCard icon="🟠" iconBg="linear-gradient(135deg,#f97316,#fb923c)" label="Medium Adoption" value={`${medAdoption.pct}%`} sub={`${medAdoption.value.toLocaleString()} employees`} />
            <KpiCard icon="🟢" iconBg="linear-gradient(135deg,#22c55e,#4ade80)" label="High Adoption" value={`${highAdoption.pct}%`} sub={`${highAdoption.value.toLocaleString()} employees`} />
            <KpiCard icon="⚠️" iconBg="linear-gradient(135deg,#a855f7,#c084fc)" label="Risk Multiplier" value={`${riskMultiplier}x`} sub="High vs Low adoption risk" />
          </div>

          {/* ── ROW 1: Distribution + Behavioral Metrics ── */}
          <div style={{ display:"flex", gap:12, minHeight:300 }}>

            {/* Adoption Donut */}
            <Card title="AI Adoption Level Distribution" hoverable style={{ flex:"0 0 300px" }}>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={adoptionDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={82} dataKey="value" startAngle={90} endAngle={-270}>
                    {adoptionDistribution.map((e,i)=><Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position:"relative", marginTop:-114, textAlign:"center", pointerEvents:"none" }}>
                <div style={{ fontSize:17, fontWeight:700, color: T.textPrimary }}>{totalEmployees.toLocaleString()}</div>
                <div style={{ fontSize:9, color: T.textMuted }}>Total</div>
              </div>
              <div style={{ marginTop:32, display:"flex", flexDirection:"column", gap:6 }}>
                {adoptionDistribution.map(d=>(
                  <div key={d.name} style={{ display:"flex", alignItems:"center", gap:8, fontSize:11 }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background:d.color, display:"inline-block", flexShrink:0 }} />
                    <span style={{ color:d.color, fontWeight:600 }}>{d.name} Adoption</span>
                    <span style={{ color: T.textMuted, marginLeft:"auto" }}>{d.value.toLocaleString()} ({d.pct}%)</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:10, color: T.textMuted, marginTop:8, borderTop:`1px solid ${T.cardBorder}`, paddingTop:8 }}>
                ⚠ Most of the workforce remains in the Low adoption bracket.
              </div>
            </Card>

            {/* Risk by Adoption Level (stacked bar) */}
            <Card title="Layoff Risk by AI Adoption Level" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={adoptionDistribution} margin={{ right:10, bottom:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="high" name="High Risk"   stackId="a" fill="#ef4444" />
                  <Bar dataKey="med"  name="Medium Risk" stackId="a" fill="#f97316" />
                  <Bar dataKey="low"  name="Low Risk"    stackId="a" fill="#22c55e" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted, marginTop:6 }}>
                💡 Counterintuitively, High adoption roles show the highest layoff risk — these are typically the most automatable functions.
              </div>
            </Card>
          </div>

          {/* ── ROW 2: Automation vs Risk + Tools Distribution ── */}
          <div style={{ display:"flex", gap:12, minHeight:300 }}>

            {/* Automation % vs Risk Area chart */}
            <Card title="Tasks Automated % vs Layoff Risk" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={automationVsRisk} margin={{ right:10, bottom:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="bucket" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Area type="monotone" dataKey="high" name="High Risk" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} />
                  <Area type="monotone" dataKey="med"  name="Medium Risk" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="low"  name="Low Risk" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>⚠ The strongest predictor of risk: past 60% task automation, high risk exceeds 85%.</div>
            </Card>

            {/* AI Tools Used Distribution */}
            <Card title="Number of AI Tools Used — Distribution" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={toolsUsedDistribution} margin={{ right:10, bottom:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="tools" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} label={{ value:"Tools Used", position:"insideBottom", offset:-10, fill: T.textMuted, fontSize:10 }} />
                  <YAxis tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" name="Employees" fill="#6366f1" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>💡 Most employees use 0–2 AI tools; heavy tool usage (6+) is rare.</div>
            </Card>
          </div>

          {/* ── ROW 3: Industry Spread + Top Roles ── */}
          <div style={{ display:"flex", gap:12, minHeight:300 }}>

            {/* Adoption by Industry */}
            <Card title="AI Adoption Level by Industry" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={adoptionByIndustry} margin={{ right:10, bottom:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="industry" tick={{ fill: T.textMuted, fontSize:9 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="High"   name="High Adoption"   stackId="a" fill="#22c55e" />
                  <Bar dataKey="Medium" name="Medium Adoption" stackId="a" fill="#f97316" />
                  <Bar dataKey="Low"    name="Low Adoption"    stackId="a" fill="#ef4444" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>💡 Adoption mix is fairly even across industries — IT leads marginally in High adoption.</div>
            </Card>

            {/* Top 10 roles by high adoption */}
            <Card title="Top 10 Job Roles — High AI Adoption" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topHighAdoptionRoles} layout="vertical" margin={{ left:10, right:30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} horizontal={false} />
                  <XAxis type="number" domain={[0,12]} tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="role" tick={{ fill: T.textSecondary, fontSize:10 }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="pct" name="High Adoption %" fill="#6366f1" radius={[0,4,4,0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted, marginTop:6 }}>💡 Data and engineering-heavy roles lead in High AI adoption.</div>
            </Card>
          </div>

          {/* ── ROW 4: Behavioral Profile Radar + Metrics Table ── */}
          <div style={{ display:"flex", gap:12, minHeight:300 }}>

            {/* Radar profile across adoption levels */}
            <Card title="Behavioral Profile by Adoption Level" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={adoptionRadar}>
                  <PolarGrid stroke={T.gridLine} />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: T.textMuted, fontSize:10 }} />
                  <PolarRadiusAxis domain={[0,100]} tick={{ fill: T.textMuted, fontSize:9 }} axisLine={false} />
                  <Radar name="Low"    dataKey="Low"    stroke="#ef4444" fill="#ef4444" fillOpacity={0.18} />
                  <Radar name="Medium" dataKey="Medium" stroke="#f97316" fill="#f97316" fillOpacity={0.18} />
                  <Radar name="High"   dataKey="High"   stroke="#22c55e" fill="#22c55e" fillOpacity={0.25} />
                  <Tooltip content={<DarkTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted, display:"flex", gap:12, marginTop:6 }}>
                {[["#ef4444","Low"],["#f97316","Medium"],["#22c55e","High"]].map(([c,l])=>(
                  <span key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}} />{l} Adoption
                  </span>
                ))}
              </div>
            </Card>

            {/* Metrics comparison table */}
            <Card title="Adoption Level — Key Metrics" hoverable style={{ flex:1 }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                  <thead>
                    <tr>
                      {["Adoption Level","Employees","Avg AI Tools","Avg Usage (hrs/wk)","Avg Automated %","Avg Training (hrs)","High Risk %"].map(h => (
                        <th key={h} style={{ textAlign: h==="Adoption Level" ? "left" : "right", padding:"8px 10px", color: T.textMuted, fontWeight:600, textTransform:"uppercase", fontSize:9, letterSpacing:0.5, borderBottom:`1px solid ${T.cardBorder}`, whiteSpace:"nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {adoptionMetrics.map(m => {
                      const dist = adoptionDistribution.find(d => d.name === m.level)!;
                      return (
                        <tr key={m.level}>
                          <td style={{ padding:"8px 10px", borderBottom:`1px solid ${T.cardBorder}` }}>
                            <span style={{ background: `${adoptionColor(m.level)}22`, color: adoptionColor(m.level), borderRadius:6, padding:"3px 9px", fontSize:11, fontWeight:700 }}>
                              {m.level}
                            </span>
                          </td>
                          <td style={{ padding:"8px 10px", textAlign:"right", color: T.textSecondary, borderBottom:`1px solid ${T.cardBorder}` }}>{dist.value.toLocaleString()}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", color: T.textSecondary, borderBottom:`1px solid ${T.cardBorder}` }}>{m.tools.toFixed(2)}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", color: T.textSecondary, borderBottom:`1px solid ${T.cardBorder}` }}>{m.usage.toFixed(2)}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", color: T.textSecondary, borderBottom:`1px solid ${T.cardBorder}` }}>{m.automated.toFixed(1)}%</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", color: T.textSecondary, borderBottom:`1px solid ${T.cardBorder}` }}>{m.training.toFixed(1)}</td>
                          <td style={{ padding:"8px 10px", textAlign:"right", color: adoptionColor(m.level), fontWeight:700, borderBottom:`1px solid ${T.cardBorder}` }}>{dist.high}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop:10, fontSize:10, color: T.textMuted, borderTop:`1px solid ${T.cardBorder}`, paddingTop:8 }}>
                💡 High adoption employees use ~7x more tools and log ~9x more usage hours than Low adoption peers — yet face the highest risk, since their roles are the most automatable.
              </div>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}