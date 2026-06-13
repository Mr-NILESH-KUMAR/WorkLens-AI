"use client";
import { useState } from "react";
import Image from "next/image";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, LineChart, Line,
  Cell,
} from "recharts";

// ── DATA ─────────────────────────────────────────────────────────────────────
const industryOverview = [
  { industry: "Manufacturing", high: 48.2, medium: 31.5, low: 20.3, employees: 3200, aiAdoption: "Low",    color: "#ef4444" },
  { industry: "Logistics",     high: 41.5, medium: 35.2, low: 23.3, employees: 2800, aiAdoption: "Low",    color: "#f97316" },
  { industry: "Retail",        high: 40.7, medium: 33.1, low: 26.2, employees: 2500, aiAdoption: "Medium", color: "#f97316" },
  { industry: "Finance",       high: 37.7, medium: 34.8, low: 27.5, employees: 2200, aiAdoption: "High",   color: "#eab308" },
  { industry: "Telecom",       high: 35.2, medium: 36.0, low: 28.8, employees: 1800, aiAdoption: "Medium", color: "#eab308" },
  { industry: "IT",            high: 28.0, medium: 37.2, low: 34.8, employees: 3100, aiAdoption: "High",   color: "#22c55e" },
  { industry: "Healthcare",    high: 20.8, medium: 33.4, low: 45.8, employees: 2700, aiAdoption: "Medium", color: "#22c55e" },
  { industry: "Education",     high: 20.1, medium: 32.6, low: 47.3, employees: 1700, aiAdoption: "Low",    color: "#22c55e" },
];

const industryRadar = [
  { metric: "Routine Tasks",   Manufacturing: 85, Finance: 60, IT: 35, Healthcare: 40, Education: 45 },
  { metric: "AI Adoption",     Manufacturing: 30, Finance: 72, IT: 88, Healthcare: 55, Education: 38 },
  { metric: "Human Skills",    Manufacturing: 40, Finance: 58, IT: 62, Healthcare: 82, Education: 78 },
  { metric: "Creativity",      Manufacturing: 28, Finance: 54, IT: 70, Healthcare: 65, Education: 72 },
  { metric: "Training Hours",  Manufacturing: 35, Finance: 65, IT: 80, Healthcare: 60, Education: 55 },
  { metric: "AI Tools Used",   Manufacturing: 32, Finance: 70, IT: 90, Healthcare: 48, Education: 42 },
];

const trendData = [
  { month: "Jan", Manufacturing: 46, Finance: 36, IT: 26, Healthcare: 19 },
  { month: "Feb", Manufacturing: 47, Finance: 37, IT: 27, Healthcare: 20 },
  { month: "Mar", Manufacturing: 48, Finance: 36, IT: 28, Healthcare: 20 },
  { month: "Apr", Manufacturing: 47, Finance: 38, IT: 27, Healthcare: 21 },
  { month: "May", Manufacturing: 48, Finance: 38, IT: 28, Healthcare: 21 },
];

const industryMetrics = [
  { industry: "Manufacturing", avgAge: 38, avgExp: 8.2, avgTraining: 9.4,  aiUsage: 4.2, routinePct: 68 },
  { industry: "Logistics",     avgAge: 35, avgExp: 6.8, avgTraining: 10.1, aiUsage: 5.1, routinePct: 62 },
  { industry: "Retail",        avgAge: 32, avgExp: 5.4, avgTraining: 11.2, aiUsage: 5.8, routinePct: 57 },
  { industry: "Finance",       avgAge: 36, avgExp: 8.9, avgTraining: 14.6, aiUsage: 7.9, routinePct: 52 },
  { industry: "Telecom",       avgAge: 34, avgExp: 7.1, avgTraining: 12.8, aiUsage: 6.4, routinePct: 48 },
  { industry: "IT",            avgAge: 30, avgExp: 5.2, avgTraining: 18.2, aiUsage: 9.6, routinePct: 34 },
  { industry: "Healthcare",    avgAge: 39, avgExp: 9.8, avgTraining: 15.1, aiUsage: 6.1, routinePct: 38 },
  { industry: "Education",     avgAge: 41, avgExp: 11.2,avgTraining: 13.4, aiUsage: 5.2, routinePct: 36 },
];

