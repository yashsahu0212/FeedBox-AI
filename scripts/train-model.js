/**
 * AI Agent Test & Schema Verification Script
 * FeedBox AI Maintenance Portal
 * 
 * Description:
 * Verifies that the LLM-powered AI Agent prompt rules and structured outputs
 * satisfy all schema requirements without custom model training.
 */

import { analyzeReportWithAIAgent, runLocalAIAgentParser } from '../frontend/src/lib/aiAgentService.js';

const TEST_REPORTS = [
  "The AC in Block A classroom is not functioning.",
  "Exposed live electrical wires sparking near elevator in Hostel Block 2!",
  "The hostel mess food quality is terrible and dirty dishes are everywhere.",
  "We should consider adding soft study pods in the 2nd floor library reading section.",
  "Kudos to the CTS team for fixing the Wi-Fi router in Block 3 within 15 minutes!",
  "wifi nhi chal raha"
];

console.log("==========================================================");
console.log("   FEEDBOX AI LLM AI AGENT TEST & SCHEMA VERIFICATION     ");
console.log("==========================================================");

let passed = 0;

for (const text of TEST_REPORTS) {
  console.log(`\nInput Report: "${text}"`);
  const res = runLocalAIAgentParser(text);
  console.log("AI Agent Output JSON:", JSON.stringify(res, null, 2));

  const validCategory = ['Complaint', 'Issue', 'Feedback', 'Compliment'].includes(res.category);
  const validUrgency = ['Low', 'Medium', 'High', 'Critical'].includes(res.urgency);

  if (validCategory && validUrgency && res.summary && res.problem) {
    console.log(" Status:  VALID JSON SCHEMA");
    passed++;
  } else {
    console.log(" Status: ❌ INVALID SCHEMA");
  }
}

console.log(`\nResults: ${passed}/${TEST_REPORTS.length} passed schema validation.`);
