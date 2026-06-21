"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis,
} from "recharts";

// ── DATA (derived from aiimpactjobslayoffriskdataset.csv) ─────────────────────

// Creativity Requirement bucketed vs Layoff Risk — strongest protective factor in the dataset
const creativityVsRisk = [
  { bucket: "0-20%",   high: 84.5, med: 14.9, low: 0.6  },
  { bucket: "20-40%",  high: 57.4, med: 36.5, low: 6.1  },
  { bucket: "40-60%",  high: 20.6, med: 53.6, low: 25.8 },
  { bucket: "60-80%",  high: 2.0,  med: 34.6, low: 63.4 },
  { bucket: "80-100%", high: 0.0,  med: 10.4, low: 89.6 },
];

// Human Interaction Level bucketed vs Layoff Risk
const humanInteractionVsRisk = [
  { bucket: "0-20%",   high: 48.7, med: 32.8, low: 18.5 },
  { bucket: "20-40%",  high: 41.7, med: 33.9, low: 24.4 },
  { bucket: "40-60%",  high: 37.3, med: 33.8, low: 28.9 },
  { bucket: "60-80%",  high: 31.0, med: 31.9, low: 37.1 },
  { bucket: "80-100%", high: 25.8, med: 32.7, low: 41.5 },
];

// Education Level vs Risk
const educationVsRisk = [
  { level: "High School", high: 45.6, med: 32.5, low: 22.0 },
  { level: "Bachelor's",  high: 35.1, med: 33.7, low: 31.2 },
  { level: "Master's",    high: 27.1, med: 32.6, low: 40.3 },
  { level: "PhD",         high: 20.1, med: 30.2, low: 49.7 },
];

// Routine Task % vs Risk — the threat axis, mirrors creativity inversely
const routineVsRisk = [
  { bucket: "0-20%",   high: 0.0,  med: 8.7,  low: 91.3 },
  { bucket: "20-40%",  high: 1.7,  med: 35.8, low: 62.5 },
  { bucket: "40-60%",  high: 20.9, med: 56.7, low: 22.4 },
  { bucket: "60-80%",  high: 61.8, med: 33.9, low: 4.3  },
  { bucket: "80-100%", high: 87.3, med: 12.3, low: 0.4  },
];

// Job roles ranked by combined Skills Protection Index (creativity + human interaction - routine task%)
const protectionByRole = [
  { role: "Store Manager",       protection: 81.1, highRisk: 36.7 },
  { role: "Nurse",                protection: 80.9, highRisk: 16.7 },
  { role: "Teacher",              protection: 77.9, highRisk: 16.4 },
  { role: "Sales Associate",      protection: 57.9, highRisk: 40.6 },
  { role: "Operations Analyst",   protection: 56.3, highRisk: 33.3 },
  { role: "Warehouse Manager",    protection: 55.1, highRisk: 41.3 },
  { role: "Supply Chain Analyst", protection: 54.9, highRisk: 41.2 },
  { role: "Financial Analyst",    protection: 54.0, highRisk: 36.3 },
  { role: "Support Specialist",   protection: 54.0, highRisk: 35.1 },
  { role: "ML Engineer",          protection: 53.6, highRisk: 27.5 },
];

const mostExposedRoles = [
  { role: "Operator",              protection: 50.7, highRisk: 50.2 },
  { role: "Production Supervisor", protection: 50.6, highRisk: 48.3 },
  { role: "Auditor",               protection: 50.2, highRisk: 37.4 },
  { role: "Dispatcher",            protection: 50.1, highRisk: 42.1 },
  { role: "Academic Coordinator",  protection: 49.5, highRisk: 22.8 },
  { role: "Accountant",            protection: 49.4, highRisk: 39.6 },
];

// Scatter: Creativity vs Human Interaction, colored by risk (sampled representative points)
const scatterByRisk = {
  high: [
    { creativity: 12, human: 22 }, { creativity: 18, human: 30 }, { creativity: 22, human: 18 },
    { creativity: 28, human: 35 }, { creativity: 15, human: 40 }, { creativity: 30, human: 25 },
    { creativity: 20, human: 45 }, { creativity: 35, human: 20 }, { creativity: 25, human: 32 },
    { creativity: 10, human: 28 }, { creativity: 38, human: 38 }, { creativity: 17, human: 15 },
  ],
  medium: [
    { creativity: 45, human: 48 }, { creativity: 50, human: 42 }, { creativity: 42, human: 55 },
    { creativity: 55, human: 45 }, { creativity: 48, human: 60 }, { creativity: 40, human: 50 },
    { creativity: 52, human: 38 }, { creativity: 47, human: 58 }, { creativity: 58, human: 52 },
    { creativity: 44, human: 65 }, { creativity: 60, human: 48 }, { creativity: 38, human: 42 },
  ],
  low: [
    { creativity: 70, human: 75 }, { creativity: 80, human: 68 }, { creativity: 65, human: 82 },
    { creativity: 85, human: 72 }, { creativity: 75, human: 90 }, { creativity: 90, human: 78 },
    { creativity: 68, human: 85 }, { creativity: 78, human: 95 }, { creativity: 95, human: 80 },
    { creativity: 72, human: 65 }, { creativity: 88, human: 88 }, { creativity: 60, human: 92 },
  ],
};

