# feedBox AI — Intelligent Campus Maintenance & Operations Portal 🚀



**feedBox AI** is an AI-powered college campus issue reporting, feedback classification, and automated department routing platform. It connects students and campus facility administration into a unified, friction-free maintenance ecosystem.

---

## ✨ Features

- **🤖 Autonomous AI Classification & Dispatch**: Automatically analyzes user issue reports using LLM prompt engineering, few-shot reasoning, and fallback natural language parsers to classify intent (**Complaint**, **Issue**, **Feedback**, **Compliment**), extract exact physical locations, assign urgency levels (**Low**, **Medium**, **High**, **Critical**), and route to 1 of 9 campus departments.
- **🎓 Dual-Role Dashboard & RLS Security**: 
  - **Student Portal**: Submit complaints, attach photos, track real-time status timelines, and leave comments.
  - **Department Admin Desk**: Role-based access control with department-specific ticket queues (CTS, Maintenance, Hostel, Placement, Admin, Exams, Finance, Academic, Student Welfare).
- **📊 Real-Time Status & History Log**: Audit logs for every status change, technician dispatch note, and resolution timestamp.
- **⚡ n8n & LLM Webhook Integration**: Full workflow orchestration support via n8n automation or direct LLM APIs (OpenAI / Groq / Ollama / Gemini).

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, TailwindCSS 4, Material Symbols & Google Fonts
- **Backend / DB Adapter**: Supabase (PostgreSQL with RLS) & LocalStorage Offline Fallback State
- **AI Engine**: LLM Prompt Engineering, Few-Shot Reasoning & Schema Validation (`aiAgentService.js`)
- **Workflow Automation**: n8n Webhook Engine (`n8n/complaint-classification-workflow.json`)

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run AI Agent Automated Verification Tests
```bash
npm run test:ai
```

---

## 📑 Project Structure

```
├── frontend/
│   ├── index.html                  # HTML Shell & feedBox AI Favicon
│   ├── public/
│   │   └── favicon.svg             # Modern feedBox AI Favicon
│   └── src/
│       ├── components/             # React UI components (Header, Footer, Dashboards)
│       ├── lib/                    # Supabase client & AI Agent service
│       └── tests/                  # Automated AI classification test suite
├── n8n/                            # n8n Workflow JSON & Documentation
├── scripts/                        # Model test & schema verification scripts
├── supabase/                       # Supabase PostgreSQL schema & seed data
└── README.md                       # Main Project Documentation
```

---

## 🔒 Security & Anti-Hallucination

- **Anti-Hallucination Guards**: If location is not explicitly mentioned in report text, the AI Agent outputs `null` rather than inventing false locations.
- **Strict JSON Schema Validation**: Backend validates AI Agent JSON output before persisting to storage.
