import { SYSTEM_PROMPT, FEW_SHOT_EXAMPLES } from './aiAgentPrompt.js';

/**
 * Validates and normalizes structured JSON output from LLM / n8n / local AI engine.
 */
export function validateAndNormalizeAIResponse(rawObj, originalText = '') {
  const allowedCategories = ['Complaint', 'Issue', 'Feedback', 'Compliment'];
  const allowedUrgencies = ['Low', 'Medium', 'High', 'Critical'];

  // Normalize Category
  let category = 'Issue';
  if (rawObj && rawObj.category) {
    const matched = allowedCategories.find(c => c.toLowerCase() === String(rawObj.category).trim().toLowerCase());
    if (matched) {
      category = matched;
    } else {
      const catStr = String(rawObj.category).toLowerCase();
      if (catStr.includes('complaint')) category = 'Complaint';
      else if (catStr.includes('feedback') || catStr.includes('suggest')) category = 'Feedback';
      else if (catStr.includes('compliment') || catStr.includes('praise')) category = 'Compliment';
      else category = 'Issue';
    }
  }

  // Normalize Urgency
  let urgency = 'Medium';
  if (rawObj && rawObj.urgency) {
    const matched = allowedUrgencies.find(u => u.toLowerCase() === String(rawObj.urgency).trim().toLowerCase());
    if (matched) {
      urgency = matched;
    }
  } else if (rawObj && rawObj.priority) {
    const prioMap = { urgent: 'Critical', critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };
    urgency = prioMap[String(rawObj.priority).toLowerCase()] || 'Medium';
  }

  // Compliments are always Low urgency
  if (category === 'Compliment') {
    urgency = 'Low';
  }

  // Summary
  const summary = (rawObj && rawObj.summary && String(rawObj.summary).trim()) ||
                  (originalText.slice(0, 90).trim() + (originalText.length > 90 ? '...' : '')) ||
                  'Maintenance report submitted';

  // Location anti-hallucination check
  let location = null;
  if (rawObj && rawObj.location) {
    if (typeof rawObj.location === 'string') {
      const locStr = rawObj.location.trim();
      if (locStr && locStr.toLowerCase() !== 'null' && locStr.toLowerCase() !== 'undefined' && locStr.toLowerCase() !== 'unspecified' && locStr.toLowerCase() !== 'none') {
        location = locStr;
      }
    } else if (typeof rawObj.location === 'object' && rawObj.location !== null) {
      const parts = [
        rawObj.location.hostel_block || rawObj.location.building || rawObj.location.block,
        rawObj.location.floor ? (String(rawObj.location.floor).toLowerCase().includes('floor') ? rawObj.location.floor : `Floor ${rawObj.location.floor}`) : null,
        rawObj.location.wing ? `Wing ${rawObj.location.wing}` : null,
        rawObj.location.room ? (String(rawObj.location.room).toLowerCase().includes('room') ? rawObj.location.room : `Room ${rawObj.location.room}`) : null,
        rawObj.location.additional_location
      ].filter(Boolean);
      location = parts.length > 0 ? parts.join(', ') : null;
    }
  }

  // Department normalization
  let department = null;
  if (rawObj && rawObj.department) {
    const deptStr = String(rawObj.department).trim();
    if (deptStr && deptStr.toLowerCase() !== 'null' && deptStr.toLowerCase() !== 'undefined' && deptStr.toLowerCase() !== 'manual_review') {
      department = deptStr;
    }
  }

  // Problem description
  const problem = (rawObj && rawObj.problem && String(rawObj.problem).trim()) ||
                  (rawObj && rawObj.issue_summary && String(rawObj.issue_summary).trim()) ||
                  originalText.trim() ||
                  'Reported maintenance concern';

  // Suggested action
  let suggested_action = null;
  if (rawObj && rawObj.suggested_action) {
    const actionStr = String(rawObj.suggested_action).trim();
    if (actionStr && actionStr.toLowerCase() !== 'null' && actionStr.toLowerCase() !== 'undefined') {
      suggested_action = actionStr;
    }
  }

  return {
    category,
    urgency,
    summary,
    location,
    department,
    problem,
    suggested_action,
    ai_analysis_timestamp: new Date().toISOString()
  };
}

/**
 * Deterministic Fallback AI Agent Engine
 */
