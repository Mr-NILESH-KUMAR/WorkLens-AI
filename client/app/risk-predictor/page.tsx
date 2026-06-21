"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";

// ── FORM OPTIONS (exact categories from aiimpactjobslayoffriskdataset.csv) ────
const EDUCATION_LEVELS = ["High School", "Bachelor's", "Master's", "PhD"];
const INDUSTRIES = ["Education", "Finance", "Healthcare", "IT", "Logistics", "Manufacturing", "Retail", "Telecom"];
const JOB_ROLES = [
  "Academic Coordinator", "Accountant", "Auditor", "Data Analyst", "Dispatcher",
  "Financial Analyst", "Health Analyst", "Inventory Analyst", "ML Engineer",
  "Medical Assistant", "Network Engineer", "Nurse", "Operations Analyst",
  "Operator", "Production Supervisor", "Quality Engineer", "Research Assistant",
  "Sales Associate", "Software Engineer", "Store Manager", "Supply Chain Analyst",
  "Support Specialist", "Teacher", "Warehouse Manager",
];
const COMPANY_SIZES = ["Small", "Medium", "Large"];
const JOB_LEVELS = ["Entry", "Mid", "Senior"];
const AI_ADOPTION_LEVELS = ["Low", "Medium", "High"];

// API endpoint — your FastAPI ml-engine service (see main.py). Update if hosted elsewhere.
const PREDICT_API_URL = "http://localhost:8000/predict";

type FormState = {
  Age: number;
  Education_Level: string;
  Years_of_Experience: number;
  Industry: string;
  Job_Role: string;
  Company_Size: string;
  Job_Level: string;
  Routine_Task_Percentage: number;
  Creativity_Requirement: number;
  Human_Interaction_Level: number;
  AI_Adoption_Level: string;
  Number_of_AI_Tools_Used: number;
  AI_Usage_Hours_Per_Week: number;
  Tasks_Automated_Percentage: number;
  AI_Training_Hours: number;
};

const DEFAULT_FORM: FormState = {
  Age: 35,
  Education_Level: "Bachelor's",
  Years_of_Experience: 7,
  Industry: "Finance",
  Job_Role: "Financial Analyst",
  Company_Size: "Medium",
  Job_Level: "Mid",
  Routine_Task_Percentage: 50,
  Creativity_Requirement: 48,
  Human_Interaction_Level: 57,
  AI_Adoption_Level: "Medium",
  Number_of_AI_Tools_Used: 3,
  AI_Usage_Hours_Per_Week: 8,
  Tasks_Automated_Percentage: 40,
  AI_Training_Hours: 12,
};

type PredictionResult = {
  risk_level: string;
  confidence: { High: number; Medium: number; Low: number };
};

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

