"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area,
} from "recharts";



// ── DATA ─────────────────────────────────────────────────────────────────────
const riskByEducation = [
  { level: "High School", high: 38.2, med: 33.5, low: 28.3 },
  { level: "Bachelor's",  high: 35.1, med: 33.8, low: 31.1 },
  { level: "Master's",    high: 31.4, med: 32.9, low: 35.7 },
  { level: "PhD",         high: 24.6, med: 31.2, low: 44.2 },
];

const riskByCompanySize = [
  { size: "Small (1-50)",    high: 36.8, med: 33.1, low: 30.1 },
  { size: "Medium (51-500)", high: 34.2, med: 33.6, low: 32.2 },
  { size: "Large (500+)",    high: 31.5, med: 32.8, low: 35.7 },
];

const riskByJobLevel = [
  { level: "Entry",     high: 41.3, med: 33.4, low: 25.3 },
  { level: "Mid",       high: 34.0, med: 33.9, low: 32.1 },
  { level: "Senior",    high: 28.7, med: 32.6, low: 38.7 },
  { level: "Executive", high: 22.1, med: 30.4, low: 47.5 },
];

const riskFactorRadar = [
  { factor: "Routine Tasks",     High: 78, Medium: 52, Low: 28 },
  { factor: "Automation %",      High: 71, Medium: 48, Low: 22 },
  { factor: "AI Adoption",       High: 25, Medium: 45, Low: 68 },
  { factor: "Creativity Req.",   High: 22, Medium: 41, Low: 65 },
  { factor: "Human Interaction", High: 30, Medium: 47, Low: 70 },
  { factor: "Training Hours",    High: 8,  Medium: 13, Low: 19 },
];

const riskTrendByAge = [
  { age: "20-25", high: 39.5, med: 33.2, low: 27.3 },
  { age: "26-30", high: 36.8, med: 33.6, low: 29.6 },
  { age: "31-35", high: 33.4, med: 33.9, low: 32.7 },
  { age: "36-40", high: 30.9, med: 33.1, low: 36.0 },
  { age: "41-45", high: 29.2, med: 32.8, low: 38.0 },
  { age: "46-50", high: 28.1, med: 32.4, low: 39.5 },
  { age: "51-55", high: 27.5, med: 32.0, low: 40.5 },
  { age: "56-60", high: 28.8, med: 32.6, low: 38.6 },
];

const aiAdoptionRiskBreakdown = [
  { name: "Low Adoption",  value: 9120, high: 52.1, med: 34.8, low: 13.1, color: "#ef4444" },
  { name: "Medium Adoption", value: 6840, high: 30.2, med: 38.4, low: 31.4, color: "#f97316" },
  { name: "High Adoption", value: 4040, high: 12.6, med: 26.2, low: 61.2, color: "#22c55e" },
];