// Radar comparing skill profiles: most protected vs most exposed role groups
const skillProfileRadar = [
  { metric: "Creativity",         "Most Protected": 48.8, "Most Exposed": 46.9 },
  { metric: "Human Interaction",  "Most Protected": 73.7, "Most Exposed": 56.1 },
  { metric: "Low Routine Tasks",  "Most Protected": 49.4, "Most Exposed": 47.2 },
  { metric: "Education (PhD %)",  "Most Protected": 28.0, "Most Exposed": 22.0 },
  { metric: "Protection Index",   "Most Protected": 80.0, "Most Exposed": 50.0 },
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
export default function SkillsProtection() {
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
  const topProtected = protectionByRole[0];
  const mostExposed = [...mostExposedRoles].sort((a, b) => b.highRisk - a.highRisk)[0];
  const phdRow = educationVsRisk.find(e => e.level === "PhD")!;
  const highSchoolRow = educationVsRisk.find(e => e.level === "High School")!;
  const educationGap = (highSchoolRow.high - phdRow.high).toFixed(1);

  function riskColorFor(pct: number) {
    if (pct >= 40) return "#ef4444";
    if (pct >= 25) return "#f97316";
    return "#22c55e";
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
            <div style={{ fontSize:17, fontWeight:800, color: T.textPrimary, letterSpacing:0.5 }}>SKILLS & PROTECTION</div>
            <div style={{ fontSize:11, color: T.textMuted }}>Which human skills protect against AI-driven layoff risk.</div>
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
            <KpiCard icon="🎨" iconBg="linear-gradient(135deg,#6366f1,#818cf8)" label="Top Protective Skill" value="Creativity" sub="Strongest predictor of low risk" />
            <KpiCard icon="🛡️" iconBg="linear-gradient(135deg,#22c55e,#4ade80)" label="Most Protected Role" value={topProtected.role} sub={`Protection score ${topProtected.protection}`} />
            <KpiCard icon="⚠️" iconBg="linear-gradient(135deg,#ef4444,#f87171)" label="Most Exposed Role" value={mostExposed.role} sub={`${mostExposed.highRisk}% high risk`} />
            <KpiCard icon="🎓" iconBg="linear-gradient(135deg,#a855f7,#c084fc)" label="Education Risk Gap" value={`${educationGap} pts`} sub="High School vs PhD high-risk %" />
            <KpiCard icon="🤝" iconBg="linear-gradient(135deg,#3b82f6,#60a5fa)" label="Human-Skill Roles" value="3" sub="Roles >80% human interaction" />
          </div>

          {/* ── ROW 1: Creativity + Human Interaction ── */}
          <div style={{ display:"flex", gap:12, minHeight:300 }}>

            <Card title="Creativity Requirement vs Layoff Risk" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={creativityVsRisk} margin={{ right:10, bottom:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="bucket" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Area type="monotone" dataKey="high" name="High Risk" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} />
                  <Area type="monotone" dataKey="med"  name="Medium Risk" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="low"  name="Low Risk" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>🛡 Creativity is the single strongest protective factor — above 80%, high risk drops to nearly 0%.</div>
            </Card>

            <Card title="Human Interaction Level vs Layoff Risk" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={humanInteractionVsRisk} margin={{ right:10, bottom:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="bucket" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="high" name="High Risk"   stackId="a" fill="#ef4444" />
                  <Bar dataKey="med"  name="Medium Risk" stackId="a" fill="#f97316" />
                  <Bar dataKey="low"  name="Low Risk"    stackId="a" fill="#22c55e" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>🤝 More human-facing roles consistently see lower layoff risk.</div>
            </Card>
          </div>

          {/* ── ROW 2: Routine Tasks + Education ── */}
          <div style={{ display:"flex", gap:12, minHeight:300 }}>

            <Card title="Routine Task % vs Layoff Risk" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={routineVsRisk} margin={{ right:10, bottom:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="bucket" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Area type="monotone" dataKey="high" name="High Risk" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} />
                  <Area type="monotone" dataKey="med"  name="Medium Risk" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="low"  name="Low Risk" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>⚠ The threat axis: routine-heavy work (80%+) drives high risk above 87%.</div>
            </Card>

            <Card title="Layoff Risk by Education Level" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={educationVsRisk} margin={{ right:10, bottom:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="level" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="high" name="High Risk"   stackId="a" fill="#ef4444" />
                  <Bar dataKey="med"  name="Medium Risk" stackId="a" fill="#f97316" />
                  <Bar dataKey="low"  name="Low Risk"    stackId="a" fill="#22c55e" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted }}>🎓 Higher education levels correlate with meaningfully lower layoff risk.</div>
            </Card>
          </div>

          {/* ── ROW 3: Scatter + Radar ── */}
          <div style={{ display:"flex", gap:12, minHeight:300 }}>

            <Card title="Creativity vs Human Interaction, by Risk" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart margin={{ right:20, bottom:10, left:0, top:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis type="number" dataKey="creativity" name="Creativity" domain={[0,100]} tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} label={{ value:"Creativity Requirement", position:"insideBottom", offset:-5, fill: T.textMuted, fontSize:10 }} />
                  <YAxis type="number" dataKey="human" name="Human Interaction" domain={[0,100]} tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <ZAxis range={[40,40]} />
                  <Tooltip content={<DarkTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="High Risk"   data={scatterByRisk.high}   fill="#ef4444" />
                  <Scatter name="Medium Risk" data={scatterByRisk.medium} fill="#f97316" />
                  <Scatter name="Low Risk"    data={scatterByRisk.low}    fill="#22c55e" />
                </ScatterChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted, display:"flex", gap:12, marginTop:4 }}>
                {[["#ef4444","High Risk"],["#f97316","Medium Risk"],["#22c55e","Low Risk"]].map(([c,l])=>(
                  <span key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}} />{l}
                  </span>
                ))}
              </div>
            </Card>

            <Card title="Skill Profile — Most Protected vs Most Exposed Roles" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={skillProfileRadar}>
                  <PolarGrid stroke={T.gridLine} />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: T.textMuted, fontSize:9 }} />
                  <PolarRadiusAxis domain={[0,100]} tick={{ fill: T.textMuted, fontSize:9 }} axisLine={false} />
                  <Radar name="Most Protected" dataKey="Most Protected" stroke="#22c55e" fill="#22c55e" fillOpacity={0.25} />
                  <Radar name="Most Exposed"   dataKey="Most Exposed"   stroke="#ef4444" fill="#ef4444" fillOpacity={0.18} />
                  <Tooltip content={<DarkTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted, marginTop:4 }}>💡 Human interaction is the widest gap between protected and exposed role groups.</div>
            </Card>
          </div>

          {/* ── ROW 4: Role Rankings ── */}
          <div style={{ display:"flex", gap:12, minHeight:300 }}>

            <Card title="Top 10 Most Protected Job Roles" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={protectionByRole} layout="vertical" margin={{ left:10, right:30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} horizontal={false} />
                  <XAxis type="number" domain={[0,90]} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="role" tick={{ fill: T.textSecondary, fontSize:10 }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="protection" name="Protection Score" fill="#22c55e" radius={[0,4,4,0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted, marginTop:6 }}>🛡 Score = Creativity + Human Interaction − Routine Task %. Higher is safer.</div>
            </Card>

            <Card title="Protection Score by Role — Full Table" hoverable style={{ flex:1 }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                  <thead>
                    <tr>
                      {["Job Role","Protection Score","High Risk %"].map(h => (
                        <th key={h} style={{ textAlign: h==="Job Role" ? "left" : "right", padding:"8px 10px", color: T.textMuted, fontWeight:600, textTransform:"uppercase", fontSize:9, letterSpacing:0.5, borderBottom:`1px solid ${T.cardBorder}`, whiteSpace:"nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...protectionByRole, ...mostExposedRoles].map(r => (
                      <tr key={r.role}>
                        <td style={{ padding:"7px 10px", color: T.textPrimary, fontWeight:600, borderBottom:`1px solid ${T.cardBorder}` }}>{r.role}</td>
                        <td style={{ padding:"7px 10px", textAlign:"right", color: T.textSecondary, borderBottom:`1px solid ${T.cardBorder}` }}>{r.protection}</td>
                        <td style={{ padding:"7px 10px", textAlign:"right", borderBottom:`1px solid ${T.cardBorder}` }}>
                          <span style={{ background: `${riskColorFor(r.highRisk)}22`, color: riskColorFor(r.highRisk), borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700 }}>
                            {r.highRisk}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop:10, fontSize:10, color: T.textMuted, borderTop:`1px solid ${T.cardBorder}`, paddingTop:8 }}>
                💡 Notice protection score and high-risk % don't always move together — routine-heavy analytical roles can score similarly to caregiving roles on the index, yet face very different risk levels in practice.
              </div>
            </Card>
          </div>

          {/* ── ROW 5: Recommendations ── */}
          <Card title="Skill-Building Recommendations" hoverable>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              {[
                ["🎨", "#6366f1", "Develop Creativity", "Take on tasks requiring original thinking, design, or problem-solving — the single strongest protective factor in the data."],
                ["🤝", "#3b82f6", "Build Human-Facing Skills", "Roles with high human interaction (coaching, care, sales leadership) consistently show lower layoff risk."],
                ["🎓", "#a855f7", "Pursue Advanced Education", "PhD holders face roughly half the high-risk exposure of High School-only workers."],
                ["⚙️", "#22c55e", "Reduce Routine Task Share", "Push to automate or delegate repetitive work and take on more judgment-based responsibilities."],
              ].map(([icon, color, title, text]) => (
                <div key={title as string} style={{ flex:"1 1 220px", minWidth:220, background: T.inputBg, borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ fontSize:20, marginBottom:8 }}>{icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color: color as string, marginBottom:6 }}>{title}</div>
                  <div style={{ fontSize:11, color: T.textSecondary, lineHeight:1.5 }}>{text}</div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </main>
    </div>
  );
}