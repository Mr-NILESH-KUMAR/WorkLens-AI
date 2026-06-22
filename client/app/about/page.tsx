"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// ── NAV ──────────────────────────────────────────────────────────────────────
const navItems = [
  { label: "Dashboard",              icon: "⊞",  href: "/" },
  { label: "Risk Analysis",          icon: "⚠",  href: "/risk-analysis" },
  { label: "Industry Insights",      icon: "🏭", href: "/industry-insights" },
  { label: "Job Role Insights",      icon: "👤", href: "/job-role-insights" },
  { label: "AI Adoption Analysis",   icon: "🤖", href: "/ai-adoption-analysis" },
  { label: "Skills & Protection",    icon: "🛡",  href: "/skills-protection" },
  { label: "Risk Predictor",         icon: "🔮", href: "/risk-predictor", badge: "New" },
  { label: "Career Recommendations", icon: "🎯", href: "/career-recommendations" },
  { label: "Reports",                icon: "📊", href: "/reports" },
  { label: "About Dataset",          icon: "ℹ",  href: "/about" },
];

// ── DATASET COLUMN DEFINITIONS ───────────────────────────────────────────────
const columns = [
  { name: "Age",                       type: "Integer",  category: "Numeric",       example: "28",              desc: "Employee age in years" },
  { name: "Education_Level",           type: "String",   category: "Categorical",   example: "Bachelor's",      desc: "Highest education attained" },
  { name: "Years_of_Experience",       type: "Integer",  category: "Numeric",       example: "5",               desc: "Total years of professional experience" },
  { name: "Industry",                  type: "String",   category: "Categorical",   example: "Finance",         desc: "Sector the employee works in" },
  { name: "Job_Role",                  type: "String",   category: "Categorical",   example: "Accountant",      desc: "Specific job title / role" },
  { name: "Company_Size",              type: "String",   category: "Categorical",   example: "Large",           desc: "Size category of the employer" },
  { name: "Job_Level",                 type: "String",   category: "Categorical",   example: "Mid",             desc: "Seniority level within the org" },
  { name: "Routine_Task_Percentage",   type: "Integer",  category: "Numeric",       example: "62",              desc: "% of daily tasks that are repetitive" },
  { name: "Creativity_Requirement",    type: "Integer",  category: "Numeric",       example: "35",              desc: "Creative thinking demand (0–100)" },
  { name: "Human_Interaction_Level",   type: "Integer",  category: "Numeric",       example: "58",              desc: "Degree of human collaboration required" },
  { name: "AI_Adoption_Level",         type: "String",   category: "Categorical",   example: "High",            desc: "Level of AI tools usage at company" },
  { name: "Number_of_AI_Tools_Used",   type: "Integer",  category: "Numeric",       example: "3",               desc: "Count of AI tools actively used" },
  { name: "AI_Usage_Hours_Per_Week",   type: "Integer",  category: "Numeric",       example: "8",               desc: "Weekly hours spent working with AI" },
  { name: "Tasks_Automated_Percentage",type: "Integer",  category: "Numeric",       example: "45",              desc: "% of tasks already automated by AI" },
  { name: "AI_Training_Hours",         type: "Integer",  category: "Numeric",       example: "12",              desc: "Total AI upskilling hours completed" },
  { name: "Layoff_Risk",               type: "String",   category: "Target",        example: "High",            desc: "Predicted risk level: High / Medium / Low" },
];

// ── CHART DATA ────────────────────────────────────────────────────────────────
const industryDist = [
  { name: "Manufacturing", count: 2840 },
  { name: "IT",            count: 2620 },
  { name: "Finance",       count: 2510 },
  { name: "Healthcare",    count: 2380 },
  { name: "Education",     count: 2250 },
  { name: "Retail",        count: 2140 },
  { name: "Logistics",     count: 2080 },
  { name: "Telecom",       count: 1180 },
];

const riskDist = [
  { name: "High Risk",   value: 6797, pct: 34.0, color: "#ef4444" },
  { name: "Medium Risk", value: 6601, pct: 33.0, color: "#f97316" },
  { name: "Low Risk",    value: 6602, pct: 33.0, color: "#22c55e" },
];

const educationDist = [
  { name: "Bachelor's",   count: 7820 },
  { name: "Master's",     count: 5310 },
  { name: "High School",  count: 3960 },
  { name: "PhD",          count: 2910 },
];

const jobLevelDist = [
  { name: "Entry",  count: 5120 },
  { name: "Mid",    count: 6840 },
  { name: "Senior", count: 5240 },
  { name: "Lead",   count: 2800 },
];

