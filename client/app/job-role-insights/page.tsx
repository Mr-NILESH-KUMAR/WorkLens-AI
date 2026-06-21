"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell,
} from "recharts";

// ── DATA (derived from aiimpactjobslayoffriskdataset.csv) ─────────────────────
// Per Job_Role: count, avg age/experience, training hrs, AI usage, routine %,
// creativity, human interaction, AI tools, and Layoff_Risk % breakdown.
const jobRoleData = [
  { role: "Operator",              count: 858, avgAge: 40.2, avgExp: 7.3, training: 13.6, aiUsage: 7.1, routine: 53.3, creativity: 46.7, humanInt: 57.3, aiTools: 2.6, high: 50.2, med: 28.9, low: 20.9 },
  { role: "Production Supervisor",  count: 806, avgAge: 41.0, avgExp: 7.6, training: 13.7, aiUsage: 7.2, routine: 52.9, creativity: 46.8, humanInt: 56.7, aiTools: 2.6, high: 48.3, med: 33.6, low: 18.1 },
  { role: "Quality Engineer",       count: 793, avgAge: 40.1, avgExp: 7.1, training: 12.4, aiUsage: 6.6, routine: 52.0, creativity: 48.0, humanInt: 57.6, aiTools: 2.3, high: 46.0, med: 34.7, low: 19.3 },
  { role: "Inventory Analyst",      count: 857, avgAge: 40.3, avgExp: 7.3, training: 12.5, aiUsage: 6.8, routine: 51.4, creativity: 48.4, humanInt: 55.6, aiTools: 2.4, high: 44.6, med: 33.7, low: 21.7 },
  { role: "Dispatcher",             count: 788, avgAge: 40.7, avgExp: 7.3, training: 12.6, aiUsage: 6.8, routine: 52.6, creativity: 46.8, humanInt: 55.9, aiTools: 2.5, high: 42.1, med: 34.4, low: 23.5 },
  { role: "Warehouse Manager",      count: 843, avgAge: 39.7, avgExp: 7.1, training: 12.4, aiUsage: 6.5, routine: 51.3, creativity: 48.6, humanInt: 57.8, aiTools: 2.4, high: 41.3, med: 32.9, low: 25.9 },
  { role: "Supply Chain Analyst",   count: 857, avgAge: 39.7, avgExp: 6.9, training: 12.4, aiUsage: 6.7, routine: 51.5, creativity: 48.3, humanInt: 58.1, aiTools: 2.5, high: 41.2, med: 33.3, low: 25.6 },
  { role: "Sales Associate",        count: 807, avgAge: 40.6, avgExp: 7.4, training: 11.8, aiUsage: 6.2, routine: 49.5, creativity: 49.9, humanInt: 57.6, aiTools: 2.3, high: 40.6, med: 36.6, low: 22.8 },
  { role: "Accountant",             count: 821, avgAge: 40.6, avgExp: 7.4, training: 13.5, aiUsage: 7.2, routine: 53.5, creativity: 46.8, humanInt: 56.2, aiTools: 2.6, high: 39.6, med: 33.5, low: 26.9 },
  { role: "Auditor",                count: 813, avgAge: 41.1, avgExp: 7.2, training: 12.3, aiUsage: 6.5, routine: 52.5, creativity: 47.2, humanInt: 55.6, aiTools: 2.4, high: 37.4, med: 35.5, low: 27.1 },
  { role: "Network Engineer",       count: 862, avgAge: 40.2, avgExp: 7.2, training: 12.2, aiUsage: 6.7, routine: 52.0, creativity: 47.8, humanInt: 55.0, aiTools: 2.4, high: 37.1, med: 32.8, low: 30.0 },
  { role: "Store Manager",          count: 803, avgAge: 41.1, avgExp: 7.6, training: 11.9, aiUsage: 6.4, routine: 50.7, creativity: 49.5, humanInt: 82.3, aiTools: 2.4, high: 36.7, med: 32.4, low: 30.9 },
  { role: "Financial Analyst",      count: 879, avgAge: 40.3, avgExp: 7.0, training: 12.6, aiUsage: 6.8, routine: 51.4, creativity: 47.9, humanInt: 57.5, aiTools: 2.4, high: 36.3, med: 35.8, low: 27.9 },
  { role: "Support Specialist",     count: 873, avgAge: 39.9, avgExp: 7.1, training: 12.2, aiUsage: 6.7, routine: 51.1, creativity: 48.0, humanInt: 57.2, aiTools: 2.3, high: 35.1, med: 31.0, low: 33.9 },
  { role: "Operations Analyst",     count: 847, avgAge: 40.2, avgExp: 7.0, training: 12.2, aiUsage: 6.7, routine: 50.7, creativity: 49.1, humanInt: 57.9, aiTools: 2.4, high: 33.3, med: 31.9, low: 34.8 },
  { role: "Data Analyst",           count: 849, avgAge: 40.7, avgExp: 7.5, training: 13.5, aiUsage: 7.1, routine: 52.1, creativity: 47.5, humanInt: 57.3, aiTools: 2.6, high: 28.3, med: 33.3, low: 38.4 },
  { role: "Software Engineer",      count: 829, avgAge: 41.0, avgExp: 7.3, training: 12.8, aiUsage: 6.7, routine: 52.5, creativity: 47.1, humanInt: 57.5, aiTools: 2.4, high: 28.1, med: 34.9, low: 37.0 },
  { role: "ML Engineer",            count: 805, avgAge: 39.9, avgExp: 7.3, training: 13.1, aiUsage: 7.0, routine: 52.4, creativity: 47.4, humanInt: 58.6, aiTools: 2.5, high: 27.5, med: 33.4, low: 39.1 },
  { role: "Medical Assistant",      count: 889, avgAge: 39.9, avgExp: 7.3, training: 12.8, aiUsage: 6.9, routine: 51.9, creativity: 47.4, humanInt: 56.3, aiTools: 2.5, high: 24.5, med: 31.6, low: 43.9 },
  { role: "Academic Coordinator",   count: 819, avgAge: 40.8, avgExp: 7.4, training: 12.9, aiUsage: 7.0, routine: 53.3, creativity: 46.0, humanInt: 56.9, aiTools: 2.5, high: 22.8, med: 32.2, low: 44.9 },
  { role: "Health Analyst",         count: 772, avgAge: 40.1, avgExp: 7.3, training: 12.5, aiUsage: 6.7, routine: 51.8, creativity: 47.8, humanInt: 55.2, aiTools: 2.5, high: 21.2, med: 34.2, low: 44.6 },
  { role: "Research Assistant",     count: 818, avgAge: 39.9, avgExp: 7.3, training: 12.7, aiUsage: 6.8, routine: 52.9, creativity: 47.1, humanInt: 56.8, aiTools: 2.5, high: 21.0, med: 32.2, low: 46.8 },
  { role: "Nurse",                  count: 900, avgAge: 40.4, avgExp: 7.4, training: 12.1, aiUsage: 6.6, routine: 50.3, creativity: 49.3, humanInt: 81.9, aiTools: 2.4, high: 16.7, med: 30.0, low: 53.3 },
  { role: "Teacher",                count: 812, avgAge: 40.5, avgExp: 7.1, training: 12.4, aiUsage: 6.9, routine: 51.7, creativity: 47.7, humanInt: 81.9, aiTools: 2.6, high: 16.4, med: 30.0, low: 53.6 },
];