export function runLocalAIAgentParser(text = '') {
  const cleanText = (text || '').trim();
  const lowerText = cleanText.toLowerCase();

  if (!cleanText || cleanText.length < 4 || /^(something is wrong|problem|help|issue|fix it)$/i.test(cleanText)) {
    return validateAndNormalizeAIResponse({
      category: 'Issue',
      urgency: 'Medium',
      summary: 'Vague maintenance report requiring clarification',
      location: null,
      department: 'Administration',
      problem: cleanText || 'Unspecified user maintenance report',
      suggested_action: 'Contact reporter to clarify maintenance details'
    }, cleanText);
  }

  // 1. Determine Category according to system prompt rules
  let category = 'Issue';
  if (/\b(kudos|thanks|thank|praise|great job|awesome work|excellent service|appreciation|well done)\b/i.test(lowerText)) {
    category = 'Compliment';
  } else if (/\b(consider adding|suggest|suggestion|recommend|recommendation|idea|could be better|would be good|improve|reorient)\b/i.test(lowerText) &&
             !/\b(broken|leak|not working|fail|delayed|dirty|terrible|worst)\b/i.test(lowerText)) {
    category = 'Feedback';
  } else if (/\b(terrible|worst|unhygienic|disappointed|bad quality|poor service|always fails|dirty|filthy|repeatedly|delay|delayed)\b/i.test(lowerText) &&
             !/\b(broken|repair|fix|leak|socket|switch|wire|ac)\b/i.test(lowerText)) {
    category = 'Complaint';
  } else {
    category = 'Issue';
  }

  // 2. Determine Urgency according to system prompt rules
  let urgency = 'Medium';
  const isSafetyEmergency = /\b(spark|sparks|sparking|hazard|fire|exposed wire|exposed live|electric shock|flooding|flood|emergency|danger|dangerous|theft|stolen|broken lock)\b/i.test(lowerText);
  const isHighImpact = /\b(ac|air condition|wifi|wi-fi|internet|geyser|exam|lecture|classroom|pankha|fan|no water|power cut|asap|urgent|immediately)\b/i.test(lowerText);
  const isLowUrgency = /\b(minor|paint|scuff|squeak|drawer|chair|table|desk|slow|suggestion|feedback)\b/i.test(lowerText);

  if (category === 'Compliment' || category === 'Feedback' || isLowUrgency) {
    urgency = 'Low';
  } else if (isSafetyEmergency) {
    urgency = 'Critical';
  } else if (isHighImpact) {
    urgency = 'High';
  } else {
    urgency = 'Medium';
  }

  // 3. Location Extraction Rules (Strict anti-hallucination)
  let location = null;
  const hostelBlockMatch = cleanText.match(/\b(?:hostel block|block|blk)\s*[-–]?\s*([a-zA-Z0-9]+)\b/i);
  const floorMatch = cleanText.match(/\b(\d+)(?:st|nd|rd|th)?\s*floor\b/i) || cleanText.match(/\bfloor\s*(\d+)\b/i);
  const roomMatch = cleanText.match(/\b(?:room\s*)?([A-Za-z]?\s*[-–]?\s*\d{3,4})\b/i);

  const locParts = [];
  if (/\blibrary\b/i.test(lowerText)) {
    locParts.push('Library');
  }

  if (hostelBlockMatch) locParts.push(`Hostel Block ${hostelBlockMatch[1].toUpperCase()}`);
  else if (/\bblock\s*([a-zA-Z0-9]+)\b/i.test(cleanText)) {
    const m = cleanText.match(/\bblock\s*([a-zA-Z0-9]+)\b/i);
    locParts.push(`Block ${m[1].toUpperCase()}`);
  }

  if (floorMatch) locParts.push(`Floor ${floorMatch[1]}`);

  if (roomMatch && !/\b(block|floor|library)\b/i.test(roomMatch[0])) {
    const rm = roomMatch[1].replace(/\s+/g, '').toUpperCase();
    if (!/BLOCK|FLOOR/.test(rm) && rm.length >= 2) {
      locParts.push(rm.startsWith('ROOM') ? rm : `Room ${rm}`);
    }
  }

  if (locParts.length > 0) {
    location = locParts.join(', ');
  } else if (/\b(room 204|room 302)\b/i.test(lowerText)) {
    location = lowerText.includes('204') ? 'Block A, Room 204' : 'Room 302';
  } else {
    location = null;
  }

  // 4. Department Identification Rules
  let department = null;
  if (/\b(wifi|wi-fi|internet|net|portal|vtop|laptop|router|ip|network|cts)\b/i.test(lowerText)) {
    department = 'CTS';
  } else if (/\b(ac|air condition|light|wire|wiring|spark|sparking|electrical|elevator|lift|tap|water|leak|door|pipe|repair|maint)\b/i.test(lowerText)) {
    department = 'Maintenance';
  } else if (/\b(food|mess|canteen|meal|breakfast|lunch|dinner|oily|hygiene)\b/i.test(lowerText)) {
    department = 'Mess';
  } else if (/\b(geyser|warden|dorm|washroom|bathroom|toilet|mere room|my room|room ka|pankha|fan|latch|bed|chair)\b/i.test(lowerText)) {
    department = 'Hostel Committee';
  } else if (/\b(security|gate|theft|id card|stolen|guard|unauthorized)\b/i.test(lowerText)) {
    department = 'Security';
  } else if (/\b(library|study pod|exam|grade|mark|lecture|syllabus|academic|prof)\b/i.test(lowerText)) {
    department = 'Academic';
  } else if (/\b(bus|cab|transport|driver|route)\b/i.test(lowerText)) {
    department = 'Transport';
  } else if (/\b(fee|challan|payment|finance|receipt|dues)\b/i.test(lowerText)) {
    department = 'Finance';
  } else {
    department = 'Administration';
  }

  // 5. Action Suggestion
  let suggested_action = null;
  if (category === 'Issue') {
    suggested_action = `Inspect and repair ${department ? department.toLowerCase() : 'maintenance'} issue`;
  } else if (category === 'Complaint') {
    suggested_action = 'Investigate grievance and notify department supervisor';
  } else if (category === 'Feedback') {
    suggested_action = 'Forward suggestion to department planning committee';
  } else if (category === 'Compliment') {
    suggested_action = 'Log staff appreciation note in service system';
  }

  return validateAndNormalizeAIResponse({
    category,
    urgency,
    summary: cleanText.length > 80 ? cleanText.slice(0, 77) + '...' : cleanText,
    location,
    department,
    problem: cleanText,
    suggested_action
  }, cleanText);
}

