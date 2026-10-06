# n8n AI Complaint Classification & Routing Workflow

This directory contains the n8n workflow configuration for the **CampusAI Complaint, Feedback & Report Classification and Routing System**.

## 🚀 Overview

The workflow receives natural-language student complaints via Webhook, performs AI classification & location extraction using an LLM node, validates confidence score thresholds (`>= 0.70`), handles multi-issue splitting, and routes tickets to department queues (CTS, Hostel Committee, Security, Academic, Accounts, Mess, Transport, Administration).

---

## 🛠️ Architecture & Flow

```
Student Complaint Form (Frontend)
       ↓
Backend API Adapter / Webhook Proxy
       ↓
n8n Webhook Endpoint (/webhook/classify-complaint)
       ↓
Validate & Normalize Payload
       ↓
AI LLM Structured Extraction Node (JSON format)
       ↓
Confidence Score Check (Threshold: >= 0.70)
  ├── < 0.70  ➜ Route to "manual_review" Queue
  └── >= 0.70 ➜ Multi-Issue Check
                    ├── Multiple Issues ➜ Split Out Item List
                    └── Single Issue    ➜ Department Router
                                              ↓
                                     Urgent Priority Check
                                              ↓
                                 Database Insert & Return Payload
```

---

## 📋 Webhook Payload Specification

### Incoming Webhook Request (`POST /webhook/classify-complaint`)

```json
{
  "complaint_id": "TICK-8842",
  "user_id": "user-21cs042",
  "text": "My door latch is broken and want to replace it as soon as possible in block 3 7th floor B 701",
  "submitted_at": "2026-10-06T15:30:00.000Z"
}
```

### Expected Structured Output Response

```json
{
  "original_text": "My door latch is broken and want to replace it as soon as possible in block 3 7th floor B 701",
  "intent_type": "complaint",
  "category": "carpenter",
  "subcategory": "door_latch",
  "department": "Hostel Committee",
  "priority": "urgent",
  "issue_summary": "Door latch is broken and needs replacement",
  "requested_action": "Repair or replace door latch",
  "location": {
    "hostel_block": "Block 3",
    "floor": "7",
    "wing": "B",
    "room": "B701",
    "additional_location": null
  },
  "confidence": 0.97,
  "routing_status": "auto_routed",
  "reason": "Classified as carpenter (door_latch) issue and automatically routed to Hostel Committee."
}
```

---

## ⚙️ How to Import into n8n

1. Open your **n8n Instance** (Local or Cloud).
2. Go to **Workflows** → Click **Import from File**.
3. Select `n8n/complaint-classification-workflow.json`.
4. Configure your AI Model credentials (e.g. OpenAI / Anthropic / Local LLM) inside the **AI LLM Classification Node**.
5. Set environment variable in `frontend/.env`:
   ```env
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/classify-complaint
   ```
6. If `VITE_N8N_WEBHOOK_URL` is omitted or unavailable, the application automatically uses the embedded deterministic AI Classification engine in `frontend/src/lib/aiClassifier.js`.
