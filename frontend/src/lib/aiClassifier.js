/**
 * LLM AI Agent Classification & Dispatch Engine
 * CampusAI Maintenance Portal
 * 
 * Features:
 * 1. LLM AI Agent using Prompt Engineering, Few-Shot Examples & Structured JSON Outputs.
 * 2. Supported integrations for OpenAI, Gemini, Groq, Ollama, and n8n Webhook workflows.
 * 3. Strict 4-Category System: Complaint, Issue, Feedback, Compliment.
 * 4. Strict 4-Urgency System: Low, Medium, High, Critical.
 * 5. Robust JSON Schema validation and fallback parsing.
 */

import { analyzeReportWithAIAgent, runLocalAIAgentParser, validateAndNormalizeAIResponse } from './aiAgentService.js';

export { runLocalAIAgentParser, validateAndNormalizeAIResponse };

/**
 * Extract location helper
 */
export function extractLocation(text = '') {
  const parsed = runLocalAIAgentParser(text);
  if (!parsed.location) return null;
  return {
    hostel_block: parsed.location,
    floor: null,
    wing: null,
    room: null,
    additional_location: null
  };
}

/**
 * Main AI Agent Classifier Local Interface
 */
export function classifyComplaintLocal(text = '') {
  const result = runLocalAIAgentParser(text);
  return {
    original_text: text,
    category: result.category,
    urgency: result.urgency,
    priority: result.urgency.toLowerCase(),
    summary: result.summary,
    issue_summary: result.summary,
    location: result.location ? { hostel_block: result.location } : null,
    department: result.department || 'Administration',
    problem: result.problem,
    suggested_action: result.suggested_action,
    confidence: 0.94,
    routing_status: 'auto_routed',
    reason: `Classified as ${result.category} (${result.urgency} urgency) by AI Agent and routed to ${result.department || 'Administration'}.`
  };
}

/**
 * Async AI Classifier entrypoint supporting n8n & direct LLM APIs
 */
export async function classifyComplaintAI(rawText = '', options = {}) {
  const aiResult = await analyzeReportWithAIAgent(rawText, options);

  return {
    original_text: rawText,
    category: aiResult.category,
    urgency: aiResult.urgency,
    priority: aiResult.urgency.toLowerCase(),
    summary: aiResult.summary,
    issue_summary: aiResult.summary,
    location: aiResult.location ? { hostel_block: aiResult.location } : null,
    department: aiResult.department || 'Administration',
    problem: aiResult.problem,
    suggested_action: aiResult.suggested_action,
    confidence: aiResult.confidence || 0.96,
    routing_status: 'auto_routed',
    reason: `Analyzed by LLM AI Agent (${aiResult.source}) → ${aiResult.category} (${aiResult.urgency} urgency) assigned to ${aiResult.department || 'Administration'}.`,
    source: aiResult.source,
    ai_analysis_timestamp: aiResult.ai_analysis_timestamp
  };
}