const navItems = [
  { label: "Dashboard",              icon: "⊞" },
  { label: "Risk Analysis",          icon: "⚠" },
  { label: "Industry Insights",      icon: "🏭", active: true },
  { label: "Job Role Insights",      icon: "👤" },
  { label: "AI Adoption Analysis",   icon: "🤖" },
  { label: "Skills & Protection",    icon: "🛡" },
  { label: "Risk Predictor",         icon: "🔮", badge: "New" },
  { label: "Career Recommendations", icon: "🎯" },
  { label: "Reports",                icon: "📊" },
  { label: "About Dataset",          icon: "ℹ" },
];

const INDUSTRY_COLORS: Record<string, string> = {
  Manufacturing: "#ef4444",
  Finance:       "#eab308",
  IT:            "#6366f1",
  Healthcare:    "#22c55e",
};

// ── TOOLTIP ───────────────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#e2e8f0" }}>
      {label && <div style={{ marginBottom: 4, color: "#94a3b8" }}>{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color || "#e2e8f0" }}>{p.name}: {typeof p.value === "number" ? `${p.value}%` : p.value}</div>
      ))}
    </div>
  );
};

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function IndustryInsights() {
  const [activeNav, setActiveNav] = useState("Industry Insights");
  const [dark, setDark] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const bg            = dark ? "#0B0F19" : "#f1f5f9";
  const sidebar       = dark ? "#0d1220" : "#ffffff";
  const cardBg        = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";
  const cardBorder    = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.10)";
  const textPrimary   = dark ? "#e2e8f0" : "#0f172a";
  const textSecondary = dark ? "#94a3b8" : "#475569";
  const textMuted     = dark ? "#64748b" : "#94a3b8";
  const headerBg      = dark ? "#0d1220" : "#ffffff";
  const inputBg       = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const inputBorder   = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)";
  const gridLine      = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)";

  const T = { bg, sidebar, cardBg, cardBorder, textPrimary, textSecondary, textMuted, headerBg, inputBg, inputBorder, gridLine };

  // ── CARD COMPONENT ───────────────────────────────────────────────────────
  function Card({ title, children, style = {} }: { title?: string; children: React.ReactNode; style?: React.CSSProperties }) {
    const [hovered, setHovered] = useState(false);
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: T.cardBg,
          border: `1px solid ${hovered ? "rgba(99,102,241,0.4)" : T.cardBorder}`,
          borderRadius: 14, padding: 16,
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: "all 0.25s ease",
          boxShadow: hovered ? "0 8px 24px rgba(99,102,241,0.15)" : "none",
          ...style,
        }}
      >
        {title && (
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>
            {title}
          </div>
        )}
        {children}
      </div>
    );
  }

  // Selected industry data
  const selectedData = selectedIndustry
    ? industryOverview.find(d => d.industry === selectedIndustry)
    : null;
  const selectedMetrics = selectedIndustry
    ? industryMetrics.find(d => d.industry === selectedIndustry)
    : null;

  return (
    <div style={{ display: "flex", height: "100vh", background: bg, color: T.textPrimary, fontFamily: "Inter, Arial, sans-serif", overflow: "hidden", transition: "background 0.3s ease" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 210, background: T.sidebar, borderRight: `1px solid ${T.cardBorder}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
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
            const isActive = activeNav === item.label;
            return (
              <button key={item.label} onClick={() => setActiveNav(item.label)} style={{
                display: "flex", alignItems: "center", gap: 9, width: "100%",
                padding: "9px 10px", borderRadius: 9, border: "none", cursor: "pointer",
                background: isActive ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "transparent",
                color: isActive ? "#fff" : T.textMuted,
                fontSize: 12, fontWeight: isActive ? 600 : 400,
                marginBottom: 2, textAlign: "left",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.background = dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "#6366f1"; } }}
              onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = T.textMuted; } }}
              >
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && <span style={{ fontSize: 9, background: "#6366f1", color: "#fff", borderRadius: 4, padding: "1px 5px" }}>{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* Dataset Summary */}
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.cardBorder}` }}>
          <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Dataset Summary</div>
          {[["Total Records", "20,000"], ["Features", "16"], ["Last Updated", "May 29, 2024"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: T.textMuted }}>{k}</span>
              <span style={{ color: T.textPrimary, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, background: "linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
            <Image src="/logo.png" alt="logo" width={48} height={48} style={{ objectFit: "contain", marginBottom: 6 }} />
            <div style={{ fontSize: 10, color: "#a5b4fc", lineHeight: 1.4 }}>AI is transforming the future of work. Analyze. Adapt. Grow.</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", minWidth: 0 }}>

        {/* ── HEADER ── */}
        <header style={{ background: T.headerBg, borderBottom: `1px solid ${T.cardBorder}`, padding: "11px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: T.textPrimary, letterSpacing: 0.5 }}>INDUSTRY INSIGHTS</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>Sector-wise AI disruption risk breakdown and workforce analytics.</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 8, padding: "7px 12px", gap: 8, width: 180 }}>
            <span style={{ color: T.textMuted, fontSize: 13 }}>🔍</span>
            <span style={{ color: T.textMuted, fontSize: 12 }}>Search industries...</span>
          </div>

          <div style={{ background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 8, padding: "7px 12px", fontSize: 12, color: T.textSecondary, display: "flex", alignItems: "center", gap: 6 }}>
            All Industries <span>▾</span>
          </div>

          <button
            onClick={() => setDark(!dark)}
            style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", border: `1px solid ${T.inputBorder}`, borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 17 }}
          >
            {dark ? "🌙" : "☀️"}
          </button>

          <button style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"}
          >
            Export Report ↓
          </button>
        </header>

        {/* ── CONTENT ── */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── KPI SUMMARY ROW ── */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { icon: "🏭", label: "Industries Tracked", value: "8", sub: "Across all sectors", bg: "linear-gradient(135deg,#6366f1,#818cf8)" },
              { icon: "⚠️", label: "Highest Risk Sector", value: "Manufacturing", sub: "48.2% high risk", bg: "linear-gradient(135deg,#ef4444,#f87171)" },
              { icon: "🛡️", label: "Safest Sector", value: "Education", sub: "47.3% low risk", bg: "linear-gradient(135deg,#22c55e,#4ade80)" },
              { icon: "🤖", label: "Highest AI Adoption", value: "IT Sector", sub: "Avg 9.6 hrs/week", bg: "linear-gradient(135deg,#3b82f6,#60a5fa)" },
              { icon: "🎓", label: "Avg Training Gap", value: "9.4 – 18.2 hrs", sub: "Mfg vs IT disparity", bg: "linear-gradient(135deg,#a855f7,#c084fc)" },
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

          {/* ── ROW 1: MAIN BAR + TREND ── */}
          <div style={{ display: "flex", gap: 12 }}>

            {/* Stacked Risk by Industry */}
            <Card title="Layoff Risk Breakdown by Industry" style={{ flex: 2 }}>
              <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 8, display: "flex", gap: 16 }}>
                {[["#ef4444", "High Risk"], ["#f97316", "Medium Risk"], ["#22c55e", "Low Risk"]].map(([c, l]) => (
                  <span key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" }} />{l}
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={industryOverview} margin={{ right: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="industry" tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => `${v}%`} tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="low"    name="Low Risk"    stackId="a" fill="#22c55e" />
                  <Bar dataKey="medium" name="Medium Risk" stackId="a" fill="#f97316" />
                  <Bar dataKey="high"   name="High Risk"   stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 10, color: T.textMuted }}>💡 Click any bar to see industry details. Manufacturing leads in high-risk exposure.</div>
            </Card>

            {/* Risk Trend Over Months */}
            <Card title="High Risk Trend — Top 4 Industries" style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {Object.entries(INDUSTRY_COLORS).map(([name, color]) => (
                  <span key={name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />{name}
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={trendData} margin={{ right: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="month" tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => `${v}%`} tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 60]} />
                  <Tooltip content={<DarkTooltip />} />
                  {Object.entries(INDUSTRY_COLORS).map(([name, color]) => (
                    <Line key={name} type="monotone" dataKey={name} stroke={color} dot={false} strokeWidth={2} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 10, color: T.textMuted }}>💡 Manufacturing risk consistently elevated over all tracked months.</div>
            </Card>
          </div>

          {/* ── ROW 2: RADAR + INDUSTRY TABLE + DETAIL CARD ── */}
          <div style={{ display: "flex", gap: 12 }}>

            {/* Radar */}
            <Card title="Industry Capability Radar" style={{ flex: "0 0 300px" }}>
              <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {Object.entries(INDUSTRY_COLORS).map(([name, color]) => (
                  <span key={name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />{name}
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={industryRadar}>
                  <PolarGrid stroke={T.gridLine} />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: T.textMuted, fontSize: 9 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  {Object.entries(INDUSTRY_COLORS).map(([name, color]) => (
                    <Radar key={name} name={name} dataKey={name} stroke={color} fill={color} fillOpacity={0.08} strokeWidth={1.5} />
                  ))}
                  <Tooltip content={<DarkTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 10, color: T.textMuted }}>💡 IT sector leads in AI adoption & creativity scores.</div>
            </Card>

            {/* Industry Metrics Table */}
            <Card title="Industry Metrics Deep Dive" style={{ flex: 1 }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr>
                      {["Industry", "Avg Age", "Avg Exp (yrs)", "Training Hrs", "AI Usage (hrs/wk)", "Routine Tasks %", "Risk Level"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "6px 10px", color: T.textMuted, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.6, borderBottom: `1px solid ${T.cardBorder}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {industryMetrics.map((row, i) => {
                      const overview = industryOverview.find(d => d.industry === row.industry);
                      const riskColor = (overview?.high ?? 0) > 40 ? "#ef4444" : (overview?.high ?? 0) > 30 ? "#f97316" : "#22c55e";
                      const riskLabel = (overview?.high ?? 0) > 40 ? "High" : (overview?.high ?? 0) > 30 ? "Medium" : "Low";
                      const isSelected = selectedIndustry === row.industry;
                      return (
                        <tr
                          key={row.industry}
                          onClick={() => setSelectedIndustry(isSelected ? null : row.industry)}
                          style={{
                            background: isSelected ? (dark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.06)") : "transparent",
                            cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"; }}
                          onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                        >
                          <td style={{ padding: "8px 10px", color: T.textPrimary, fontWeight: 600, borderBottom: `1px solid ${T.cardBorder}` }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: riskColor, display: "inline-block", marginRight: 6 }} />
                            {row.industry}
                          </td>
                          <td style={{ padding: "8px 10px", color: T.textSecondary, borderBottom: `1px solid ${T.cardBorder}` }}>{row.avgAge}</td>
                          <td style={{ padding: "8px 10px", color: T.textSecondary, borderBottom: `1px solid ${T.cardBorder}` }}>{row.avgExp}</td>
                          <td style={{ padding: "8px 10px", color: T.textSecondary, borderBottom: `1px solid ${T.cardBorder}` }}>{row.avgTraining}</td>
                          <td style={{ padding: "8px 10px", color: T.textSecondary, borderBottom: `1px solid ${T.cardBorder}` }}>{row.aiUsage}</td>
                          <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T.cardBorder}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ flex: 1, background: T.inputBg, borderRadius: 4, height: 6 }}>
                                <div style={{ width: `${row.routinePct}%`, height: "100%", background: riskColor, borderRadius: 4 }} />
                              </div>
                              <span style={{ color: T.textSecondary, fontSize: 10, width: 28 }}>{row.routinePct}%</span>
                            </div>
                          </td>
                          <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T.cardBorder}` }}>
                            <span style={{ background: `${riskColor}22`, color: riskColor, padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700 }}>{riskLabel}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 10, color: T.textMuted, marginTop: 8 }}>💡 Click any row to see detailed industry breakdown.</div>
            </Card>
          </div>

          {/* ── SELECTED INDUSTRY DETAIL ── */}
          {selectedData && selectedMetrics && (
            <div style={{
              background: dark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.04)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 14, padding: 16,
              animation: "fadeIn 0.3s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: T.textPrimary }}>🏭 {selectedData.industry} — Detailed Snapshot</div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>Click the row again or another row to switch focus.</div>
                </div>
                <button
                  onClick={() => setSelectedIndustry(null)}
                  style={{ background: "transparent", border: `1px solid ${T.cardBorder}`, borderRadius: 8, padding: "4px 10px", color: T.textMuted, cursor: "pointer", fontSize: 11 }}
                >✕ Close</button>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[
                  ["High Risk", `${selectedData.high}%`, "#ef4444"],
                  ["Medium Risk", `${selectedData.medium}%`, "#f97316"],
                  ["Low Risk", `${selectedData.low}%`, "#22c55e"],
                  ["Avg Training", `${selectedMetrics.avgTraining} hrs`, "#a855f7"],
                  ["AI Usage", `${selectedMetrics.aiUsage} hrs/wk`, "#3b82f6"],
                  ["Routine Tasks", `${selectedMetrics.routinePct}%`, "#64748b"],
                  ["Avg Age", `${selectedMetrics.avgAge} yrs`, "#6366f1"],
                  ["Avg Experience", `${selectedMetrics.avgExp} yrs`, "#8b5cf6"],
                ].map(([label, value, color]) => (
                  <div key={label} style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "10px 16px", minWidth: 120 }}>
                    <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: color as string }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Mini risk bar */}
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 6 }}>Risk Distribution</div>
                <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 20 }}>
                  <div style={{ width: `${selectedData.low}%`, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 }}>{selectedData.low}%</div>
                  <div style={{ width: `${selectedData.medium}%`, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 }}>{selectedData.medium}%</div>
                  <div style={{ width: `${selectedData.high}%`, background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 }}>{selectedData.high}%</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: T.textMuted, marginTop: 4 }}>
                  <span>Low Risk</span><span>Medium Risk</span><span>High Risk</span>
                </div>
              </div>
            </div>
          )}

          {/* ── INSIGHTS ROW ── */}
          <div style={{ display: "flex", gap: 12 }}>
            <Card title="Key Industry Insights" style={{ flex: 1 }}>
              {[
                ["#ef4444", "⚠", "Manufacturing tops all industries at 48.2% high layoff risk — driven by automation of routine assembly tasks."],
                ["#f97316", "⚠", "Logistics and Retail follow closely, both above 40% — last-mile delivery and checkout automation are key drivers."],
                ["#eab308", "📊", "Finance sector shows 37.7% high risk despite high AI adoption — repetitive analysis tasks still dominate workflows."],
                ["#22c55e", "🛡", "Education and Healthcare show the lowest risk levels, protected by high human-interaction requirements."],
                ["#6366f1", "🤖", "IT sector has the highest AI training hours (18.2 hrs avg) and lowest routine task percentage (34%)."],
              ].map(([c, icon, text], i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 15, color: c as string, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.6 }}>{text}</span>
                </div>
              ))}
            </Card>

            <Card title="Recommendations by Sector" style={{ flex: 1 }}>
              {[
                ["Manufacturing", "#ef4444", "Invest in upskilling operators for AI-assisted production monitoring roles."],
                ["Logistics",     "#f97316", "Train dispatchers and warehouse staff on AI routing and inventory tools."],
                ["Finance",       "#eab308", "Shift analyst roles toward strategic advisory vs. data aggregation."],
                ["IT",            "#22c55e", "Expand AI tool usage across teams — already leading in low risk."],
                ["Healthcare",    "#22c55e", "Maintain focus on human-care skills; integrate AI diagnostic tools carefully."],
              ].map(([sector, color, rec]) => (
                <div key={sector} style={{ display: "flex", gap: 10, marginBottom: 10, padding: "8px 10px", background: T.inputBg, borderRadius: 8 }}>
                  <span style={{ fontSize: 10, background: `${color}22`, color: color as string, padding: "2px 8px", borderRadius: 6, fontWeight: 700, flexShrink: 0, alignSelf: "flex-start" }}>{sector}</span>
                  <span style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.5 }}>{rec}</span>
                </div>
              ))}
            </Card>

            {/* AI Adoption Level Summary */}
            <Card title="AI Adoption Level by Industry" style={{ flex: "0 0 220px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {industryOverview.map(d => (
                  <div key={d.industry} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: T.textSecondary, width: 100, flexShrink: 0 }}>{d.industry}</span>
                    <div style={{ flex: 1, background: T.inputBg, borderRadius: 4, height: 8 }}>
                      <div style={{
                        width: d.aiAdoption === "High" ? "80%" : d.aiAdoption === "Medium" ? "50%" : "25%",
                        height: "100%",
                        background: d.aiAdoption === "High" ? "#22c55e" : d.aiAdoption === "Medium" ? "#f97316" : "#ef4444",
                        borderRadius: 4, transition: "width 0.5s ease",
                      }} />
                    </div>
                    <span style={{
                      fontSize: 9, fontWeight: 700,
                      color: d.aiAdoption === "High" ? "#22c55e" : d.aiAdoption === "Medium" ? "#f97316" : "#ef4444",
                      width: 40,
                    }}>{d.aiAdoption}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, fontSize: 10, color: T.textMuted }}>💡 Low AI adoption = higher displacement risk.</div>
            </Card>
          </div>

        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}