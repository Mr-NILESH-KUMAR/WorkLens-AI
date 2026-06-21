"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Cell,
} from "recharts";

// ── NAV ITEMS (shared across all pages) ──────────────────────────────────────
const navItems = [
  { label: "Dashboard",              icon: "⊞",  route: "/" },
  { label: "Risk Analysis",          icon: "⚠",  route: "/risk-analysis" },
  { label: "Industry Insights",      icon: "🏭", route: "/industry-insights" },
  { label: "Job Role Insights",      icon: "👤", route: "/job-role-insights" },
  { label: "AI Adoption Analysis",   icon: "🤖", route: "/ai-adoption-analysis" },
  { label: "Skills & Protection",    icon: "🛡",  route: "/skills-protection" },
  { label: "Risk Predictor",         icon: "🔮", badge: "New", route: "/risk-predictor" },
  { label: "Career Recommendations", icon: "🎯", route: "/career-recommendations", active: true },
  { label: "Reports",                icon: "📊", route: "/reports" },
  { label: "About Dataset",          icon: "ℹ",  route: "/about" },
];

// ── DATA ─────────────────────────────────────────────────────────────────────

// Career paths ranked by future-proofing score
const careerPaths = [
  {
    id: 1,
    title: "AI/ML Engineer",
    industry: "IT",
    currentDemand: "Very High",
    growthRate: 38,
    avgSalary: "$128K",
    riskLevel: "Low",
    riskColor: "#22c55e",
    skills: ["Python", "TensorFlow", "MLOps", "Data Pipelines"],
    transitionFrom: ["Software Engineer", "Data Analyst", "Research Assistant"],
    futureScore: 94,
    color: "#6366f1",
  },
  {
    id: 2,
    title: "Healthcare Data Analyst",
    industry: "Healthcare",
    currentDemand: "High",
    growthRate: 29,
    avgSalary: "$92K",
    riskLevel: "Low",
    riskColor: "#22c55e",
    skills: ["SQL", "BI Tools", "Clinical Data", "HIPAA"],
    transitionFrom: ["Nurse", "Medical Assistant", "Lab Technician"],
    futureScore: 88,
    color: "#22c55e",
  },
  {
    id: 3,
    title: "AI Prompt Engineer",
    industry: "IT / Finance",
    currentDemand: "High",
    growthRate: 45,
    avgSalary: "$110K",
    riskLevel: "Low",
    riskColor: "#22c55e",
    skills: ["LLM APIs", "Python", "NLP", "Business Writing"],
    transitionFrom: ["Copywriter", "Accountant", "Sales Associate"],
    futureScore: 85,
    color: "#a855f7",
  },
  {
    id: 4,
    title: "Robotics Process Analyst",
    industry: "Manufacturing",
    currentDemand: "Medium",
    growthRate: 22,
    avgSalary: "$84K",
    riskLevel: "Medium",
    riskColor: "#f97316",
    skills: ["RPA Tools", "Process Mapping", "Python Basics", "Six Sigma"],
    transitionFrom: ["Operator", "Quality Engineer", "Production Supervisor"],
    futureScore: 72,
    color: "#f97316",
  },
  {
    id: 5,
    title: "Supply Chain Tech Lead",
    industry: "Logistics",
    currentDemand: "Medium",
    growthRate: 18,
    avgSalary: "$96K",
    riskLevel: "Medium",
    riskColor: "#f97316",
    skills: ["ERP Systems", "AI Forecasting", "IoT Basics", "Analytics"],
    transitionFrom: ["Warehouse Manager", "Dispatcher", "Supply Chain Analyst"],
    futureScore: 68,
    color: "#3b82f6",
  },
  {
    id: 6,
    title: "EdTech Curriculum Designer",
    industry: "Education",
    currentDemand: "Medium",
    growthRate: 21,
    avgSalary: "$72K",
    riskLevel: "Low",
    riskColor: "#22c55e",
    skills: ["LMS Platforms", "Instructional Design", "AI Tools", "Pedagogy"],
    transitionFrom: ["Teacher", "Academic Coordinator", "Research Assistant"],
    futureScore: 81,
    color: "#06b6d4",
  },
];