// ── Local fallback heuristic (used only if the API call fails) ────────────────
// Mirrors the dataset's dominant patterns so the UI still responds if ml-engine is offline.
function localFallbackPredict(f: FormState): PredictionResult {
  let score =
    f.Routine_Task_Percentage * 0.9 +
    f.Tasks_Automated_Percentage * 0.9 -
    f.Creativity_Requirement * 0.8 -
    f.Human_Interaction_Level * 0.3;

  score = Math.max(0, Math.min(200, score + 60));
  const high = Math.min(96, Math.max(1, score / 2));
  const low = Math.min(96, Math.max(1, 100 - score / 1.6));
  const med = Math.max(1, 100 - high - low);
  const total = high + med + low;

  const confidence = {
    High: Math.round((high / total) * 10000) / 100,
    Medium: Math.round((med / total) * 10000) / 100,
    Low: Math.round((low / total) * 10000) / 100,
  };
  const risk_level = (Object.keys(confidence) as Array<keyof typeof confidence>).reduce((a, b) =>
    confidence[a] >= confidence[b] ? a : b
  );
  return { risk_level, confidence };
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function RiskPredictor() {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);

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

  function riskColor(level: string | undefined) {
    if (level === "High") return "#ef4444";
    if (level === "Medium") return "#f97316";
    if (level === "Low") return "#22c55e";
    return T.textMuted;
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handlePredict() {
    setLoading(true);
    setError(null);
    setUsedFallback(false);
    try {
      const res = await fetch(PREDICT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`API responded with status ${res.status}`);
      const data: PredictionResult = await res.json();
      setResult(data);
    } catch (err: any) {
      // ml-engine likely not running locally — fall back to a local heuristic so the UI stays usable.
      setError(
        "Couldn't reach the prediction API at " + PREDICT_API_URL +
        ". Showing an estimate instead. Make sure your FastAPI server (uvicorn main:app --reload) is running."
      );
      setResult(localFallbackPredict(form));
      setUsedFallback(true);
    } finally {
      setLoading(false);
    }
  }

  const pieData = result
    ? [
        { name: "High",   value: result.confidence.High,   color: "#ef4444" },
        { name: "Medium", value: result.confidence.Medium, color: "#f97316" },
        { name: "Low",    value: result.confidence.Low,    color: "#22c55e" },
      ]
    : [];

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

  // ── FORM CONTROLS ──────────────────────────────────────────────────────────
  function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
        <label style={{ fontSize:10, color: T.textMuted, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ background: T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"8px 10px", color: T.textPrimary, fontSize:12, outline:"none", cursor:"pointer" }}
        >
          {options.map(opt => <option key={opt} value={opt} style={{ color:"#0f172a" }}>{opt}</option>)}
        </select>
      </div>
    );
  }

  function SliderField({ label, value, min, max, unit = "", onChange }: { label: string; value: number; min: number; max: number; unit?: string; onChange: (v: number) => void }) {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <label style={{ fontSize:10, color: T.textMuted, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
          <span style={{ fontSize:11, color:"#6366f1", fontWeight:700 }}>{value}{unit}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ width:"100%", accentColor:"#6366f1", cursor:"pointer" }}
        />
      </div>
    );
  }

  function NumberField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
        <label style={{ fontSize:10, color: T.textMuted, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))}
          style={{ background: T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"8px 10px", color: T.textPrimary, fontSize:12, outline:"none" }}
        />
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
            <div style={{ fontSize:17, fontWeight:800, color: T.textPrimary, letterSpacing:0.5 }}>RISK PREDICTOR</div>
            <div style={{ fontSize:11, color: T.textMuted }}>Predict layoff risk for any employee profile using the trained ML model.</div>
          </div>

          {/* Search */}
          <div style={{ display:"flex", alignItems:"center", background: T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"7px 12px", gap:8, width:180 }}>
            <span style={{ color: T.textMuted, fontSize:13 }}>🔍</span>
            <span style={{ color: T.textMuted, fontSize:12 }}>Search anything...</span>
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
        <div style={{ padding:"16px 20px", display:"flex", gap:16, flex:1 }}>

          {/* ── LEFT: FORM ── */}
          <div style={{ flex:"0 0 460px", display:"flex", flexDirection:"column", gap:16, overflowY:"auto" }}>

            <Card title="Employee Profile">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <NumberField label="Age" value={form.Age} min={18} max={70} onChange={v => updateField("Age", v)} />
                <NumberField label="Years of Experience" value={form.Years_of_Experience} min={0} max={45} onChange={v => updateField("Years_of_Experience", v)} />
                <SelectField label="Education Level" value={form.Education_Level} options={EDUCATION_LEVELS} onChange={v => updateField("Education_Level", v)} />
                <SelectField label="Job Level" value={form.Job_Level} options={JOB_LEVELS} onChange={v => updateField("Job_Level", v)} />
                <SelectField label="Industry" value={form.Industry} options={INDUSTRIES} onChange={v => updateField("Industry", v)} />
                <SelectField label="Company Size" value={form.Company_Size} options={COMPANY_SIZES} onChange={v => updateField("Company_Size", v)} />
              </div>
              <div style={{ marginTop:12 }}>
                <SelectField label="Job Role" value={form.Job_Role} options={JOB_ROLES} onChange={v => updateField("Job_Role", v)} />
              </div>
            </Card>

            <Card title="Work Characteristics">
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <SliderField label="Routine Task %" value={form.Routine_Task_Percentage} min={0} max={100} unit="%" onChange={v => updateField("Routine_Task_Percentage", v)} />
                <SliderField label="Creativity Requirement" value={form.Creativity_Requirement} min={0} max={100} unit="%" onChange={v => updateField("Creativity_Requirement", v)} />
                <SliderField label="Human Interaction Level" value={form.Human_Interaction_Level} min={0} max={100} unit="%" onChange={v => updateField("Human_Interaction_Level", v)} />
                <SliderField label="Tasks Automated %" value={form.Tasks_Automated_Percentage} min={0} max={100} unit="%" onChange={v => updateField("Tasks_Automated_Percentage", v)} />
              </div>
            </Card>

            <Card title="AI Engagement">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
                <SelectField label="AI Adoption Level" value={form.AI_Adoption_Level} options={AI_ADOPTION_LEVELS} onChange={v => updateField("AI_Adoption_Level", v)} />
                <NumberField label="AI Tools Used" value={form.Number_of_AI_Tools_Used} min={0} max={15} onChange={v => updateField("Number_of_AI_Tools_Used", v)} />
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <SliderField label="AI Usage Hours / Week" value={form.AI_Usage_Hours_Per_Week} min={0} max={40} unit=" hrs" onChange={v => updateField("AI_Usage_Hours_Per_Week", v)} />
                <SliderField label="AI Training Hours" value={form.AI_Training_Hours} min={0} max={100} unit=" hrs" onChange={v => updateField("AI_Training_Hours", v)} />
              </div>
            </Card>

            <button
              onClick={handlePredict}
              disabled={loading}
              style={{
                background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(90deg,#6366f1,#8b5cf6)",
                border:"none", borderRadius:10, padding:"14px 20px", color:"#fff",
                fontSize:13, fontWeight:700, cursor: loading ? "not-allowed" : "pointer",
                boxShadow:"0 6px 20px rgba(99,102,241,0.35)", transition:"transform 0.15s",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              {loading ? "Predicting..." : "🔮 Predict Layoff Risk"}
            </button>
          </div>

          {/* ── RIGHT: RESULTS ── */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:16 }}>

            {error && (
              <div style={{ background: dark ? "rgba(249,115,22,0.1)" : "rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.35)", borderRadius:10, padding:"10px 14px", fontSize:11, color:"#f97316", lineHeight:1.5 }}>
                ⚠ {error}
              </div>
            )}

            {!result && !loading && (
              <Card hoverable style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
                <div>
                  <div style={{ fontSize:40, marginBottom:12 }}>🔮</div>
                  <div style={{ fontSize:14, fontWeight:700, color: T.textPrimary, marginBottom:6 }}>No Prediction Yet</div>
                  <div style={{ fontSize:12, color: T.textMuted, maxWidth:280, margin:"0 auto" }}>
                    Fill out the employee profile on the left and click "Predict Layoff Risk" to see results.
                  </div>
                </div>
              </Card>
            )}

            {loading && (
              <Card hoverable style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:12, color: T.textMuted }}>Running prediction…</div>
              </Card>
            )}

            {result && !loading && (
              <>
                <Card title={usedFallback ? "Estimated Risk Level (Offline Estimate)" : "Predicted Risk Level"} hoverable>
                  <div style={{ display:"flex", alignItems:"center", gap:24 }}>
                    <div style={{ width:120, height:120, borderRadius:"50%", border:`8px solid ${riskColor(result.risk_level)}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:22, fontWeight:800, color: riskColor(result.risk_level) }}>{result.confidence[result.risk_level as keyof typeof result.confidence]}%</div>
                      </div>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11, color: T.textMuted, marginBottom:4 }}>Predicted Risk</div>
                      <div style={{ fontSize:24, fontWeight:800, color: riskColor(result.risk_level), marginBottom:14 }}>
                        {result.risk_level?.toUpperCase()} RISK
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {(["High","Medium","Low"] as const).map(level => (
                          <div key={level} style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ fontSize:11, color: T.textSecondary, width:55 }}>{level}</span>
                            <div style={{ flex:1, background: T.inputBg, borderRadius:4, height:8, overflow:"hidden" }}>
                              <div style={{ width:`${result.confidence[level]}%`, height:"100%", background: riskColor(level), borderRadius:4, transition:"width 0.5s ease" }} />
                            </div>
                            <span style={{ fontSize:11, color: riskColor(level), width:42, textAlign:"right" }}>{result.confidence[level]}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="Confidence Breakdown" hoverable>
                  <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                    <ResponsiveContainer width="45%" height={200}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} dataKey="value" startAngle={90} endAngle={-270}>
                          {pieData.map((e,i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip content={<DarkTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
                      {pieData.map(d => (
                        <div key={d.name} style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                          <span style={{ display:"flex", alignItems:"center", gap:6, color: d.color, fontWeight:600 }}>
                            <span style={{ width:8, height:8, borderRadius:"50%", background:d.color, display:"inline-block" }} />
                            {d.name} Risk
                          </span>
                          <span style={{ color: T.textMuted }}>{d.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card title="What Drove This Prediction" hoverable>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {(() => {
                      const insights: Array<[string, string, string] | null> = [
                        form.Tasks_Automated_Percentage >= 60 ? ["⚠", "#ef4444", `High task automation (${form.Tasks_Automated_Percentage}%) significantly increases layoff risk.`] : null,
                        form.Routine_Task_Percentage >= 60 ? ["⚠", "#ef4444", `Routine-heavy work (${form.Routine_Task_Percentage}%) is strongly associated with higher risk.`] : null,
                        form.Creativity_Requirement >= 60 ? ["🛡", "#22c55e", `Strong creativity requirement (${form.Creativity_Requirement}%) is the most protective factor in this profile.`] : null,
                        form.Human_Interaction_Level >= 70 ? ["🛡", "#22c55e", `High human interaction (${form.Human_Interaction_Level}%) helps lower layoff risk.`] : null,
                        (form.Education_Level === "PhD" || form.Education_Level === "Master's") ? ["🎓", "#3b82f6", `${form.Education_Level} education level correlates with reduced risk exposure.`] : null,
                        form.AI_Training_Hours >= 20 ? ["📚", "#a855f7", `${form.AI_Training_Hours} hrs of AI training shows active upskilling, though heavy training often pairs with high-automation roles.`] : null,
                      ];
                      const active = insights.filter((row): row is [string, string, string] => row !== null);

                      if (active.length === 0) {
                        return <div style={{ fontSize:11, color: T.textMuted }}>This profile sits in the mid-range across all major risk factors.</div>;
                      }

                      return active.map((row, i) => {
                        const [icon, color, text] = row;
                        return (
                          <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                            <span style={{ fontSize:14, color, flexShrink:0, marginTop:1 }}>{icon}</span>
                            <span style={{ fontSize:11, color: T.textSecondary, lineHeight:1.5 }}>{text}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}