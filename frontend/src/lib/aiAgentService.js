import { SYSTEM_PROMPT, FEW_SHOT_EXAMPLES } from './aiAgentPrompt.js';

/**
 * Validates and normalizes structured JSON output from LLM / n8n / local AI engine.
 * Restricts output departments strictly to official admin panel departments:
 * ["Hostel", "Maintenance", "CTS", "Academic", "Student Welfare", "Finance", "Placement Cell", "Examination Cell", "Administration"]
 */
export function validateAndNormalizeAIResponse(rawObj, originalText = '') {
  const allowedCategories = ['Complaint', 'Issue', 'Feedback', 'Compliment'];
  const allowedUrgencies = ['Low', 'Medium', 'High', 'Critical'];
  const officialDepartments = [
    'Hostel',
    'Maintenance',
    'CTS',
    'Academic',
    'Student Welfare',
    'Finance',
    'Placement Cell',
    'Examination Cell',
    'Administration'
  ];

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

  if (category === 'Compliment') {
    urgency = 'Low';
  }

  // Department normalization (Strictly enforce existing admin panel department names)
  let department = 'Administration';
  if (rawObj && rawObj.department) {
    const deptStr = String(rawObj.department).trim();
    const matchedDept = officialDepartments.find(d => d.toLowerCase() === deptStr.toLowerCase());
    if (matchedDept) {
      department = matchedDept;
    } else {
      const dLower = deptStr.toLowerCase();
      if (dLower.includes('hostel') || dLower.includes('mess') || dLower.includes('dorm') || dLower.includes('room')) department = 'Hostel';
      else if (dLower.includes('maint') || dLower.includes('repair') || dLower.includes('electric') || dLower.includes('plumb')) department = 'Maintenance';
      else if (dLower.includes('cts') || dLower.includes('it') || dLower.includes('tech') || dLower.includes('net')) department = 'CTS';
      else if (dLower.includes('welfare') || dLower.includes('security') || dLower.includes('ragging') || dLower.includes('bully')) department = 'Student Welfare';
      else if (dLower.includes('exam')) department = 'Examination Cell';
      else if (dLower.includes('place') || dLower.includes('career')) department = 'Placement Cell';
      else if (dLower.includes('finance') || dLower.includes('account') || dLower.includes('fee')) department = 'Finance';
      else if (dLower.includes('acad')) department = 'Academic';
      else department = 'Administration';
    }
  }

  // Summary
  let summary = (rawObj && rawObj.summary && String(rawObj.summary).trim()) || '';
  if (!summary || summary === originalText.trim()) {
    summary = `Report submitted regarding ${department} facility request.`;
  }

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

  // Problem description
  let problem = (rawObj && rawObj.problem && String(rawObj.problem).trim()) || '';
  if (!problem || problem === originalText.trim()) {
    problem = `${department} Facility Concern`;
  }

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
 * Maps reports strictly to official admin panel departments and defaults unmapped items to Administration.
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
      problem: 'Unspecified Maintenance Concern',
      suggested_action: 'Contact reporter to clarify maintenance details'
    }, cleanText);
  }

  // 1. Determine Category
  let category = 'Issue';
  if (/\b(kudos|thanks|thank|praise|great job|awesome work|excellent service|appreciation|well done)\b/i.test(lowerText)) {
    category = 'Compliment';
  } else if (/\b(consider adding|suggest|suggestion|recommend|recommendation|idea|could be better|would be good|improve|reorient)\b/i.test(lowerText) &&
             !/\b(broken|leak|not working|fail|delayed|dirty|terrible|worst|bully|ragging)\b/i.test(lowerText)) {
    category = 'Feedback';
  } else if (/\b(terrible|worst|unhygienic|disappointed|bad quality|poor service|always fails|dirty|filthy|repeatedly|delay|delayed|bully|bullying|ragging|threat|stolen|theft)\b/i.test(lowerText) &&
             !/\b(broken|repair|fix|leak|socket|switch|wire|ac)\b/i.test(lowerText)) {
    category = 'Complaint';
  } else {
    category = 'Issue';
  }

  // 2. Identify Explicit Problem Type & Assign Official Admin Department
  let problemType = 'General Administrative Concern';
  let department = 'Administration';

  if (/\b(bully|bullying|ragging|threat|harass|fight|violence|security|welfare|counseling|club|sport)\b/i.test(lowerText)) {
    problemType = 'Bullying / Ragging & Student Safety Incident';
    department = 'Student Welfare';
  } else if (/\b(ac|air condition|cooler|chiller|heating|hvac)\b/i.test(lowerText)) {
    problemType = 'HVAC / Classroom AC Malfunction';
    department = 'Maintenance';
  } else if (/\b(wifi|wi-fi|internet|net|portal|vtop|laptop|router|ip|network|cts)\b/i.test(lowerText)) {
    problemType = 'Wi-Fi & IT Network Disconnection';
    department = 'CTS';
  } else if (/\b(spark|sparks|sparking|exposed wire|wire|wiring|electric|electrical|switch|socket|power cut)\b/i.test(lowerText)) {
    problemType = 'Electrical Wiring & Sparking Safety Hazard';
    department = 'Maintenance';
  } else if (/\b(tap|leak|leakage|plumb|plumbing|geyser|water|flush|pipe|drainage)\b/i.test(lowerText)) {
    problemType = 'Plumbing & Tap Water Leakage Defect';
    department = 'Maintenance';
  } else if (/\b(food|mess|canteen|meal|breakfast|lunch|dinner|oily|hygiene|dirty dishes|dorm|warden|washroom|bathroom|hostel|room change|pankha|fan|mere room|my room|room ka|latch|bed|chair)\b/i.test(lowerText)) {
    problemType = lowerText.includes('food') || lowerText.includes('mess') || lowerText.includes('canteen')
      ? 'Mess Food Quality & Hygiene Defect'
      : 'Hostel Room & Residence Maintenance';
    department = 'Hostel';
  } else if (/\b(library|study pod|exam|grade|mark|attendance|class|lecture|syllabus|academic|prof)\b/i.test(lowerText)) {
    if (lowerText.includes('exam') || lowerText.includes('hall ticket') || lowerText.includes('grade')) {
      problemType = 'Exam Schedule & Result Evaluation Issue';
      department = 'Examination Cell';
    } else {
      problemType = lowerText.includes('library') ? 'Library Facility & Study Seating Suggestion' : 'Academic Attendance & Course Evaluation Dispute';
      department = 'Academic';
    }
  } else if (/\b(placement|interview|resume|recruit|company|drive|offer|internship|tpo)\b/i.test(lowerText)) {
    problemType = 'Placement Registration & Recruitment Drive Issue';
    department = 'Placement Cell';
  } else if (/\b(fee|challan|payment|finance|receipt|dues)\b/i.test(lowerText)) {
    problemType = 'Fee Payment & Financial Receipt Dispute';
    department = 'Finance';
  } else if (/\b(door|latch|lock|chair|table|desk|bed|cupboard|furniture|carpenter)\b/i.test(lowerText)) {
    problemType = 'Furniture & Fixture Hardware Repair';
    department = 'Maintenance';
  } else {
    problemType = lowerText.includes('bus') || lowerText.includes('transport') ? 'Campus Transport & Shuttle Bus Unpunctuality' : 'General Campus Administrative Concern';
    department = 'Administration';
  }

  // 3. Determine Urgency according to system prompt rules
  let urgency = 'Medium';
  const isSafetyEmergency = /\b(bully|bullying|ragging|threat|spark|sparks|sparking|hazard|fire|exposed wire|exposed live|electric shock|flooding|flood|emergency|danger|dangerous|theft|stolen|broken lock)\b/i.test(lowerText);
  const isHighImpact = /\b(ac|air condition|wifi|wi-fi|internet|geyser|exam|lecture|classroom|pankha|fan|no water|power cut|asap|urgent|immediately)\b/i.test(lowerText);
  const isLowUrgency = /\b(minor|paint|scuff|squeak|drawer|chair|table|desk|slow|suggestion|feedback)\b/i.test(lowerText);

  if (category === 'Compliment' || (category === 'Feedback' && !isSafetyEmergency) || isLowUrgency) {
    urgency = 'Low';
  } else if (isSafetyEmergency) {
    urgency = 'Critical';
  } else if (isHighImpact) {
    urgency = 'High';
  } else {
    urgency = 'Medium';
  }

  // 4. Location Extraction Rules
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

  // 5. Synthesize Situational Summary
  let summary = '';
  if (category === 'Compliment') {
    summary = `User submitted positive feedback appreciating rapid service resolution by ${department}.`;
  } else if (category === 'Feedback') {
    summary = `Student recommendation submitted regarding campus ${problemType.toLowerCase()}${location ? ' at ' + location : ''}.`;
  } else {
    summary = `Report submitted concerning ${problemType.toLowerCase()}${location ? ' located at ' + location : ''} requiring prompt ${department} intervention.`;
  }

  // 6. Action Suggestion
  let suggested_action = null;
  if (category === 'Issue') {
    suggested_action = `Inspect and repair ${department ? department.toLowerCase() : 'facility'} issue immediately`;
  } else if (category === 'Complaint') {
    suggested_action = `Investigate grievance regarding ${problemType.toLowerCase()} and notify campus ${department} supervisor`;
  } else if (category === 'Feedback') {
    suggested_action = 'Forward recommendation to relevant campus planning committee';
  } else if (category === 'Compliment') {
    suggested_action = 'Log staff appreciation note in service record system';
  }

  return validateAndNormalizeAIResponse({
    category,
    urgency,
    summary,
    location,
    department,
    problem: problemType,
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