// Skill demand bar data
const skillDemandData = [
  { skill: "Python / AI Coding",   demand: 92, color: "#6366f1" },
  { skill: "Data Analysis (SQL)",  demand: 85, color: "#a855f7" },
  { skill: "LLM / Prompt Eng.",    demand: 80, color: "#8b5cf6" },
  { skill: "Cloud (AWS/GCP)",      demand: 76, color: "#3b82f6" },
  { skill: "RPA Tools",            demand: 68, color: "#f97316" },
  { skill: "Cybersecurity Basics", demand: 65, color: "#22c55e" },
  { skill: "BI / Tableau",         demand: 60, color: "#06b6d4" },
  { skill: "Soft Skills / EQ",     demand: 55, color: "#eab308" },
];

// Career radar — compare two career profiles
const careerRadar = [
  { metric: "Job Security",    "AI/ML Engineer": 90, "Healthcare Analyst": 85, "Prompt Engineer": 78 },
  { metric: "Salary Potential",  "AI/ML Engineer": 95, "Healthcare Analyst": 72, "Prompt Engineer": 88 },
  { metric: "Learning Curve",  "AI/ML Engineer": 65, "Healthcare Analyst": 75, "Prompt Engineer": 80 },
  { metric: "Remote Work",     "AI/ML Engineer": 92, "Healthcare Analyst": 60, "Prompt Engineer": 88 },
  { metric: "AI Resistance",   "AI/ML Engineer": 88, "Healthcare Analyst": 82, "Prompt Engineer": 76 },
  { metric: "Growth Rate",     "AI/ML Engineer": 94, "Healthcare Analyst": 80, "Prompt Engineer": 85 },
];

// Transition roadmap steps for selected career
const roadmaps: Record<string, { step: string; duration: string; resources: string }[]> = {
  "AI/ML Engineer": [
    { step: "Learn Python & Stats Basics", duration: "2 months", resources: "Coursera, freeCodeCamp" },
    { step: "Complete ML Fundamentals Course", duration: "3 months", resources: "fast.ai, DeepLearning.AI" },
    { step: "Build 3 Portfolio Projects", duration: "2 months", resources: "Kaggle, GitHub" },
    { step: "Deploy a Model (MLOps)", duration: "1 month", resources: "AWS SageMaker, HuggingFace" },
    { step: "Apply & Network", duration: "Ongoing", resources: "LinkedIn, Meetups" },
  ],
  "Healthcare Data Analyst": [
    { step: "Learn SQL & Excel Advanced", duration: "1 month", resources: "Mode Analytics, Udemy" },
    { step: "Study Clinical Data Standards", duration: "2 months", resources: "AHIMA, Coursera" },
    { step: "Get HIPAA Compliance Cert", duration: "1 month", resources: "AHIMA Online" },
    { step: "Master a BI Tool (Tableau)", duration: "2 months", resources: "Tableau Public, YouTube" },
    { step: "Apply to Healthcare Firms", duration: "Ongoing", resources: "LinkedIn, Indeed" },
  ],
  "AI Prompt Engineer": [
    { step: "Master GPT / Claude APIs", duration: "1 month", resources: "OpenAI Docs, Anthropic Docs" },
    { step: "Study NLP Fundamentals", duration: "2 months", resources: "Hugging Face, Coursera" },
    { step: "Build Prompt Engineering Portfolio", duration: "2 months", resources: "PromptBase, GitHub" },
    { step: "Specialize in a Domain (Finance/Legal)", duration: "2 months", resources: "Domain-specific courses" },
    { step: "Freelance or Apply", duration: "Ongoing", resources: "Upwork, LinkedIn" },
  ],
};

const RADAR_COLORS: Record<string, string> = {
  "AI/ML Engineer": "#6366f1",
  "Healthcare Analyst": "#22c55e",
  "Prompt Engineer": "#a855f7",
};