const numericStats = [
  { feature: "Age",                        min: 22,  max: 65,  mean: "41.3", std: "12.1" },
  { feature: "Years of Experience",        min: 0,   max: 40,  mean: "10.8", std: "8.4"  },
  { feature: "Routine Task %",             min: 0,   max: 100, mean: "50.2", std: "28.9" },
  { feature: "Creativity Requirement",     min: 0,   max: 100, mean: "49.8", std: "29.0" },
  { feature: "Human Interaction Level",    min: 0,   max: 100, mean: "49.9", std: "28.8" },
  { feature: "# AI Tools Used",            min: 0,   max: 10,  mean: "2.5",  std: "2.9"  },
  { feature: "AI Usage Hrs/Week",          min: 0,   max: 20,  mean: "6.8",  std: "5.8"  },
  { feature: "Tasks Automated %",          min: 0,   max: 100, mean: "49.8", std: "29.1" },
  { feature: "AI Training Hours",          min: 0,   max: 50,  mean: "12.6", std: "14.5" },
];

const modelPerfRows = [
  { cls: "High Risk",   precision: "93%", recall: "91%", f1: "92%", support: "6,797" },
  { cls: "Medium Risk", precision: "91%", recall: "92%", f1: "91%", support: "6,601" },
  { cls: "Low Risk",    precision: "92%", recall: "93%", f1: "92%", support: "6,602" },
];

// ── DARK TOOLTIP ─────────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#e2e8f0" }}>
      {label && <div style={{ marginBottom:4, color:"#94a3b8" }}>{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color ?? "#e2e8f0" }}>{p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}</div>
      ))}
    </div>
  );
};

