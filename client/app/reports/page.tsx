"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION  (identical list used on every page — only "active" key changes)
// ─────────────────────────────────────────────────────────────────────────────
const navItems = [
  { label: "Dashboard",              icon: "⊞",  route: "/" },
  { label: "Risk Analysis",          icon: "⚠",  route: "/risk-analysis" },
  { label: "Industry Insights",      icon: "🏭", route: "/industry-insights" },
  { label: "Job Role Insights",      icon: "👤", route: "/job-role-insights" },
  { label: "AI Adoption Analysis",   icon: "🤖", route: "/ai-adoption-analysis" },
  { label: "Skills & Protection",    icon: "🛡",  route: "/skills-protection" },
  { label: "Risk Predictor",         icon: "🔮", badge: "New", route: "/risk-predictor" },
  { label: "Career Recommendations", icon: "🎯", route: "/career-recommendations" },
  { label: "Reports",                icon: "📊", route: "/reports", active: true },
  { label: "About Dataset",          icon: "ℹ",  route: "/about" },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────────────────────

// Pre-built downloadable reports
const reportsList = [
  {
    id: 1,
    title: "AI Workforce Risk — Full Dataset Report",
    description: "Complete breakdown of layoff risk across all 20,000 records, segmented by industry, job role, and AI adoption level.",
    category: "Full Report",
    pages: 48,
    lastUpdated: "May 29, 2024",
    status: "Ready",
    statusColor: "#22c55e",
    size: "3.2 MB",
    icon: "📄",
    accent: "#6366f1",
  },
  {
    id: 2,
    title: "Industry Risk Benchmark 2024",
    description: "Sector-by-sector comparison of high / medium / low risk profiles, AI adoption rates, and average training hours.",
    category: "Industry",
    pages: 22,
    lastUpdated: "May 29, 2024",
    status: "Ready",
    statusColor: "#22c55e",
    size: "1.8 MB",
    icon: "🏭",
    accent: "#f97316",
  },
  {
    id: 3,
    title: "Job Role Disruption Analysis",
    description: "Ranking of 24 tracked job roles by AI disruption risk. Includes routine task percentages and creativity scores.",
    category: "Job Roles",
    pages: 18,
    lastUpdated: "May 29, 2024",
    status: "Ready",
    statusColor: "#22c55e",
    size: "1.4 MB",
    icon: "👤",
    accent: "#22c55e",
  },
  {
    id: 4,
    title: "AI Adoption vs Risk Correlation Study",
    description: "Statistical analysis of how AI tool usage hours, training hours, and adoption levels correlate with layoff risk.",
    category: "AI Adoption",
    pages: 30,
    lastUpdated: "May 29, 2024",
    status: "Ready",
    statusColor: "#22c55e",
    size: "2.1 MB",
    icon: "🤖",
    accent: "#3b82f6",
  },
  {
    id: 5,
    title: "Career Transition Playbook 2024",
    description: "Role-by-role transition roadmaps for high-risk workers, including skill requirements, timelines, and salary projections.",
    category: "Career",
    pages: 36,
    lastUpdated: "May 29, 2024",
    status: "Ready",
    statusColor: "#22c55e",
    size: "2.7 MB",
    icon: "🎯",
    accent: "#a855f7",
  },
  {
    id: 6,
    title: "Skills & Protection Index",
    description: "Identifies the top protective skills against AI displacement and ranks workers by their current skills portfolio.",
    category: "Skills",
    pages: 26,
    lastUpdated: "Generating…",
    status: "Processing",
    statusColor: "#f97316",
    size: "—",
    icon: "🛡",
    accent: "#06b6d4",
  },
];

// Report generation trend — simulated monthly downloads
const downloadTrend = [
  { month: "Jan", downloads: 320 },
  { month: "Feb", downloads: 410 },
  { month: "Mar", downloads: 380 },
  { month: "Apr", downloads: 520 },
  { month: "May", downloads: 670 },
  { month: "Jun", downloads: 590 },
];

// Risk distribution snapshot (for the summary pie)
const riskSummaryPie = [
  { name: "Low Risk",    value: 32.4, color: "#22c55e" },
  { name: "Medium Risk", value: 34.1, color: "#f97316" },
  { name: "High Risk",   value: 33.5, color: "#ef4444" },
];

// Industry high-risk bar (mini summary)
const industryRiskBar = [
  { industry: "Manufacturing", high: 48.2, color: "#ef4444" },
  { industry: "Logistics",     high: 41.5, color: "#f97316" },
  { industry: "Retail",        high: 40.7, color: "#f97316" },
  { industry: "Finance",       high: 37.7, color: "#eab308" },
  { industry: "Telecom",       high: 35.2, color: "#eab308" },
  { industry: "IT",            high: 28.0, color: "#22c55e" },
  { industry: "Healthcare",    high: 20.8, color: "#22c55e" },
  { industry: "Education",     high: 20.1, color: "#22c55e" },
];

// Categories for filter
const CATEGORIES = ["All", "Full Report", "Industry", "Job Roles", "AI Adoption", "Career", "Skills"];

// ─────────────────────────────────────────────────────────────────────────────
// TOOLTIP
// ─────────────────────────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12,
        color: "#e2e8f0",
      }}
    >
      {label && <div style={{ marginBottom: 4, color: "#94a3b8" }}>{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color || "#e2e8f0" }}>
          {p.name}: {typeof p.value === "number" ? p.value : p.value}
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const router = useRouter();

  const [activeNav,    setActiveNav]    = useState("Reports");
  const [dark,         setDark]         = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [downloading,  setDownloading]  = useState<number | null>(null);

  // ── THEME TOKENS ────────────────────────────────────────────────────────────
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

  const T = {
    bg, sidebar, cardBg, cardBorder,
    textPrimary, textSecondary, textMuted,
    headerBg, inputBg, inputBorder, gridLine,
  };

  // ── REUSABLE CARD ───────────────────────────────────────────────────────────
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
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: T.textPrimary,
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            {title}
          </div>
        )}
        {children}
      </div>
    );
  }

  // ── SIMULATE DOWNLOAD ───────────────────────────────────────────────────────
  function handleDownload(id: number) {
    if (downloading !== null) return;
    setDownloading(id);
    setTimeout(() => setDownloading(null), 2000);
  }

  // ── FILTERED REPORTS ────────────────────────────────────────────────────────
  const visibleReports = reportsList.filter((r) => {
    const matchCat  = activeCategory === "All" || r.category === activeCategory;
    const matchSearch =
      searchQuery === "" ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: bg,
        color: T.textPrimary,
        fontFamily: "Inter, Arial, sans-serif",
        overflow: "hidden",
        transition: "background 0.3s ease",
      }}
    >
      {/* ════════════════════════════════════════════════════════ SIDEBAR ══════ */}
      <aside
        style={{
          width: 210,
          background: T.sidebar,
          borderRight: `1px solid ${T.cardBorder}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "16px 14px 12px", borderBottom: `1px solid ${T.cardBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image
              src="/logo-icon.png"
              alt="Worklens AI"
              width={40}
              height={40}
              style={{ objectFit: "contain" }}
            />
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  background: "linear-gradient(90deg,#6366f1,#a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Worklens AI
              </div>
              <div style={{ fontSize: 9, color: T.textMuted, lineHeight: 1.3 }}>
                Workforce Risk Analytics
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveNav(item.label);
                  router.push(item.route);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  width: "100%",
                  padding: "9px 10px",
                  borderRadius: 9,
                  border: "none",
                  cursor: "pointer",
                  background: isActive
                    ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                    : "transparent",
                  color: isActive ? "#fff" : T.textMuted,
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  marginBottom: 2,
                  textAlign: "left",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = dark
                      ? "rgba(99,102,241,0.1)"
                      : "rgba(99,102,241,0.08)";
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
                  <span
                    style={{
                      fontSize: 9,
                      background: "#6366f1",
                      color: "#fff",
                      borderRadius: 4,
                      padding: "1px 5px",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Dataset summary + brand block */}
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.cardBorder}` }}>
          <div
            style={{
              fontSize: 10,
              color: "#6366f1",
              fontWeight: 700,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Dataset Summary
          </div>
          {[
            ["Total Records", "20,000"],
            ["Features",      "16"],
            ["Last Updated",  "May 29, 2024"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}
            >
              <span style={{ color: T.textMuted }}>{k}</span>
              <span style={{ color: T.textPrimary, fontWeight: 600 }}>{v}</span>
            </div>
          ))}

          <div style={{ marginTop: 14 }}>
            <Image
              src="/logo.png"
              alt="Worklens logo"
              width={210}
              height={80}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "auto",
                marginBottom: 8,
                display: "block",
                borderRadius: 14,
              }}
            />
            <div
              style={{
                background: "linear-gradient(135deg,#1e1b4b,#312e81)",
                borderRadius: 10,
                padding: "12px 10px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 10, color: "#a5b4fc", lineHeight: 1.4 }}>
                AI is transforming the future of work. Analyze. Adapt. Grow.
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════ MAIN CONTENT ═══ */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", minWidth: 0 }}>

        {/* ── HEADER ── */}
        <header
          style={{
            background: T.headerBg,
            borderBottom: `1px solid ${T.cardBorder}`,
            padding: "11px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: T.textPrimary, letterSpacing: 0.5 }}>
              REPORTS
            </div>
            <div style={{ fontSize: 11, color: T.textMuted }}>
              Download, preview and share AI workforce risk analysis reports.
            </div>
          </div>

          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: T.inputBg,
              border: `1px solid ${T.inputBorder}`,
              borderRadius: 8,
              padding: "7px 12px",
              gap: 8,
              width: 200,
            }}
          >
            <span style={{ color: T.textMuted, fontSize: 13 }}>🔍</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 12,
                color: T.textPrimary,
                width: "100%",
              }}
            />
          </div>

          {/* Dark / Light toggle */}
          <button
            onClick={() => setDark(!dark)}
            style={{
              background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
              border: `1px solid ${T.inputBorder}`,
              borderRadius: 8,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 17,
            }}
          >
            {dark ? "🌙" : "☀️"}
          </button>

          {/* Generate report CTA */}
          <button
            style={{
              background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
          >
            + Generate Report
          </button>
        </header>

        {/* ── CONTENT ── */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── KPI SUMMARY ROW ── */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              {
                icon: "📄",
                label: "Reports Available",
                value: "6",
                sub: "Ready to download",
                bg: "linear-gradient(135deg,#6366f1,#818cf8)",
              },
              {
                icon: "📥",
                label: "Total Downloads",
                value: "2,890",
                sub: "Across all reports",
                bg: "linear-gradient(135deg,#22c55e,#4ade80)",
              },
              {
                icon: "🏭",
                label: "Industries Covered",
                value: "8",
                sub: "In benchmark reports",
                bg: "linear-gradient(135deg,#f97316,#fb923c)",
              },
              {
                icon: "📊",
                label: "Dataset Records",
                value: "20,000",
                sub: "Across all reports",
                bg: "linear-gradient(135deg,#3b82f6,#60a5fa)",
              },
              {
                icon: "🔄",
                label: "Last Refresh",
                value: "May 2024",
                sub: "Next refresh: Jun 2024",
                bg: "linear-gradient(135deg,#a855f7,#c084fc)",
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  padding: "14px 14px 12px",
                  background: T.cardBg,
                  border: `1px solid ${T.cardBorder}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.transform = "translateY(0)")
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: kpi.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                    }}
                  >
                    {kpi.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: T.textMuted,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.6,
                    }}
                  >
                    {kpi.label}
                  </div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: T.textPrimary, marginTop: 4 }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: 10, color: T.textMuted }}>{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* ── CATEGORY FILTER TABS ── */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: `1px solid ${isActive ? "#6366f1" : T.cardBorder}`,
                    background: isActive
                      ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                      : T.inputBg,
                    color: isActive ? "#fff" : T.textMuted,
                    fontSize: 11,
                    fontWeight: isActive ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat}
                </button>
              );
            })}
            <span style={{ fontSize: 11, color: T.textMuted, alignSelf: "center", marginLeft: 4 }}>
              {visibleReports.length} report{visibleReports.length !== 1 ? "s" : ""} shown
            </span>
          </div>

          {/* ── REPORT CARDS + SIDEBAR CHARTS ── */}
          <div style={{ display: "flex", gap: 14 }}>

            {/* Report card list */}
            <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 10 }}>

              {visibleReports.length === 0 && (
                <div
                  style={{
                    background: T.cardBg,
                    border: `1px solid ${T.cardBorder}`,
                    borderRadius: 14,
                    padding: 28,
                    textAlign: "center",
                    color: T.textMuted,
                    fontSize: 13,
                  }}
                >
                  No reports match your search. Try a different keyword or category.
                </div>
              )}

              {visibleReports.map((report) => {
                const isDownloading = downloading === report.id;
                return (
                  <div
                    key={report.id}
                    style={{
                      background: T.cardBg,
                      border: `1px solid ${T.cardBorder}`,
                      borderRadius: 14,
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(99,102,241,0.35)";
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = T.cardBorder;
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    }}
                  >
                    {/* Icon badge */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: `${report.accent}18`,
                        border: `1px solid ${report.accent}44`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        flexShrink: 0,
                      }}
                    >
                      {report.icon}
                    </div>

                    {/* Text block */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: T.textPrimary,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {report.title}
                        </span>
                        {/* Category pill */}
                        <span
                          style={{
                            fontSize: 9,
                            background: `${report.accent}20`,
                            color: report.accent,
                            padding: "2px 8px",
                            borderRadius: 5,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {report.category}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: 11,
                          color: T.textSecondary,
                          lineHeight: 1.55,
                          marginBottom: 8,
                        }}
                      >
                        {report.description}
                      </div>

                      {/* Meta row */}
                      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <span style={{ fontSize: 10, color: T.textMuted }}>
                          📄 {report.pages} pages
                        </span>
                        <span style={{ fontSize: 10, color: T.textMuted }}>
                          🗓 {report.lastUpdated}
                        </span>
                        {report.size !== "—" && (
                          <span style={{ fontSize: 10, color: T.textMuted }}>
                            💾 {report.size}
                          </span>
                        )}
                        {/* Status badge */}
                        <span
                          style={{
                            fontSize: 9,
                            background: `${report.statusColor}18`,
                            color: report.statusColor,
                            padding: "2px 8px",
                            borderRadius: 5,
                            fontWeight: 700,
                          }}
                        >
                          {report.status === "Processing" ? "⏳ " : "✅ "}
                          {report.status}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => handleDownload(report.id)}
                        disabled={report.status === "Processing" || isDownloading}
                        style={{
                          background:
                            report.status === "Processing"
                              ? T.inputBg
                              : isDownloading
                              ? "#22c55e"
                              : "linear-gradient(90deg,#6366f1,#8b5cf6)",
                          border: "none",
                          borderRadius: 8,
                          padding: "7px 14px",
                          color:
                            report.status === "Processing"
                              ? T.textMuted
                              : "#fff",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor:
                            report.status === "Processing" || isDownloading
                              ? "not-allowed"
                              : "pointer",
                          transition: "all 0.2s ease",
                          whiteSpace: "nowrap",
                          minWidth: 100,
                          textAlign: "center",
                        }}
                      >
                        {isDownloading
                          ? "✓ Downloaded"
                          : report.status === "Processing"
                          ? "Processing…"
                          : "↓ Download"}
                      </button>
                      <button
                        style={{
                          background: T.inputBg,
                          border: `1px solid ${T.cardBorder}`,
                          borderRadius: 8,
                          padding: "7px 14px",
                          color: T.textSecondary,
                          fontSize: 11,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          textAlign: "center",
                        }}
                      >
                        👁 Preview
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── RIGHT COLUMN: charts ── */}
            <div style={{ flex: "0 0 300px", display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Pie chart — overall risk split */}
              <Card title="Overall Risk Distribution" style={{ flex: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                      <Pie
                        data={riskSummaryPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={55}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {riskSummaryPie.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<DarkTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    {riskSummaryPie.map((r) => (
                      <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: r.color,
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: 10, color: T.textSecondary, flex: 1 }}>
                          {r.name}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: r.color }}>
                          {r.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 10, color: T.textMuted, marginTop: 8 }}>
                  💡 Risk is roughly evenly split — no single category dominates.
                </div>
              </Card>

              {/* Industry high-risk bar */}
              <Card title="High Risk % by Industry" style={{ flex: "none" }}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={industryRiskBar}
                    layout="vertical"
                    margin={{ left: 0, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 55]}
                      tickFormatter={(v) => `${v}%`}
                      tick={{ fill: T.textMuted, fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="industry"
                      tick={{ fill: T.textMuted, fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar dataKey="high" name="High Risk %" radius={[0, 4, 4, 0]}>
                      {industryRiskBar.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4 }}>
                  💡 Manufacturing leads high-risk exposure at 48.2%.
                </div>
              </Card>

              {/* Download trend line chart */}
              <Card title="Report Downloads — Last 6 Months">
                <ResponsiveContainer width="100%" height={130}>
                  <LineChart data={downloadTrend} margin={{ right: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: T.textMuted, fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: T.textMuted, fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<DarkTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="downloads"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#6366f1" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4 }}>
                  💡 May saw the highest download count at 670.
                </div>
              </Card>
            </div>
          </div>

          {/* ── BOTTOM: Insights + Data Coverage ── */}
          <div style={{ display: "flex", gap: 12 }}>

            {/* Key Insights */}
            <Card title="Report Highlights" style={{ flex: 1 }}>
              {[
                [
                  "#6366f1", "📄",
                  "The Full Dataset Report covers all 20,000 records across 16 features — the most comprehensive view of workforce AI risk available.",
                ],
                [
                  "#f97316", "🏭",
                  "The Industry Benchmark reveals Manufacturing leads high-risk exposure at 48.2%, more than double Education's 20.1%.",
                ],
                [
                  "#a855f7", "🎯",
                  "The Career Transition Playbook maps 6 safe career paths with step-by-step 8-month transition roadmaps for at-risk roles.",
                ],
                [
                  "#22c55e", "🤖",
                  "The AI Adoption Correlation Study shows that workers with 15+ AI training hours are 3× less likely to face high layoff risk.",
                ],
                [
                  "#3b82f6", "📊",
                  "Download trends are increasing — May 2024 reached 670 downloads, up 105% from January's baseline of 320.",
                ],
              ].map(([c, icon, text], i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}
                >
                  <span style={{ fontSize: 15, color: c as string, flexShrink: 0, marginTop: 1 }}>
                    {icon}
                  </span>
                  <span style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.6 }}>
                    {text}
                  </span>
                </div>
              ))}
            </Card>

            {/* Data Coverage table */}
            <Card title="Data Coverage per Report" style={{ flex: 1 }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr>
                      {["Report", "Records", "Industries", "Job Roles", "Pages"].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            padding: "6px 10px",
                            color: T.textMuted,
                            fontWeight: 600,
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: 0.6,
                            borderBottom: `1px solid ${T.cardBorder}`,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Full Dataset",        "20,000", "8", "24", "48"],
                      ["Industry Benchmark",  "20,000", "8", "—",  "22"],
                      ["Job Role Disruption", "20,000", "—", "24", "18"],
                      ["AI Adoption Study",   "20,000", "8", "24", "30"],
                      ["Career Playbook",     "—",      "8", "24", "36"],
                      ["Skills Index",        "20,000", "8", "24", "26"],
                    ].map(([name, records, industries, roles, pages], i) => (
                      <tr
                        key={i}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background = dark
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(0,0,0,0.02)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                        }}
                        style={{ transition: "background 0.15s" }}
                      >
                        {[name, records, industries, roles, pages].map((cell, ci) => (
                          <td
                            key={ci}
                            style={{
                              padding: "7px 10px",
                              color: ci === 0 ? T.textPrimary : T.textSecondary,
                              fontWeight: ci === 0 ? 600 : 400,
                              borderBottom: `1px solid ${T.cardBorder}`,
                              fontSize: 11,
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 10, color: T.textMuted, marginTop: 8 }}>
                💡 All reports draw from the same verified dataset. "—" means not applicable.
              </div>
            </Card>

            {/* Quick actions */}
            <Card title="Quick Actions" style={{ flex: "0 0 200px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "📥 Download All Reports", color: "#6366f1" },
                  { label: "📧 Email Report Bundle",  color: "#3b82f6" },
                  { label: "🔗 Share Public Link",    color: "#22c55e" },
                  { label: "🖨 Print Summary",        color: "#a855f7" },
                  { label: "📅 Schedule Auto-Send",   color: "#f97316" },
                ].map((action) => (
                  <button
                    key={action.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 9,
                      border: `1px solid ${T.cardBorder}`,
                      background: T.inputBg,
                      color: T.textSecondary,
                      fontSize: 11,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = action.color;
                      (e.currentTarget as HTMLButtonElement).style.color = action.color;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = T.cardBorder;
                      (e.currentTarget as HTMLButtonElement).style.color = T.textSecondary;
                    }}
                  >
                    {action.label}
                  </button>
                ))}

                <div
                  style={{
                    marginTop: 6,
                    padding: "10px",
                    background: dark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.04)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: 9,
                    fontSize: 10,
                    color: "#a5b4fc",
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}
                >
                  📌 Reports refresh every 30 days aligned with dataset updates.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Global styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: #64748b; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
}