// Sorted by high-risk % for ranking views
const sortedByRisk = [...jobRoleData].sort((a, b) => b.high - a.high);

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
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}{typeof p.value === "number" && p.unit !== "" ? p.unit ?? "%" : ""}</div>
      ))}
    </div>
  );
};

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function JobRoleInsights() {
  const [dark, setDark] = useState(true);
  const [selectedRole, setSelectedRole] = useState("Operator");
  const [search, setSearch] = useState("");
  const pathname = usePathname();

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
  const totalRoles = jobRoleData.length;
  const highestRiskRole = sortedByRisk[0];
  const safestRole = sortedByRisk[sortedByRisk.length - 1];
  const avgTraining = (jobRoleData.reduce((s, r) => s + r.training, 0) / totalRoles).toFixed(1);
  const avgAiUsage = (jobRoleData.reduce((s, r) => s + r.aiUsage, 0) / totalRoles).toFixed(1);

  const filteredRoles = jobRoleData.filter(r =>
    r.role.toLowerCase().includes(search.toLowerCase())
  );

  const top10HighRisk = sortedByRisk.slice(0, 10).map(r => ({ role: r.role, pct: r.high }));
  const top10LowRisk = [...jobRoleData].sort((a, b) => b.low - a.low).slice(0, 10).map(r => ({ role: r.role, pct: r.low }));

  const current = jobRoleData.find(r => r.role === selectedRole) ?? jobRoleData[0];

  const riskPie = [
    { name: "High Risk",   value: current.high, color: "#ef4444" },
    { name: "Medium Risk", value: current.med,  color: "#f97316" },
    { name: "Low Risk",    value: current.low,  color: "#22c55e" },
  ];

  // Radar profile normalized to 0-100 scale (most fields already are)
  const radarData = [
    { metric: "Routine Tasks", value: current.routine },
    { metric: "Creativity", value: current.creativity },
    { metric: "Human Interaction", value: Math.min(current.humanInt, 100) },
    { metric: "AI Usage (x10)", value: Math.min(current.aiUsage * 10, 100) },
    { metric: "Training (x6)", value: Math.min(current.training * 6, 100) },
    { metric: "AI Tools (x25)", value: Math.min(current.aiTools * 25, 100) },
  ];

  function riskColor(pct: number) {
    if (pct >= 40) return "#ef4444";
    if (pct >= 25) return "#f97316";
    return "#22c55e";
  }
  function riskLabel(pct: number) {
    if (pct >= 40) return "High";
    if (pct >= 25) return "Medium";
    return "Low";
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
            <div style={{ fontSize:17, fontWeight:800, color: T.textPrimary, letterSpacing:0.5 }}>JOB ROLE INSIGHTS</div>
            <div style={{ fontSize:11, color: T.textMuted }}>Role-wise AI disruption risk breakdown and workforce profile.</div>
          </div>

          {/* Search */}
          <div style={{ display:"flex", alignItems:"center", background: T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"7px 12px", gap:8, width:200 }}>
            <span style={{ color: T.textMuted, fontSize:13 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search job roles..."
              style={{ background:"transparent", border:"none", outline:"none", color: T.textPrimary, fontSize:12, width:"100%" }}
            />
          </div>

          {/* Job Role selector */}
          <div style={{ background: T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"0 12px", fontSize:12, color: T.textSecondary, display:"flex", alignItems:"center", gap:6 }}>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              style={{ background:"transparent", border:"none", outline:"none", color: T.textSecondary, fontSize:12, padding:"7px 0", cursor:"pointer" }}
            >
              {jobRoleData.map(r => (
                <option key={r.role} value={r.role} style={{ color:"#0f172a" }}>{r.role}</option>
              ))}
            </select>
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
            <KpiCard icon="👤" iconBg="linear-gradient(135deg,#6366f1,#818cf8)" label="Job Roles Tracked" value={totalRoles} sub="Across all industries" />
            <KpiCard icon="⚠️" iconBg="linear-gradient(135deg,#ef4444,#f87171)" label="Highest Risk Role" value={highestRiskRole.role} sub={`${highestRiskRole.high}% high risk`} />
            <KpiCard icon="🛡️" iconBg="linear-gradient(135deg,#22c55e,#4ade80)" label="Safest Role" value={safestRole.role} sub={`${safestRole.low}% low risk`} />
            <KpiCard icon="🎓" iconBg="linear-gradient(135deg,#a855f7,#c084fc)" label="Avg AI Training" value={`${avgTraining} hrs`} sub="Across all roles" />
            <KpiCard icon="🤖" iconBg="linear-gradient(135deg,#3b82f6,#60a5fa)" label="Avg AI Usage" value={`${avgAiUsage} hrs/wk`} sub="Across all roles" />
          </div>

          {/* ── ROW 1: CHARTS ── */}
          <div style={{ display:"flex", gap:12, minHeight:300 }}>

            {/* Top 10 High Risk */}
            <Card title="Top 10 Job Roles — High Risk" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={top10HighRisk} layout="vertical" margin={{ left:10, right:30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} horizontal={false} />
                  <XAxis type="number" domain={[0,60]} tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="role" tick={{ fill: T.textSecondary, fontSize:10 }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="pct" name="High Risk %" fill="#ef4444" radius={[0,4,4,0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted, marginTop:6 }}>⚠ Manual, routine-heavy roles dominate the high-risk list.</div>
            </Card>

            {/* Top 10 Low Risk */}
            <Card title="Top 10 Job Roles — Low Risk" hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={top10LowRisk} layout="vertical" margin={{ left:10, right:30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} horizontal={false} />
                  <XAxis type="number" domain={[0,60]} tickFormatter={v=>`${v}%`} tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="role" tick={{ fill: T.textSecondary, fontSize:10 }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="pct" name="Low Risk %" fill="#22c55e" radius={[0,4,4,0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted, marginTop:6 }}>🛡 Roles centered on care, teaching & research show strongest protection.</div>
            </Card>
          </div>

          {/* ── ROW 2: ROLE PROFILE ── */}
          <div style={{ display:"flex", gap:12, minHeight:300 }}>

            {/* Risk Donut for selected role */}
            <Card title={`Risk Profile — ${current.role}`} hoverable style={{ flex:"0 0 260px" }}>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={riskPie} cx="50%" cy="50%" innerRadius={50} outerRadius={78} dataKey="value" startAngle={90} endAngle={-270}>
                    {riskPie.map((e,i)=><Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position:"relative", marginTop:-100, textAlign:"center", pointerEvents:"none" }}>
                <div style={{ fontSize:15, fontWeight:700, color: riskColor(current.high) }}>{riskLabel(current.high)}</div>
                <div style={{ fontSize:9, color: T.textMuted }}>Dominant Risk</div>
              </div>
              <div style={{ marginTop:64, display:"flex", flexDirection:"column", gap:5 }}>
                {riskPie.map(d=>(
                  <div key={d.name} style={{ display:"flex", alignItems:"center", gap:8, fontSize:11 }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background:d.color, display:"inline-block", flexShrink:0 }} />
                    <span style={{ color:d.color, fontWeight:600 }}>{d.name}</span>
                    <span style={{ color: T.textMuted, marginLeft:"auto" }}>{d.value}%</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:8, fontSize:10, color: T.textMuted, borderTop:`1px solid ${T.cardBorder}`, paddingTop:8 }}>
                👥 {current.count.toLocaleString()} employees in this role across the dataset.
              </div>
            </Card>

            {/* Radar profile */}
            <Card title={`Workforce Profile — ${current.role}`} hoverable style={{ flex:1 }}>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={T.gridLine} />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: T.textSecondary, fontSize:10 }} />
                  <PolarRadiusAxis domain={[0,100]} tick={{ fill: T.textMuted, fontSize:9 }} axisLine={false} />
                  <Radar name={current.role} dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
                  <Tooltip content={<DarkTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:10, color: T.textMuted, marginTop:4 }}>
                💡 Scaled radar combining routine load, creativity, human interaction, AI usage, training and tooling.
              </div>
            </Card>

            {/* Key stats */}
            <Card title="Role Metrics" hoverable style={{ flex:"0 0 220px" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  ["Avg Age", `${current.avgAge} yrs`],
                  ["Avg Experience", `${current.avgExp} yrs`],
                  ["AI Training Hours", `${current.training} hrs`],
                  ["AI Usage / Week", `${current.aiUsage} hrs`],
                  ["Routine Task %", `${current.routine}%`],
                  ["Creativity Score", `${current.creativity}%`],
                  ["Human Interaction", `${current.humanInt}%`],
                  ["Avg AI Tools Used", `${current.aiTools}`],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:11 }}>
                    <span style={{ color: T.textMuted }}>{k}</span>
                    <span style={{ color: T.textPrimary, fontWeight:600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:10, fontSize:10, color: T.textMuted, borderTop:`1px solid ${T.cardBorder}`, paddingTop:8 }}>
                Select a different role from the dropdown above to update this profile.
              </div>
            </Card>
          </div>

          {/* ── ROW 3: FULL TABLE ── */}
          <Card title="All Job Roles — Detailed Breakdown" hoverable>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                <thead>
                  <tr>
                    {["Job Role","Employees","Avg Age","Avg Exp (yrs)","Training Hrs","AI Usage (hrs/wk)","Routine %","High","Medium","Low","Risk Level"].map(h => (
                      <th key={h} style={{ textAlign: h==="Job Role" ? "left" : "right", padding:"8px 10px", color: T.textMuted, fontWeight:600, textTransform:"uppercase", fontSize:10, letterSpacing:0.5, borderBottom:`1px solid ${T.cardBorder}`, whiteSpace:"nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles
                    .slice()
                    .sort((a,b) => b.high - a.high)
                    .map(r => (
                    <tr key={r.role}
                      onClick={() => setSelectedRole(r.role)}
                      style={{ cursor:"pointer", transition:"background 0.15s", background: r.role === selectedRole ? (dark ? "rgba(99,102,241,0.10)" : "rgba(99,102,241,0.08)") : "transparent" }}
                      onMouseEnter={e => { if (r.role !== selectedRole) e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"; }}
                      onMouseLeave={e => { if (r.role !== selectedRole) e.currentTarget.style.background = "transparent"; }}
                    >
                      <td style={{ padding:"7px 10px", color: T.textPrimary, fontWeight:600, borderBottom:`1px solid ${T.cardBorder}` }}>{r.role}</td>
                      <td style={{ padding:"7px 10px", textAlign:"right", color: T.textSecondary, borderBottom:`1px solid ${T.cardBorder}` }}>{r.count.toLocaleString()}</td>
                      <td style={{ padding:"7px 10px", textAlign:"right", color: T.textSecondary, borderBottom:`1px solid ${T.cardBorder}` }}>{r.avgAge}</td>
                      <td style={{ padding:"7px 10px", textAlign:"right", color: T.textSecondary, borderBottom:`1px solid ${T.cardBorder}` }}>{r.avgExp}</td>
                      <td style={{ padding:"7px 10px", textAlign:"right", color: T.textSecondary, borderBottom:`1px solid ${T.cardBorder}` }}>{r.training}</td>
                      <td style={{ padding:"7px 10px", textAlign:"right", color: T.textSecondary, borderBottom:`1px solid ${T.cardBorder}` }}>{r.aiUsage}</td>
                      <td style={{ padding:"7px 10px", textAlign:"right", color: T.textSecondary, borderBottom:`1px solid ${T.cardBorder}` }}>{r.routine}%</td>
                      <td style={{ padding:"7px 10px", textAlign:"right", color:"#ef4444", borderBottom:`1px solid ${T.cardBorder}` }}>{r.high}%</td>
                      <td style={{ padding:"7px 10px", textAlign:"right", color:"#f97316", borderBottom:`1px solid ${T.cardBorder}` }}>{r.med}%</td>
                      <td style={{ padding:"7px 10px", textAlign:"right", color:"#22c55e", borderBottom:`1px solid ${T.cardBorder}` }}>{r.low}%</td>
                      <td style={{ padding:"7px 10px", textAlign:"right", borderBottom:`1px solid ${T.cardBorder}` }}>
                        <span style={{ background: `${riskColor(r.high)}22`, color: riskColor(r.high), borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700 }}>
                          {riskLabel(r.high)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRoles.length === 0 && (
                <div style={{ textAlign:"center", padding:"20px 0", color: T.textMuted, fontSize:12 }}>No job roles match "{search}".</div>
              )}
            </div>
            <div style={{ fontSize:10, color: T.textMuted, marginTop:10 }}>💡 Click any row to update the role profile above. Sorted by High Risk % descending.</div>
          </Card>

        </div>
      </main>
    </div>
  );
}