// ── BADGE ─────────────────────────────────────────────────────────────────────
function Badge({ type }: { type: string }) {
  const cfg: Record<string, { bg: string; color: string }> = {
    Numeric:     { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
    Categorical: { bg: "rgba(168,85,247,0.15)",  color: "#c084fc" },
    Target:      { bg: "rgba(34,197,94,0.15)",   color: "#4ade80" },
    Integer:     { bg: "rgba(99,102,241,0.12)",  color: "#818cf8" },
    String:      { bg: "rgba(245,158,11,0.12)",  color: "#fbbf24" },
  };
  const c = cfg[type] ?? { bg: "rgba(255,255,255,0.08)", color: "#94a3b8" };
  return (
    <span style={{ fontSize:10, fontWeight:600, background: c.bg, color: c.color, borderRadius:5, padding:"2px 7px", whiteSpace:"nowrap" }}>
      {type}
    </span>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function AboutDataset() {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview"|"columns"|"stats"|"model">("overview");

  const bg          = dark ? "#0B0F19" : "#f1f5f9";
  const sidebar     = dark ? "#0d1220" : "#ffffff";
  const cardBg      = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";
  const cardBorder  = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.10)";
  const textPrimary = dark ? "#e2e8f0" : "#0f172a";
  const textSecond  = dark ? "#94a3b8" : "#475569";
  const textMuted   = dark ? "#64748b" : "#94a3b8";
  const headerBg    = dark ? "#0d1220" : "#ffffff";
  const inputBg     = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const inputBorder = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)";
  const gridLine    = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)";
  const rowAlt      = dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";

  const T = { bg, sidebar, cardBg, cardBorder, textPrimary, textSecond, textMuted, headerBg, inputBg, inputBorder, gridLine, rowAlt };

  // ── CARD COMPONENT ──
  function Card({ title, children, style = {}, hoverable = false }: any) {
    const [hov, setHov] = useState(false);
    return (
      <div
        onMouseEnter={() => hoverable && setHov(true)}
        onMouseLeave={() => hoverable && setHov(false)}
        style={{
          background: T.cardBg,
          border: `1px solid ${hov ? "rgba(99,102,241,0.4)" : T.cardBorder}`,
          borderRadius: 14, padding: 16,
          transform: hov ? "translateY(-3px)" : "translateY(0)",
          transition: "all 0.25s ease",
          boxShadow: hov ? "0 8px 24px rgba(99,102,241,0.15)" : "none",
          ...style,
        }}
      >
        {title && (
          <div style={{ fontSize:12, fontWeight:700, color: T.textPrimary, marginBottom:12, textTransform:"uppercase", letterSpacing:0.8 }}>
            {title}
          </div>
        )}
        {children}
      </div>
    );
  }

  // ── STAT PILL ──
  function StatPill({ label, value, color = "#6366f1" }: any) {
    return (
      <div style={{ background: T.inputBg, border:`1px solid ${T.cardBorder}`, borderRadius:10, padding:"10px 14px", display:"flex", flexDirection:"column", gap:4, flex:1, minWidth:110 }}>
        <span style={{ fontSize:9, color: T.textMuted, textTransform:"uppercase", letterSpacing:1 }}>{label}</span>
        <span style={{ fontSize:18, fontWeight:700, color }}>{value}</span>
      </div>
    );
  }

  // ── TABS ──
  const tabs: { id: typeof activeTab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview",      icon: "📋" },
    { id: "columns",  label: "Columns",       icon: "📐" },
    { id: "stats",    label: "Statistics",    icon: "📊" },
    { id: "model",    label: "Model Info",    icon: "🤖" },
  ];

  return (
    <div style={{ display:"flex", height:"100vh", background: T.bg, color: T.textPrimary, fontFamily:"Inter, Arial, sans-serif", overflow:"hidden", transition:"background 0.3s ease" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width:210, background: T.sidebar, borderRight:`1px solid ${T.cardBorder}`, display:"flex", flexDirection:"column", flexShrink:0, transition:"background 0.3s ease" }}>

        {/* Logo */}
        <div style={{ padding:"16px 14px 12px", borderBottom:`1px solid ${T.cardBorder}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Image src="/logo-icon.png" alt="Worklens AI Logo" width={40} height={40} style={{ objectFit:"contain" }} />
            <div>
              <div style={{ fontSize:13, fontWeight:800, background:"linear-gradient(90deg,#6366f1,#a855f7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Worklens AI</div>
              <div style={{ fontSize:9, color: T.textMuted, lineHeight:1.3 }}>Workforce Risk Analytics</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href} style={{
                display:"flex", alignItems:"center", gap:9, width:"100%",
                padding:"9px 10px", borderRadius:9, cursor:"pointer",
                background: isActive ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "transparent",
                color: isActive ? "#fff" : T.textMuted,
                fontSize:12, fontWeight: isActive ? 600 : 400,
                marginBottom:2, textDecoration:"none",
                transition:"all 0.15s ease",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.08)"; e.currentTarget.style.color = "#6366f1"; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMuted; } }}
              >
                <span style={{ fontSize:15 }}>{item.icon}</span>
                <span style={{ flex:1 }}>{item.label}</span>
                {item.badge && <span style={{ fontSize:9, background:"#6366f1", color:"#fff", borderRadius:4, padding:"1px 5px" }}>{item.badge}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Dataset Summary */}
        <div style={{ padding:"12px 14px", borderTop:`1px solid ${T.cardBorder}` }}>
          <div style={{ fontSize:10, color:"#6366f1", fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Dataset Summary</div>
          {[["Total Records","20,000"],["Features","16"],["Last Updated","May 29, 2024"]].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
              <span style={{ color: T.textMuted }}>{k}</span>
              <span style={{ color: T.textPrimary, fontWeight:600 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:14 }}>
            <Image src="/logo.png" alt="logo" width={210} height={80} style={{ objectFit:"contain", width:"100%", height:"auto", marginBottom:8, display:"block", borderRadius:14 }} />
            <div style={{ background:"linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius:10, padding:"12px 10px", textAlign:"center" }}>
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
            <div style={{ fontSize:17, fontWeight:800, color: T.textPrimary, letterSpacing:0.5 }}>AI JOB IMPACT ANALYTICS PLATFORM</div>
            <div style={{ fontSize:11, color: T.textMuted }}>AI-Powered Workforce Risk & Career Analytics Platform.</div>
          </div>

          <div style={{ display:"flex", alignItems:"center", background: T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"7px 12px", gap:8, width:180 }}>
            <span style={{ color: T.textMuted, fontSize:13 }}>🔍</span>
            <span style={{ color: T.textMuted, fontSize:12 }}>Search anything...</span>
          </div>

          <button
            onClick={() => setDark(!dark)}
            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", border:`1px solid ${T.inputBorder}`, borderRadius:8, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:17, transition:"all 0.2s" }}
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

        {/* ── PAGE BODY ── */}
        <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:16, flex:1 }}>

          {/* ── PAGE TITLE BANNER ── */}
          <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.08))", border:`1px solid rgba(99,102,241,0.25)`, borderRadius:14, padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20 }}>
            <div>
              <div style={{ fontSize:20, fontWeight:800, color: T.textPrimary, marginBottom:4 }}>
                ℹ️ About the Dataset
              </div>
              <div style={{ fontSize:12, color: T.textSecond, maxWidth:580, lineHeight:1.6 }}>
                The <span style={{ color:"#a78bfa", fontWeight:600 }}>AI Impact on Jobs & Layoff Risk</span> dataset contains 20,000 employee records with 15 features and a target variable capturing layoff risk level. It was built to study how AI adoption, automation, and skill profiles drive workforce displacement across industries.
              </div>
            </div>
            <div style={{ display:"flex", gap:10, flexShrink:0, flexWrap:"wrap" }}>
              <StatPill label="Total Records"  value="20,000" color="#818cf8" />
              <StatPill label="Features"       value="15"     color="#c084fc" />
              <StatPill label="Target Classes" value="3"      color="#4ade80" />
              <StatPill label="Model Accuracy" value="92%+"   color="#f97316" />
            </div>
          </div>

          {/* ── TABS ── */}
          <div style={{ display:"flex", gap:6, background: T.inputBg, border:`1px solid ${T.cardBorder}`, borderRadius:10, padding:5, width:"fit-content" }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "transparent",
                  border: "none", borderRadius:7, padding:"7px 16px",
                  color: activeTab === tab.id ? "#fff" : T.textMuted,
                  fontSize:12, fontWeight: activeTab === tab.id ? 600 : 400,
                  cursor:"pointer", display:"flex", alignItems:"center", gap:6,
                  transition:"all 0.2s ease",
                  boxShadow: activeTab === tab.id ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
                }}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* ── TAB: OVERVIEW ── */}
          {activeTab === "overview" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

              {/* Row 1: two charts + quick facts */}
              <div style={{ display:"flex", gap:14 }}>

                {/* Risk Distribution Donut */}
                <Card title="Target: Layoff Risk Distribution" hoverable style={{ flex:"0 0 260px" }}>
                  <ResponsiveContainer width="100%" height={190}>
                    <PieChart>
                      <Pie data={riskDist} cx="50%" cy="50%" innerRadius={54} outerRadius={82} dataKey="value" startAngle={90} endAngle={-270}>
                        {riskDist.map((e,i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip content={<DarkTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position:"relative", marginTop:-105, textAlign:"center", pointerEvents:"none" }}>
                    <div style={{ fontSize:17, fontWeight:700, color: T.textPrimary }}>20,000</div>
                    <div style={{ fontSize:10, color: T.textMuted }}>Total</div>
                  </div>
                  <div style={{ marginTop:74, display:"flex", flexDirection:"column", gap:5 }}>
                    {riskDist.map(d => (
                      <div key={d.name} style={{ display:"flex", alignItems:"center", gap:8, fontSize:11 }}>
                        <span style={{ width:8, height:8, borderRadius:"50%", background:d.color, display:"inline-block", flexShrink:0 }} />
                        <span style={{ color:d.color, fontWeight:600 }}>{d.name}</span>
                        <span style={{ color: T.textMuted, marginLeft:"auto" }}>{d.value.toLocaleString()} ({d.pct}%)</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:8, fontSize:10, color: T.textMuted, borderTop:`1px solid ${T.cardBorder}`, paddingTop:8 }}>
                    ✅ Balanced dataset — nearly equal class distribution.
                  </div>
                </Card>

                {/* Industry Distribution Bar */}
                <Card title="Records by Industry" hoverable style={{ flex:1 }}>
                  <ResponsiveContainer width="100%" height={230}>
                    <BarChart data={industryDist} layout="vertical" margin={{ left:10, right:30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} horizontal={false} />
                      <XAxis type="number" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fill: T.textSecond, fontSize:11 }} axisLine={false} tickLine={false} width={90} />
                      <Tooltip content={<DarkTooltip />} />
                      <Bar dataKey="count" name="Records" fill="#6366f1" radius={[0,4,4,0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ fontSize:10, color: T.textMuted }}>💡 Manufacturing and IT are the most represented industries.</div>
                </Card>

                {/* Quick Facts */}
                <Card title="Quick Facts" style={{ flex:"0 0 230px" }}>
                  {[
                    ["📁", "Source",       "Kaggle — AI Impact Dataset"],
                    ["📅", "Timeframe",    "May 2024"],
                    ["🗂", "Format",        "CSV (UTF-8)"],
                    ["📏", "Rows",          "20,000"],
                    ["📐", "Columns",       "16"],
                    ["🔢", "Numeric",       "9 features"],
                    ["🔤", "Categorical",   "6 features"],
                    ["🎯", "Target",        "Layoff_Risk"],
                    ["⚖️", "Class Balance", "~33% each"],
                    ["❌", "Missing Values","0 (clean)"],
                  ].map(([icon, k, v]) => (
                    <div key={k as string} style={{ display:"flex", gap:8, marginBottom:7, alignItems:"flex-start" }}>
                      <span style={{ fontSize:13, flexShrink:0 }}>{icon}</span>
                      <span style={{ fontSize:11, color: T.textMuted, width:88, flexShrink:0 }}>{k}</span>
                      <span style={{ fontSize:11, color: T.textPrimary, fontWeight:500 }}>{v}</span>
                    </div>
                  ))}
                </Card>
              </div>

              {/* Row 2: Education + Job Level + Use Cases */}
              <div style={{ display:"flex", gap:14 }}>

                {/* Education */}
                <Card title="Education Level Distribution" hoverable style={{ flex:1 }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={educationDist} margin={{ right:10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                      <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<DarkTooltip />} />
                      <Bar dataKey="count" name="Employees" fill="#a855f7" radius={[4,4,0,0]} barSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Job Level */}
                <Card title="Job Level Distribution" hoverable style={{ flex:1 }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={jobLevelDist} margin={{ right:10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                      <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: T.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<DarkTooltip />} />
                      <Bar dataKey="count" name="Employees" fill="#22c55e" radius={[4,4,0,0]} barSize={44} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Use Cases */}
                <Card title="Dataset Use Cases" style={{ flex:1 }}>
                  {[
                    ["#6366f1", "🔮", "Train ML classifiers to predict layoff risk levels."],
                    ["#a855f7", "📊", "Analyze which industries face the highest AI disruption."],
                    ["#22c55e", "🛡", "Build career protection dashboards for HR teams."],
                    ["#f97316", "📈", "Study the impact of AI training on workforce resilience."],
                    ["#3b82f6", "🤖", "Correlate AI adoption level with employee risk scores."],
                    ["#ef4444", "⚠", "Identify high-risk job roles for proactive reskilling."],
                  ].map(([c,icon,text], i) => (
                    <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                      <span style={{ fontSize:14, color: c as string, flexShrink:0, marginTop:1 }}>{icon}</span>
                      <span style={{ fontSize:11, color: T.textSecond, lineHeight:1.5 }}>{text}</span>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          )}

          {/* ── TAB: COLUMNS ── */}
          {activeTab === "columns" && (
            <Card title="Column Definitions — 16 Features" style={{ overflow:"hidden" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${T.cardBorder}` }}>
                      {["#","Column Name","Data Type","Category","Example Value","Description"].map(h => (
                        <th key={h} style={{ textAlign:"left", padding:"8px 12px", fontSize:10, fontWeight:700, color: T.textMuted, textTransform:"uppercase", letterSpacing:0.8, whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {columns.map((col, i) => (
                      <tr key={col.name}
                        style={{ borderBottom:`1px solid ${T.cardBorder}`, background: i % 2 === 0 ? T.rowAlt : "transparent", transition:"background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.04)"}
                        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? T.rowAlt : "transparent"}
                      >
                        <td style={{ padding:"9px 12px", color: T.textMuted, fontSize:11 }}>{String(i+1).padStart(2,"0")}</td>
                        <td style={{ padding:"9px 12px" }}>
                          <span style={{ fontFamily:"monospace", fontSize:12, color: col.category === "Target" ? "#4ade80" : "#818cf8", fontWeight:600 }}>{col.name}</span>
                        </td>
                        <td style={{ padding:"9px 12px" }}><Badge type={col.type} /></td>
                        <td style={{ padding:"9px 12px" }}><Badge type={col.category} /></td>
                        <td style={{ padding:"9px 12px" }}>
                          <span style={{ fontFamily:"monospace", fontSize:11, color: T.textSecond, background: T.inputBg, borderRadius:4, padding:"2px 6px" }}>{col.example}</span>
                        </td>
                        <td style={{ padding:"9px 12px", color: T.textSecond, lineHeight:1.4, maxWidth:280 }}>{col.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop:14, display:"flex", gap:10, flexWrap:"wrap" }}>
                {[["Numeric","rgba(59,130,246,0.15)","#60a5fa"],["Categorical","rgba(168,85,247,0.15)","#c084fc"],["Target","rgba(34,197,94,0.15)","#4ade80"],["Integer","rgba(99,102,241,0.12)","#818cf8"],["String","rgba(245,158,11,0.12)","#fbbf24"]].map(([label,bg,color])=>(
                  <div key={label as string} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color: T.textSecond }}>
                    <span style={{ fontSize:10, fontWeight:600, background: bg as string, color: color as string, borderRadius:5, padding:"2px 7px" }}>{label}</span>
                    <span style={{ color: T.textMuted }}>= {label === "Numeric" ? "Scaled with StandardScaler" : label === "Categorical" ? "Encoded with OneHotEncoder" : label === "Target" ? "Model output variable" : label === "Integer" ? "Whole number values" : "Text / string values"}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ── TAB: STATISTICS ── */}
          {activeTab === "stats" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <Card title="Numeric Feature Statistics">
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                    <thead>
                      <tr style={{ borderBottom:`1px solid ${T.cardBorder}` }}>
                        {["Feature","Min","Max","Mean","Std Dev","Distribution (0→Max)"].map(h => (
                          <th key={h} style={{ textAlign:"left", padding:"8px 12px", fontSize:10, fontWeight:700, color: T.textMuted, textTransform:"uppercase", letterSpacing:0.8, whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {numericStats.map((row, i) => {
                        const meanPct = ((parseFloat(row.mean) - row.min) / (row.max - row.min || 1)) * 100;
                        return (
                          <tr key={row.feature}
                            style={{ borderBottom:`1px solid ${T.cardBorder}`, background: i % 2 === 0 ? T.rowAlt : "transparent" }}
                            onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.04)"}
                            onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? T.rowAlt : "transparent"}
                          >
                            <td style={{ padding:"9px 12px", fontWeight:600, color:"#818cf8", fontSize:12 }}>{row.feature}</td>
                            <td style={{ padding:"9px 12px", color: T.textSecond }}>{row.min}</td>
                            <td style={{ padding:"9px 12px", color: T.textSecond }}>{row.max}</td>
                            <td style={{ padding:"9px 12px", color:"#fbbf24", fontWeight:600 }}>{row.mean}</td>
                            <td style={{ padding:"9px 12px", color: T.textMuted }}>{row.std}</td>
                            <td style={{ padding:"9px 12px", minWidth:160 }}>
                              <div style={{ background: T.inputBg, borderRadius:4, height:8, overflow:"hidden", position:"relative" }}>
                                <div style={{ width:`${meanPct}%`, height:"100%", background:"linear-gradient(90deg,#6366f1,#a855f7)", borderRadius:4 }} />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>

              <div style={{ display:"flex", gap:14 }}>
                {/* Company Size */}
                <Card title="Company Size Breakdown" hoverable style={{ flex:1 }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {[["Small",  4120, "#60a5fa"],["Medium", 7350, "#818cf8"],["Large",  8530, "#a855f7"]].map(([label,count,color])=>(
                      <div key={label as string} style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:11, color: T.textSecond, width:55, flexShrink:0 }}>{label}</span>
                        <div style={{ flex:1, background: T.inputBg, borderRadius:4, height:10, overflow:"hidden" }}>
                          <div style={{ width:`${((count as number)/20000)*100*3}%`, maxWidth:"100%", height:"100%", background: color as string, borderRadius:4, transition:"width 0.5s ease" }} />
                        </div>
                        <span style={{ fontSize:11, color: T.textPrimary, fontWeight:600, width:55, textAlign:"right" }}>{(count as number).toLocaleString()}</span>
                        <span style={{ fontSize:10, color: T.textMuted, width:36 }}>({(((count as number)/20000)*100).toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:10, fontSize:10, color: T.textMuted }}>💡 Large companies dominate the dataset at 42.7%.</div>
                </Card>

                {/* AI Adoption Level */}
                <Card title="AI Adoption Level Breakdown" hoverable style={{ flex:1 }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {[["Low",  6540, "#ef4444"],["Medium",6710, "#f97316"],["High",  6750, "#22c55e"]].map(([label,count,color])=>(
                      <div key={label as string} style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:11, color: T.textSecond, width:55, flexShrink:0 }}>{label}</span>
                        <div style={{ flex:1, background: T.inputBg, borderRadius:4, height:10, overflow:"hidden" }}>
                          <div style={{ width:`${((count as number)/20000)*100*3}%`, maxWidth:"100%", height:"100%", background: color as string, borderRadius:4 }} />
                        </div>
                        <span style={{ fontSize:11, color: T.textPrimary, fontWeight:600, width:55, textAlign:"right" }}>{(count as number).toLocaleString()}</span>
                        <span style={{ fontSize:10, color: T.textMuted, width:36 }}>({(((count as number)/20000)*100).toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:10, fontSize:10, color: T.textMuted }}>💡 Evenly distributed — good for unbiased model training.</div>
                </Card>

                {/* Key Observations */}
                <Card title="Key Observations" style={{ flex:1 }}>
                  {[
                    ["#22c55e","✅","Dataset is fully clean with zero null or missing values."],
                    ["#6366f1","📊","Target variable is nearly perfectly balanced across 3 classes."],
                    ["#a855f7","🎓","Bachelor's degree is the most common education level (39%)."],
                    ["#f97316","🏢","Large companies are the biggest employer group (43%)."],
                    ["#3b82f6","⏱","Avg AI usage is 6.8 hrs/week — moderate engagement."],
                    ["#ef4444","🤖","Only 12.5 avg AI training hours — significant upskilling gap."],
                  ].map(([c,icon,text], i) => (
                    <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                      <span style={{ fontSize:13, color: c as string, flexShrink:0 }}>{icon}</span>
                      <span style={{ fontSize:11, color: T.textSecond, lineHeight:1.5 }}>{text}</span>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          )}

          {/* ── TAB: MODEL INFO ── */}
          {activeTab === "model" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

              {/* Model Overview Banner */}
              <div style={{ display:"flex", gap:14 }}>
                <Card title="ML Pipeline Summary" style={{ flex:2 }}>
                  <div style={{ display:"flex", gap:20 }}>
                    <div style={{ flex:1 }}>
                      {[
                        ["Algorithm",       "Random Forest Classifier"],
                        ["Trees",           "100 Decision Trees"],
                        ["Train Split",     "80% (16,000 records)"],
                        ["Test Split",      "20% (4,000 records)"],
                        ["Cross-Val",       "5-Fold Stratified"],
                        ["CV Mean Acc.",    "92%+"],
                        ["CV Std Dev",      "± 0.8%"],
                        ["Saved As",        "models/risk_model.joblib"],
                      ].map(([k,v]) => (
                        <div key={k} style={{ display:"flex", gap:10, marginBottom:7 }}>
                          <span style={{ fontSize:11, color: T.textMuted, width:120, flexShrink:0 }}>{k}</span>
                          <span style={{ fontSize:11, color: T.textPrimary, fontWeight:600 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11, fontWeight:700, color: T.textPrimary, marginBottom:10, textTransform:"uppercase", letterSpacing:0.8 }}>Preprocessing Steps</div>
                      {[
                        ["Numeric (9)","StandardScaler → zero mean, unit variance","#818cf8"],
                        ["Categorical (6)","OneHotEncoder → binary columns, handle_unknown=ignore","#c084fc"],
                        ["Pipeline","sklearn.pipeline.Pipeline → prevent data leakage","#4ade80"],
                        ["Stratify","train_test_split with stratify=y → balanced splits","#fbbf24"],
                      ].map(([k,v,c]) => (
                        <div key={k as string} style={{ marginBottom:9 }}>
                          <div style={{ fontSize:10, fontWeight:700, color: c as string, marginBottom:2 }}>{k}</div>
                          <div style={{ fontSize:11, color: T.textSecond }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Accuracy Gauge */}
                <Card title="Model Accuracy" hoverable style={{ flex:"0 0 200px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", gap:10 }}>
                  <div style={{ width:120, height:120, borderRadius:"50%", border:"6px solid #22c55e", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", boxShadow:"0 0 32px rgba(34,197,94,0.3)" }}>
                    <div style={{ fontSize:28, fontWeight:800, color:"#22c55e" }}>92%</div>
                    <div style={{ fontSize:10, color: T.textMuted }}>Test Accuracy</div>
                  </div>
                  <div style={{ fontSize:11, color: T.textSecond }}>Excellent generalization across all 3 risk classes.</div>
                  <div style={{ width:"100%", marginTop:4 }}>
                    {[["High","93%","#ef4444"],["Medium","91%","#f97316"],["Low","92%","#22c55e"]].map(([l,v,c])=>(
                      <div key={l} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                        <span style={{ fontSize:10, color: T.textSecond, width:50 }}>{l}</span>
                        <div style={{ flex:1, background: T.inputBg, borderRadius:4, height:6 }}>
                          <div style={{ width:v, height:"100%", background: c as string, borderRadius:4 }} />
                        </div>
                        <span style={{ fontSize:10, color: c as string, width:30 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Classification Report Table */}
              <Card title="Classification Report">
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${T.cardBorder}` }}>
                      {["Class","Precision","Recall","F1-Score","Support"].map(h => (
                        <th key={h} style={{ textAlign:"left", padding:"8px 12px", fontSize:10, fontWeight:700, color: T.textMuted, textTransform:"uppercase", letterSpacing:0.8 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modelPerfRows.map((row, i) => (
                      <tr key={row.cls} style={{ borderBottom:`1px solid ${T.cardBorder}`, background: i % 2 === 0 ? T.rowAlt : "transparent" }}>
                        <td style={{ padding:"10px 12px" }}>
                          <span style={{ fontWeight:700, color: row.cls === "High Risk" ? "#ef4444" : row.cls === "Medium Risk" ? "#f97316" : "#22c55e" }}>{row.cls}</span>
                        </td>
                        <td style={{ padding:"10px 12px", color:"#818cf8", fontWeight:600 }}>{row.precision}</td>
                        <td style={{ padding:"10px 12px", color:"#c084fc", fontWeight:600 }}>{row.recall}</td>
                        <td style={{ padding:"10px 12px", color:"#4ade80", fontWeight:600 }}>{row.f1}</td>
                        <td style={{ padding:"10px 12px", color: T.textSecond }}>{row.support}</td>
                      </tr>
                    ))}
                    <tr style={{ borderTop:`2px solid ${T.cardBorder}`, background: T.inputBg }}>
                      <td style={{ padding:"10px 12px", fontWeight:700, color: T.textPrimary }}>Weighted Avg</td>
                      <td style={{ padding:"10px 12px", color:"#818cf8", fontWeight:700 }}>92%</td>
                      <td style={{ padding:"10px 12px", color:"#c084fc", fontWeight:700 }}>92%</td>
                      <td style={{ padding:"10px 12px", color:"#4ade80", fontWeight:700 }}>92%</td>
                      <td style={{ padding:"10px 12px", color: T.textSecond, fontWeight:600 }}>20,000</td>
                    </tr>
                  </tbody>
                </table>
              </Card>

              {/* Top Features + API Usage */}
              <div style={{ display:"flex", gap:14 }}>
                <Card title="Top Predictive Features" hoverable style={{ flex:1 }}>
                  {[
                    ["Tasks_Automated_Percentage",  0.142, "#ef4444"],
                    ["Routine_Task_Percentage",     0.138, "#f97316"],
                    ["AI_Usage_Hours_Per_Week",     0.119, "#fbbf24"],
                    ["Creativity_Requirement",      0.108, "#22c55e"],
                    ["Human_Interaction_Level",     0.102, "#4ade80"],
                    ["AI_Training_Hours",           0.095, "#818cf8"],
                    ["Number_of_AI_Tools_Used",     0.089, "#a855f7"],
                    ["Years_of_Experience",         0.072, "#60a5fa"],
                  ].map(([feat, imp, color]) => (
                    <div key={feat as string} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                      <span style={{ fontSize:10, fontFamily:"monospace", color:"#818cf8", width:200, flexShrink:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{feat}</span>
                      <div style={{ flex:1, background: T.inputBg, borderRadius:4, height:8, overflow:"hidden" }}>
                        <div style={{ width:`${(imp as number)*700}%`, maxWidth:"100%", height:"100%", background: color as string, borderRadius:4 }} />
                      </div>
                      <span style={{ fontSize:10, color: T.textSecond, width:42, textAlign:"right" }}>{(imp as number).toFixed(3)}</span>
                    </div>
                  ))}
                </Card>

                <Card title="API Endpoint Usage" hoverable style={{ flex:1 }}>
                  <div style={{ fontSize:11, color: T.textSecond, marginBottom:10 }}>The trained model is served via FastAPI at <span style={{ color:"#818cf8", fontFamily:"monospace" }}>POST /predict</span></div>

                  <div style={{ fontSize:10, fontWeight:700, color: T.textMuted, textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>Request Body (JSON)</div>
                  <div style={{ background: T.inputBg, border:`1px solid ${T.cardBorder}`, borderRadius:8, padding:"10px 12px", fontSize:11, fontFamily:"monospace", color:"#a5b4fc", lineHeight:1.7, marginBottom:12, overflowX:"auto" }}>
                    {`{
  "Age": 32,
  "Education_Level": "Bachelor's",
  "Years_of_Experience": 7,
  "Industry": "Finance",
  "Job_Role": "Financial Analyst",
  "Company_Size": "Large",
  "Job_Level": "Mid",
  "Routine_Task_Percentage": 60,
  "Creativity_Requirement": 35,
  "Human_Interaction_Level": 50,
  "AI_Adoption_Level": "Medium",
  "Number_of_AI_Tools_Used": 3,
  "AI_Usage_Hours_Per_Week": 8,
  "Tasks_Automated_Percentage": 45,
  "AI_Training_Hours": 10
}`}
                  </div>

                  <div style={{ fontSize:10, fontWeight:700, color: T.textMuted, textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>Response</div>
                  <div style={{ background: T.inputBg, border:`1px solid ${T.cardBorder}`, borderRadius:8, padding:"10px 12px", fontSize:11, fontFamily:"monospace", color:"#4ade80", lineHeight:1.7 }}>
                    {`{
  "risk_level": "High",
  "confidence": {
    "High": 82.4,
    "Medium": 11.8,
    "Low": 5.8
  }
}`}
                  </div>
                </Card>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}