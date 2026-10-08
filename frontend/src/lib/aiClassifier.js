/**
 * LLM AI Agent Classification & Dispatch Engine
 * CampusAI Maintenance Portal
 */

import { analyzeReportWithAIAgent, runLocalAIAgentParser, validateAndNormalizeAIResponse } from './aiAgentService.js';

export { runLocalAIAgentParser, validateAndNormalizeAIResponse };

/**
 * Extract location helper
 */
export function extractLocation(text = '') {
  const parsed = runLocalAIAgentParser(text);
  return parsed.location || null;
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
    location: result.location,
    department: result.department || 'Administration',
    problem: result.problem,
    suggested_action: result.suggested_action,
    confidence: 0.94,
    routing_status: 'auto_routed',
    reason: `Assigned to ${result.department || 'Administration'} (${result.urgency} urgency).`
  };
}

/**
 * Async AI Classifier entrypoint supporting n8n & direct LLM APIs
 */
export async function classifyComplaintAI(rawText = '', options = {}) {
  const aiResult = await analyzeReportWithAIAgent(rawText, options);

  const locationString = typeof aiResult.location === 'string'
    ? aiResult.location
    : (aiResult.location && typeof aiResult.location === 'object'
        ? Object.values(aiResult.location).filter(Boolean).join(', ')
        : null);

  return {
    original_text: rawText,
    category: aiResult.category,
    urgency: aiResult.urgency,
    priority: aiResult.urgency.toLowerCase(),
    summary: aiResult.summary,
    issue_summary: aiResult.summary,
    location: locationString,
    department: aiResult.department || 'Administration',
    problem: aiResult.problem,
    suggested_action: aiResult.suggested_action,
    confidence: aiResult.confidence || 0.96,
    routing_status: 'auto_routed',
    reason: `Assigned to ${aiResult.department || 'Administration'} (${aiResult.urgency} urgency).`,
    source: aiResult.source,
    ai_analysis_timestamp: aiResult.ai_analysis_timestamp
  };
}
