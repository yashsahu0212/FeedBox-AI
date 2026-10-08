# n8n LLM AI Maintenance Agent Workflow

This directory contains the n8n workflow configuration for the **CampusAI Maintenance Portal**.

## 🚀 Overview

The project uses an **LLM-powered AI Agent** that uses prompt engineering, few-shot examples, structured outputs, and backend validation to automatically classify and prioritize maintenance reports submitted by students and staff.

---

## 🛠️ Architecture & Flow

```
User Report (Frontend Form)
       ↓
Backend API Adapter (aiAgentService.js)
       ↓
n8n Webhook Endpoint (/webhook/classify-complaint) OR LLM API (OpenAI/Groq/Ollama)
       ↓
LLM System Prompt & Few-Shot Reasoning
       ↓
Strict JSON Output Generation
       ↓
Backend JSON Schema Validation
       ↓
PostgreSQL / Supabase Storage & Admin Override
```

---

## 📋 Structured JSON Output Schema

When a report is analyzed, the AI Agent returns:

```json
{
  "category": "Issue",
  "urgency": "High",
  "summary": "The AC in Block A classroom is not functioning.",
  "location": "Block A, Room 204",
  "department": "Maintenance",
  "problem": "AC is not cooling",
  "suggested_action": "Inspect and repair the AC unit"
}
```

### Core Classification Rules

#### Categories (Exactly One):
- **Complaint**: Expressing dissatisfaction or poor service quality.
- **Issue**: Specific physical, electrical, plumbing, or IT malfunction/breakdown.
- **Feedback**: Constructive recommendations or suggestions for improvement.
- **Compliment**: Praise or appreciation for fast service and staff efforts.

#### Urgency Levels (Exactly One):
- **Critical**: Safety hazards, sparks, fire risk, severe water flooding, structural danger.
- **High**: Significant impact on ongoing classes, exams, or major user groups.
- **Medium**: Important maintenance issues without immediate safety danger.
- **Low**: Minor cosmetic defects, non-urgent requests, or compliments.

---

## ⚙️ Environment Configuration

Set the environment variables in `frontend/.env`:

```env
# Option 1: n8n Webhook Integration
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/classify-complaint

# Option 2: Direct LLM API Provider (OpenAI / Groq / Ollama / Gemini)
VITE_LLM_PROVIDER=openai
VITE_LLM_API_KEY=your-api-key-here
VITE_LLM_MODEL=gpt-4o-mini
```

If neither API key nor n8n URL is set, the application uses the built-in deterministic **Local AI Agent Parser** to execute the system prompt rules offline and produce schema-compliant JSON.
