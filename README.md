<div align="center">

<img src="public/logo.png" alt="Worklens AI Logo" width="90" />

# Worklens AI

### Enterprise Workforce Risk Analytics Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-RandomForest-F7931E?style=flat-square&logo=scikit-learn)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1?style=flat-square)](LICENSE)

*Predict. Analyze. Adapt.*

</div>

---

## What is Worklens AI?

Worklens AI is a full-stack analytics platform that helps organizations, HR teams, and individuals understand how artificial intelligence and automation are reshaping the workforce. It combines a trained machine learning model with an interactive dashboard to surface layoff risk insights — by industry, job role, AI adoption level, and individual employee profile.

The platform does not just show charts. It tells you *why* certain roles are at risk, *what skills offer protection*, and *what actions can reduce exposure* — all grounded in real data.

---

## The Problem We're Solving

AI and automation are eliminating and transforming jobs at an accelerating pace. Yet most organizations lack the tools to quantify this risk at the employee or role level. Worklens AI bridges that gap by turning workforce data into actionable risk intelligence.

---

## Dataset

The platform is powered by a curated dataset of **20,000 employee profiles** spanning multiple industries, job roles, and experience levels.

| Property | Detail |
|---|---|
| Total Records | 20,000 |
| Features | 15 input columns |
| Target Variable | `Layoff_Risk` — High / Medium / Low |
| Source | AI Impact on Jobs & Layoff Risk Dataset |

### Class Distribution

```
High Risk    →  6,797  employees  (34.0%)
Medium Risk  →  6,601  employees  (33.0%)
Low Risk     →  6,602  employees  (33.0%)
```

The dataset is well-balanced across all three classes, which ensures the model does not develop a bias toward any single risk category.

### Key Features Used for Prediction

| Feature | What It Captures |
|---|---|
| `Routine_Task_Percentage` | How much of the job is repetitive and automatable |
| `Tasks_Automated_Percentage` | Degree of automation already in place |
| `Creativity_Requirement` | How much original thinking the role demands |
| `Human_Interaction_Level` | Extent of collaboration and interpersonal work |
| `AI_Usage_Hours_Per_Week` | How actively the employee uses AI tools |
| `AI_Training_Hours` | Investment in learning AI-related skills |
| `Years_of_Experience` | Seniority and adaptability proxy |
| `Job_Level` | Entry / Mid / Senior role classification |
| `AI_Adoption_Level` | Organizational AI adoption maturity |
| `Industry` | Sector-level automation exposure |

---

## Machine Learning Model

The core prediction engine is a **Random Forest Classifier** trained on the full dataset using a structured scikit-learn pipeline.

### Architecture

```
Raw Data
   ↓
Numeric Features  →  StandardScaler
Categorical Features  →  OneHotEncoder
   ↓
Random Forest Classifier (100 decision trees)
   ↓
Prediction: High / Medium / Low
```

### Model Performance

| Metric | Value |
|---|---|
| **Test Accuracy** | **90.33%** |
| Cross-Validation Mean (5-Fold) | 89.84% |
| Cross-Validation Std Dev | ± 0.42% |
| Training Set | 16,000 records |
| Test Set | 4,000 records |

### Per-Class Results

| Risk Class | Precision | Recall | F1-Score | Support |
|---|---|---|---|---|
| **High** | 92.6% | 93.4% | 93.0% | 1,360 |
| **Low** | 92.8% | 92.3% | 92.6% | 1,320 |
| **Medium** | 85.5% | 85.2% | 85.3% | 1,320 |
| **Overall** | 90.3% | 90.3% | 90.3% | 4,000 |

> The model achieves over 90% accuracy and generalizes excellently across all five cross-validation folds, with a standard deviation of just ±0.42% — indicating a stable, reliable model.

### Top Predictive Features

The Random Forest identified these as the most influential factors in determining layoff risk:

```
1. Routine_Task_Percentage       0.1763  ████████████████████
2. Tasks_Automated_Percentage    0.1393  ████████████████
3. Creativity_Requirement        0.1184  █████████████
4. Human_Interaction_Level       0.0522  ██████
5. AI_Usage_Hours_Per_Week       0.0497  █████
6. Job_Level (Senior/Entry)      0.0407  ████
7. Years_of_Experience           0.0386  ████
8. AI_Training_Hours             0.0374  ████
```

**Key Insight:** The top three features alone account for over 43% of predictive power — roles high in routine tasks and automation exposure, with low creativity demands, are disproportionately at risk.

---

## Platform Features

- **AI Risk Predictor** — Enter any employee profile and get an instant High/Medium/Low risk score with probability breakdown
- **Industry Insights** — Risk comparison across Manufacturing, Finance, Healthcare, IT, Retail, and more
- **Job Role Analysis** — Top 10 highest-risk roles with percentage rankings
- **Automation Impact Chart** — Visual mapping of task automation levels against risk distribution
- **Human Skills Protection Index** — Scores roles by creativity and human interaction to identify AI-resilient careers
- **Career Recommendations** — Personalized upskilling pathways based on risk profile
- **Dark / Light Mode** — Full theme toggle across the entire platform
- **Interactive Dashboard** — KPI cards, sparklines, and multi-chart analytics in one view

---

## Key Findings from the Data

- **34% of the 20,000 workforce profiles are at High Risk** of AI-driven displacement
- **Manufacturing, Logistics, and Retail** show the highest sector-level risk exposure
- **Higher AI adoption correlates with lower layoff risk** — workers who use AI tools are better protected
- **More AI training hours consistently reduces risk** — even moderate upskilling has a measurable protective effect
- **Roles requiring creativity and human interaction** (Nurses, Teachers, Store Managers) rank highest on the protection index
- **Entry-level workers (0–2 years experience)** face disproportionately higher risk at 45.2% High Risk compared to 30% for senior employees

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Recharts |
| Backend | Node.js, Express.js |
| ML Engine | Python, FastAPI, scikit-learn |
| Model | Random Forest Classifier (joblib) |
| Styling | Tailwind CSS + Glassmorphism dark theme |

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with purpose by the **Worklens AI Team**

*AI is transforming the future of work. Analyze. Adapt. Grow.*

⭐ Star this repository if you find it useful

</div>