const topHighRiskCombos = [
  { combo: "Operator / Manufacturing",        pct: 58.4 },
  { combo: "Dispatcher / Logistics",          pct: 55.7 },
  { combo: "Cashier / Retail",                pct: 54.2 },
  { combo: "Data Entry Clerk / Finance",      pct: 52.9 },
  { combo: "Quality Inspector / Manufacturing", pct: 51.3 },
  { combo: "Telemarketer / Telecom",          pct: 50.6 },
  { combo: "Bank Teller / Finance",           pct: 48.8 },
  { combo: "Assembly Worker / Manufacturing", pct: 47.5 },
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
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}%</div>
      ))}
    </div>
  );
};

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function RiskAnalysis() {
  const [dark, setDark] = useState(true);
  const pathname = usePathname();

  const bg          = dark ? "#0B0F19" : "#f1f5f9";
  const sidebar     = dark ? "#0d1220" : "#ffffff";
  const cardBg      = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";
  const cardBorder  = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.10)";
  const textPrimary = dark ? "#e2e8f0" : "#0f172a";
  const textSecondary = dark ? "#94a3b8" : "#475569";
  const textMuted   = dark ? "#64748b" : "#94a3b8";
  const headerBg    = dark ? "#0d1220" : "#ffffff";
  const inputBg     = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const inputBorder = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)";
  const gridLine    = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)";

  const T = { bg, sidebar, cardBg, cardBorder, textPrimary, textSecondary, textMuted, headerBg, inputBg, inputBorder, gridLine };

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

        <div style={{ padding: "16px 14px 12px", borderBottom: `1px solid ${T.cardBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/logo-icon.png" alt="Worklens AI Logo" width={40} height={40} style={{ objectFit: "contain" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, background: "linear-gradient(90deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Worklens AI</div>
              <div style={{ fontSize: 9, color: T.textMuted, lineHeight: 1.3 }}>Workforce Risk Analytics</div>
            </div>
          </div>
        </div>

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
            <div style={{ fontSize:17, fontWeight:800, color: T.textPrimary, letterSpacing:0.5 }}>RISK ANALYSIS</div>
            <div style={{ fontSize:11, color: T.textMuted }}>Deep dive into layoff risk patterns across demographics and job factors.</div>
          </div>

          <div style={{ display:"flex", alignItems:"center", background: T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"7px 12px", gap:8, width:180 }}>
            <span style={{ color: T.textMuted, fontSize:13 }}>🔍</span>
            <span style={{ color: T.textMuted, fontSize:12 }}>Search anything...</span>
          </div>

          <div style={{ background: T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"7px 12px", fontSize:12, color: T.textSecondary, display:"flex", alignItems:"center", gap:6 }}>
            All Industries <span>▾</span>
          </div>

          <div style={{ background: T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"7px 12px", fontSize:12, color: T.textSecondary, display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
            May 1 – May 26, 2024 ⇄
          </div>

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

          <button style={{ background:"linear-gradient(90deg,#6366f1,#8b5cf6)", border:"none", borderRadius:8, padding:"8px 16px", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", boxShadow:"0 4px 14px rgba(99,102,241,0.35)", transition:"transform 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
          >
            Export Report ↓
          </button>
        </header>

        {/* ── CONTENT ── */}
        <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:16, flex:1 }}>

          {/* ── KPI SUMMARY ROW ── */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { icon: "⚠️", label: "High Risk Employees", value: "6,797", sub: "33.99% of 20,000 total", bg: "linear-gradient(135deg,#ef4444,#f87171)" },
              { icon: "🎓", label: "Highest Risk Education", value: "High School", sub: "45.6% high risk", bg: "linear-gradient(135deg,#f97316,#fb923c)" },
              { icon: "🧑‍💼", label: "Highest Risk Job Level", value: "Entry Level", sub: "44.5% high risk", bg: "linear-gradient(135deg,#eab308,#fde047)" },
              { icon: "🏭", label: "Riskiest Role / Industry", value: "Operator (Mfg.)", sub: "50.2% high risk", bg: "linear-gradient(135deg,#a855f7,#c084fc)" },
              { icon: "📘", label: "Training Hours Gap", value: "20.2 vs 6.0 hrs", sub: "High risk vs Low risk avg", bg: "linear-gradient(135deg,#3b82f6,#60a5fa)" },
            ].map((kpi, i) => {
              const [hovered, setHovered] = useState(false);
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  style={{
                    flex: 1, background: hovered ? (dark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)") : T.cardBg,
                    border: `1px solid ${hovered ? "#6366f1" : T.cardBorder}`,
                    borderRadius: 14, padding: "14px 16px",
                    transform: hovered ? "translateY(-4px)" : "translateY(0)",
                    transition: "all 0.25s ease",
                    boxShadow: hovered ? "0 12px 32px rgba(99,102,241,0.25)" : "none",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{kpi.icon}</div>
                    <span style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{kpi.label}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary, lineHeight: 1.2 }}>{kpi.value}</div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{kpi.sub}</div>
                </div>
              );
            })}
          </div>

          {/* ── ROW 1 ── */}
          <div style={{ display:"flex", gap:12, minHeight:280 }}>

            {/* Education */}
            <Card title="Layoff Risk by Education Level" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={riskByEducation} margin={{ right:10, bottom:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="level" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="high" name="High Risk"   stackId="a" fill="#ef4444" />
                  <Bar dataKey="med"  name="Medium Risk" stackId="a" fill="#f97316" />
                  <Bar dataKey="low"  name="Low Risk"    stackId="a" fill="#22c55e" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>💡 Higher education levels correlate with lower layoff risk.</div>
            </Card>

            {/* Company Size */}
            <Card title="Layoff Risk by Company Size" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={riskByCompanySize} margin={{ right:10, bottom:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="size" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="high" name="High Risk"   stackId="a" fill="#ef4444" />
                  <Bar dataKey="med"  name="Medium Risk" stackId="a" fill="#f97316" />
                  <Bar dataKey="low"  name="Low Risk"    stackId="a" fill="#22c55e" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>💡 Larger companies show slightly lower high-risk exposure.</div>
            </Card>

            {/* Job Level */}
            <Card title="Layoff Risk by Job Level" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={riskByJobLevel} margin={{ right:10, bottom:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="level" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="high" name="High Risk"   stackId="a" fill="#ef4444" />
                  <Bar dataKey="med"  name="Medium Risk" stackId="a" fill="#f97316" />
                  <Bar dataKey="low"  name="Low Risk"    stackId="a" fill="#22c55e" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>💡 Entry-level roles face the highest disruption risk.</div>
            </Card>
          </div>

          {/* ── ROW 2 ── */}
          <div style={{ display:"flex", gap:12, minHeight:300 }}>

            {/* Radar */}
            <Card title="Risk Factor Profile by Risk Category" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={riskFactorRadar}>
                  <PolarGrid stroke={T.gridLine} />
                  <PolarAngleAxis dataKey="factor" tick={{ fill: T.textMuted, fontSize:10 }} />
                  <PolarRadiusAxis tick={{ fill: T.textMuted, fontSize:9 }} domain={[0,100]} />
                  <Radar name="High Risk"   dataKey="High"   stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} />
                  <Radar name="Medium Risk" dataKey="Medium" stroke="#f97316" fill="#f97316" fillOpacity={0.18} />
                  <Radar name="Low Risk"    dataKey="Low"    stroke="#22c55e" fill="#22c55e" fillOpacity={0.18} />
                  <Tooltip content={<DarkTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted, display:"flex", gap:12, marginTop:6 }}>
                {[["#ef4444","High Risk"],["#f97316","Medium Risk"],["#22c55e","Low Risk"]].map(([c,l])=>(
                  <span key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}} />{l}
                  </span>
                ))}
              </div>
            </Card>

            {/* Age Trend */}
            <Card title="Risk Trend by Age Group" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={riskTrendByAge} margin={{ right:10, bottom:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="age" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Area type="monotone" dataKey="high" name="High Risk" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} />
                  <Area type="monotone" dataKey="med"  name="Medium Risk" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="low"  name="Low Risk" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>💡 Younger employees (20-30) face notably higher layoff risk.</div>
            </Card>
          </div>

          {/* ── ROW 3 ── */}
          <div style={{ display:"flex", gap:12 }}>

            {/* AI Adoption Donut + breakdown */}
            <Card title="AI Adoption Level Distribution & Risk" hoverable style={{ flex:1 }}>
              <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                <ResponsiveContainer width="50%" height={190}>
                  <PieChart>
                    <Pie data={aiAdoptionRiskBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={78} dataKey="value" startAngle={90} endAngle={-270}>
                      {aiAdoptionRiskBreakdown.map((e,i)=><Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<DarkTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
                  {aiAdoptionRiskBreakdown.map(d=>(
                    <div key={d.name}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
                        <span style={{ color:d.color, fontWeight:600 }}>{d.name}</span>
                        <span style={{ color: T.textMuted }}>{d.value.toLocaleString()} employees</span>
                      </div>
                      <div style={{ display:"flex", height:8, borderRadius:4, overflow:"hidden" }}>
                        <div style={{ width:`${d.high}%`, background:"#ef4444" }} />
                        <div style={{ width:`${d.med}%`, background:"#f97316" }} />
                        <div style={{ width:`${d.low}%`, background:"#22c55e" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ fontSize:10, color: T.textMuted, marginTop:8 }}>💡 Employees with low AI adoption are 4x more likely to be high risk.</div>
            </Card>

            {/* Top Risky Combos */}
            <Card title="Top High-Risk Role / Industry Combinations" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={225}>
                <BarChart data={topHighRiskCombos} layout="vertical" margin={{ left:10, right:30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} horizontal={false} />
                  <XAxis type="number" domain={[0,70]} tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="combo" tick={{ fill: T.textSecondary, fontSize:10 }} axisLine={false} tickLine={false} width={170} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="pct" name="High Risk %" fill="#ef4444" radius={[0,4,4,0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted, marginTop:6 }}>⚠ These combinations should be prioritized for reskilling programs.</div>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}