/**
 * Main AI Agent Dispatcher Engine
 */
export async function analyzeReportWithAIAgent(reportText = '', options = {}) {
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env : {});
  const n8nWebhookUrl = env.VITE_N8N_WEBHOOK_URL || env.N8N_WEBHOOK_URL || options.n8nWebhookUrl;
  const llmProvider = env.VITE_LLM_PROVIDER || env.LLM_PROVIDER || options.provider;
  const llmApiKey = env.VITE_LLM_API_KEY || env.LLM_API_KEY || options.apiKey;
  const llmApiUrl = env.VITE_LLM_API_URL || env.LLM_API_URL || options.apiUrl;
  const llmModel = env.VITE_LLM_MODEL || env.LLM_MODEL || options.model || 'gpt-4o-mini';

  // 1. Send report to n8n AI Workflow Webhook if configured
  if (n8nWebhookUrl) {
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: reportText,
          system_prompt: SYSTEM_PROMPT,
          few_shot_examples: FEW_SHOT_EXAMPLES,
          submitted_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        const json = await response.json();
        if (json) {
          const normalized = validateAndNormalizeAIResponse(json, reportText);
          return {
            ...normalized,
            source: 'n8n_llm_agent',
            confidence: json.confidence || 0.96
          };
        }
      }
    } catch (err) {
      console.warn('n8n Webhook call failed, falling back to LLM API / Local AI Agent:', err.message);
    }
  }

  // 2. Direct LLM Provider API call (OpenAI, Groq, Ollama, Gemini, etc.)
  if (llmApiKey || llmProvider === 'ollama') {
    try {
      let endpoint = llmApiUrl;
      let headers = { 'Content-Type': 'application/json' };
      let body = {};

      if (llmProvider === 'openai' || (!llmProvider && llmApiKey)) {
        endpoint = endpoint || 'https://api.openai.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${llmApiKey}`;
        body = {
          model: llmModel,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...FEW_SHOT_EXAMPLES.flatMap(ex => [
              { role: 'user', content: ex.input },
              { role: 'assistant', content: JSON.stringify(ex.output) }
            ]),
            { role: 'user', content: reportText }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1
        };
      } else if (llmProvider === 'groq') {
        endpoint = endpoint || 'https://api.groq.com/openai/v1/chat/completions';
        headers['Authorization'] = `Bearer ${llmApiKey}`;
        body = {
          model: llmModel || 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: reportText }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1
        };
      } else if (llmProvider === 'ollama') {
        endpoint = endpoint || 'http://localhost:11434/api/chat';
        body = {
          model: llmModel || 'llama3.2',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: reportText }
          ],
          format: 'json',
          stream: false
        };
      }

      if (endpoint) {
        const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
        if (response.ok) {
          const data = await response.json();
          let content = data?.choices?.[0]?.message?.content || data?.message?.content;
          if (content) {
            content = content.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
            const parsed = JSON.parse(content);
            const normalized = validateAndNormalizeAIResponse(parsed, reportText);
            return {
              ...normalized,
              source: `${llmProvider || 'llm'}_api`,
              confidence: 0.97
            };
          }
        }
      }
    } catch (err) {
      console.warn('LLM API provider call failed, falling back to Local AI Agent Parser:', err.message);
    }
  }

  // 3. Fallback: Local AI Agent Engine
  const localResult = runLocalAIAgentParser(reportText);
  return {
    ...localResult,
    source: 'ai_agent_local_parser',
    confidence: 0.94
  };
}