// ── TOOLTIP ───────────────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#e2e8f0" }}>
      {label && <div style={{ marginBottom: 4, color: "#94a3b8" }}>{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color || "#e2e8f0" }}>
          {p.name}: {typeof p.value === "number" ? `${p.value}` : p.value}
        </div>
      ))}
    </div>
  );
};

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function CareerRecommendations() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("Career Recommendations");
  const [dark, setDark] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState<"All" | "Low" | "Medium" | "High">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // ── THEME ─────────────────────────────────────────────────────────────────
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

  // ── CARD COMPONENT ────────────────────────────────────────────────────────
  function Card({
    title,
    children,
    style = {},
  }: {
    title?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) {
    const [hovered, setHovered] = useState(false);
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: T.cardBg,
          border: `1px solid ${hovered ? "rgba(99,102,241,0.4)" : T.cardBorder}`,
          borderRadius: 14,
          padding: 16,
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

  // Filtered careers
  const visibleCareers = careerPaths.filter((c) => {
    const matchRisk = filterRisk === "All" || c.riskLevel === filterRisk;
    const matchSearch =
      searchQuery === "" ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRisk && matchSearch;
  });

  const selectedRoadmap = selectedCareer ? roadmaps[selectedCareer] : null;
  const selectedCareerData = careerPaths.find((c) => c.title === selectedCareer);

  return (
    <div style={{ display: "flex", height: "100vh", background: bg, color: T.textPrimary, fontFamily: "Inter, Arial, sans-serif", overflow: "hidden", transition: "background 0.3s ease" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 210, background: T.sidebar, borderRight: `1px solid ${T.cardBorder}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ padding: "16px 14px 12px", borderBottom: `1px solid ${T.cardBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/logo-icon.png" alt="Worklens AI Logo" width={40} height={40} style={{ objectFit: "contain" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, background: "linear-gradient(90deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Worklens AI
              </div>
              <div style={{ fontSize: 9, color: T.textMuted, lineHeight: 1.3 }}>Workforce Risk Analytics</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => { setActiveNav(item.label); router.push(item.route); }}
                style={{
                  display: "flex", alignItems: "center", gap: 9, width: "100%",
                  padding: "9px 10px", borderRadius: 9, border: "none", cursor: "pointer",
                  background: isActive ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "transparent",
                  color: isActive ? "#fff" : T.textMuted,
                  fontSize: 12, fontWeight: isActive ? 600 : 400,
                  marginBottom: 2, textAlign: "left",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#6366f1";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = T.textMuted;
                  }
                }}
              >
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{ fontSize: 9, background: "#6366f1", color: "#fff", borderRadius: 4, padding: "1px 5px" }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Dataset Summary */}
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.cardBorder}` }}>
          <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
            Dataset Summary
          </div>
          {[["Total Records", "20,000"], ["Features", "16"], ["Last Updated", "May 29, 2024"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: T.textMuted }}>{k}</span>
              <span style={{ color: T.textPrimary, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 14 }}>
            <Image src="/logo.png" alt="logo" width={210} height={80} style={{ objectFit: "contain", width: "100%", height: "auto", marginBottom: 8, display: "block", borderRadius: 14 }} />
            <div style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#a5b4fc", lineHeight: 1.4 }}>
                AI is transforming the future of work. Analyze. Adapt. Grow.
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", minWidth: 0 }}>

        {/* ── HEADER ── */}
        <header style={{ background: T.headerBg, borderBottom: `1px solid ${T.cardBorder}`, padding: "11px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: T.textPrimary, letterSpacing: 0.5 }}>
              CAREER RECOMMENDATIONS
            </div>
            <div style={{ fontSize: 11, color: T.textMuted }}>
              AI-disruption-proof career paths, skill roadmaps, and transition guides.
            </div>
          </div>

          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 8, padding: "7px 12px", gap: 8, width: 200 }}>
            <span style={{ color: T.textMuted, fontSize: 13 }}>🔍</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search careers..."
              style={{ background: "transparent", border: "none", outline: "none", fontSize: 12, color: T.textPrimary, width: "100%" }}
            />
          </div>

          {/* Risk filter */}
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value as any)}
            style={{ background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 8, padding: "7px 12px", fontSize: 12, color: T.textSecondary, cursor: "pointer", outline: "none" }}
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>

          {/* Dark toggle */}
          <button
            onClick={() => setDark(!dark)}
            style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", border: `1px solid ${T.inputBorder}`, borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 17 }}
          >
            {dark ? "🌙" : "☀️"}
          </button>

          {/* Export */}
          <button
            style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
          >
            Export Report ↓
          </button>
        </header>

        {/* ── PAGE CONTENT ── */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── KPI ROW ── */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { icon: "🎯", label: "Career Paths Tracked",   value: "6",          sub: "Across all industries",          bg: "linear-gradient(135deg,#6366f1,#818cf8)" },
              { icon: "📈", label: "Fastest Growing Role",   value: "Prompt Eng.", sub: "45% demand increase YoY",         bg: "linear-gradient(135deg,#a855f7,#c084fc)" },
              { icon: "🛡️", label: "Most Future-Proof Role", value: "AI/ML Eng.",  sub: "94/100 future score",             bg: "linear-gradient(135deg,#22c55e,#4ade80)" },
              { icon: "💰", label: "Avg Salary (Top Roles)", value: "$110K",        sub: "Across low-risk careers",         bg: "linear-gradient(135deg,#3b82f6,#60a5fa)" },
              { icon: "⏱️", label: "Avg Transition Time",   value: "8 months",    sub: "To switch to a safe career",      bg: "linear-gradient(135deg,#f97316,#fb923c)" },
            ].map((kpi) => (
              <div
                key={kpi.label}
                style={{
                  flex: 1, borderRadius: 12, padding: "14px 14px 12px",
                  background: T.cardBg, border: `1px solid ${T.cardBorder}`,
                  display: "flex", flexDirection: "column", gap: 4,
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(0)")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                    {kpi.icon}
                  </div>
                  <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6 }}>
                    {kpi.label}
                  </div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: T.textPrimary, marginTop: 4 }}>{kpi.value}</div>
                <div style={{ fontSize: 10, color: T.textMuted }}>{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* ── CAREER CARDS GRID + SKILL DEMAND ── */}
          <div style={{ display: "flex", gap: 12 }}>

            {/* Career Cards */}
            <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Recommended Career Paths ({visibleCareers.length})
              </div>
              {visibleCareers.length === 0 && (
                <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 14, padding: 24, textAlign: "center", color: T.textMuted, fontSize: 13 }}>
                  No careers match your filter. Try adjusting the risk level or search.
                </div>
              )}
              {visibleCareers.map((career) => {
                const isSelected = selectedCareer === career.title;
                return (
                  <div
                    key={career.id}
                    onClick={() => setSelectedCareer(isSelected ? null : career.title)}
                    style={{
                      background: isSelected ? (dark ? "rgba(99,102,241,0.10)" : "rgba(99,102,241,0.06)") : T.cardBg,
                      border: `1px solid ${isSelected ? "rgba(99,102,241,0.45)" : T.cardBorder}`,
                      borderRadius: 14, padding: "12px 14px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: isSelected ? "0 4px 20px rgba(99,102,241,0.12)" : "none",
                    }}
                    onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.35)"; }}
                    onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.borderColor = T.cardBorder; }}
                  >
                    {/* Row 1: title + badges */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      {/* Future score circle */}
                      <div style={{
                        width: 44, height: 44, borderRadius: "50%",
                        background: `conic-gradient(${career.color} ${career.futureScore * 3.6}deg, ${dark ? "#1e293b" : "#e2e8f0"} 0deg)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, position: "relative",
                      }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: dark ? "#0d1220" : "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: career.color }}>{career.futureScore}</span>
                        </div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary }}>{career.title}</div>
                        <div style={{ fontSize: 10, color: T.textMuted }}>{career.industry}</div>
                      </div>

                      {/* Badges */}
                      <span style={{ fontSize: 9, background: `${career.riskColor}22`, color: career.riskColor, padding: "3px 8px", borderRadius: 6, fontWeight: 700 }}>
                        {career.riskLevel} Risk
                      </span>
                      <span style={{ fontSize: 9, background: dark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)", color: "#818cf8", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                        +{career.growthRate}% growth
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary }}>{career.avgSalary}</span>
                    </div>

                    {/* Row 2: skills */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      {career.skills.map((skill) => (
                        <span key={skill} style={{ fontSize: 10, background: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.textSecondary, padding: "2px 8px", borderRadius: 5 }}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Row 3: transition from */}
                    <div style={{ fontSize: 10, color: T.textMuted }}>
                      <span style={{ color: T.textSecondary, fontWeight: 600 }}>Transition from: </span>
                      {career.transitionFrom.join(" · ")}
                    </div>

                    {/* Future score bar */}
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.textMuted, marginBottom: 3 }}>
                        <span>Future-Proof Score</span>
                        <span style={{ color: career.color, fontWeight: 700 }}>{career.futureScore}/100</span>
                      </div>
                      <div style={{ background: T.inputBg, borderRadius: 4, height: 5 }}>
                        <div style={{ width: `${career.futureScore}%`, height: "100%", background: career.color, borderRadius: 4, transition: "width 0.6s ease" }} />
                      </div>
                    </div>

                    {isSelected && (
                      <div style={{ marginTop: 8, fontSize: 10, color: "#6366f1", fontWeight: 600 }}>
                        ↓ See transition roadmap below ↓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right column: Skill Demand + Radar */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Skill Demand Chart */}
              <Card title="Top Skills in Demand 2024–2026" style={{ flex: "none" }}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={skillDemandData} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: T.textMuted, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="skill" tick={{ fill: T.textMuted, fontSize: 9 }} axisLine={false} tickLine={false} width={110} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar dataKey="demand" name="Demand Score" radius={[0, 4, 4, 0]}>
                      {skillDemandData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4 }}>💡 Python and AI coding skills lead demand across all industries.</div>
              </Card>

              {/* Career Radar */}
              <Card title="Career Profile Comparison" style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {Object.entries(RADAR_COLORS).map(([name, color]) => (
                    <span key={name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                      <span style={{ fontSize: 9 }}>{name}</span>
                    </span>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={careerRadar}>
                    <PolarGrid stroke={T.gridLine} />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: T.textMuted, fontSize: 9 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    {Object.entries(RADAR_COLORS).map(([name, color]) => (
                      <Radar key={name} name={name} dataKey={name} stroke={color} fill={color} fillOpacity={0.09} strokeWidth={1.5} />
                    ))}
                    <Tooltip content={<DarkTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
                <div style={{ fontSize: 10, color: T.textMuted }}>💡 AI/ML Engineers lead in salary potential and job security.</div>
              </Card>
            </div>
          </div>

          {/* ── TRANSITION ROADMAP (conditionally shown) ── */}
          {selectedRoadmap && selectedCareerData && (
            <div
              style={{
                background: dark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.04)",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: 14, padding: 16,
                animation: "fadeIn 0.3s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: T.textPrimary }}>
                    🗺️ Transition Roadmap — {selectedCareerData.title}
                  </div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>
                    Step-by-step guide to transition into this career path.
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCareer(null)}
                  style={{ background: "transparent", border: `1px solid ${T.cardBorder}`, borderRadius: 8, padding: "4px 10px", color: T.textMuted, cursor: "pointer", fontSize: 11 }}
                >
                  ✕ Close
                </button>
              </div>

              {/* Steps */}
              <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
                {selectedRoadmap.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: "0 0 180px", background: T.cardBg,
                      border: `1px solid ${T.cardBorder}`, borderRadius: 12, padding: 12,
                      position: "relative",
                    }}
                  >
                    {/* Step number */}
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                      {idx + 1}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>{item.step}</div>
                    <div style={{ fontSize: 10, color: "#6366f1", marginBottom: 6, fontWeight: 600 }}>⏱ {item.duration}</div>
                    <div style={{ fontSize: 10, color: T.textMuted }}>📚 {item.resources}</div>

                    {/* Arrow connector */}
                    {idx < selectedRoadmap.length - 1 && (
                      <div style={{ position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", color: "#6366f1", fontSize: 16, fontWeight: 700 }}>→</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Career quick stats */}
              <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
                {[
                  ["Future Score", `${selectedCareerData.futureScore}/100`, selectedCareerData.color],
                  ["Avg Salary", selectedCareerData.avgSalary, "#22c55e"],
                  ["Growth Rate", `+${selectedCareerData.growthRate}%`, "#6366f1"],
                  ["Risk Level", selectedCareerData.riskLevel, selectedCareerData.riskColor],
                  ["Demand", selectedCareerData.currentDemand, "#a855f7"],
                ].map(([label, value, color]) => (
                  <div key={label} style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "8px 14px", minWidth: 110 }}>
                    <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: color as string }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── INSIGHTS + TIPS ROW ── */}
          <div style={{ display: "flex", gap: 12 }}>

            {/* Key Insights */}
            <Card title="Key Career Insights" style={{ flex: 1 }}>
              {[
                ["#6366f1", "🎯", "AI/ML Engineering ranks highest in future-proof score (94/100), with a 38% demand growth rate driven by enterprise AI adoption."],
                ["#a855f7", "🚀", "Prompt Engineering is the fastest growing new role — 45% YoY demand increase across IT and Finance sectors."],
                ["#22c55e", "🛡", "Healthcare and Education continue to generate low-risk career opportunities requiring human empathy and domain expertise."],
                ["#f97316", "⚙",  "Manufacturing workers can pivot to Robotics Process Analyst roles with 6–8 months of targeted RPA and Python training."],
                ["#3b82f6", "💡", "Logistics workers transitioning to Supply Chain Tech Lead roles see an average 40% salary increase after 8 months of retraining."],
              ].map(([c, icon, text], i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 15, color: c as string, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.6 }}>{text}</span>
                </div>
              ))}
            </Card>

            {/* Action Tips */}
            <Card title="Actionable Steps by Risk Level" style={{ flex: 1 }}>
              {[
                ["High Risk",   "#ef4444", "Start an online Python or SQL course immediately. Target RPA certifications within 3 months."],
                ["Medium Risk", "#f97316", "Identify AI tools in your current job. Begin cross-training in cloud or data analytics."],
                ["Low Risk",    "#22c55e", "Double down on domain expertise. Add AI skill layers to stay ahead of automation."],
                ["All Roles",   "#6366f1", "Build a LinkedIn presence and contribute to open-source projects to accelerate transition."],
                ["Any Level",   "#a855f7", "Join industry-specific AI communities and attend at least 2 workshops or webinars per quarter."],
              ].map(([level, color, tip]) => (
                <div key={level} style={{ display: "flex", gap: 10, marginBottom: 10, padding: "8px 10px", background: T.inputBg, borderRadius: 8 }}>
                  <span style={{ fontSize: 10, background: `${color}22`, color: color as string, padding: "2px 8px", borderRadius: 6, fontWeight: 700, flexShrink: 0, alignSelf: "flex-start" }}>
                    {level}
                  </span>
                  <span style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.5 }}>{tip}</span>
                </div>
              ))}
            </Card>

            {/* Career Demand Level Mini Cards */}
            <Card title="Career Demand Overview" style={{ flex: "0 0 220px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {careerPaths.map((c) => (
                  <div key={c.title} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: T.textSecondary, width: 100, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.title}
                    </span>
                    <div style={{ flex: 1, background: T.inputBg, borderRadius: 4, height: 8 }}>
                      <div style={{
                        width: `${c.futureScore}%`,
                        height: "100%",
                        background: c.color,
                        borderRadius: 4,
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: c.color, width: 28, textAlign: "right" }}>
                      {c.futureScore}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, fontSize: 10, color: T.textMuted }}>
                💡 Score out of 100 — higher = safer long-term career.
              </div>
            </Card>
          </div>

        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: #64748b; }
        select option { background: #0d1220; color: #e2e8f0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
}