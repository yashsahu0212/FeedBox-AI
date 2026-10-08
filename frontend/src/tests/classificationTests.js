import { runLocalAIAgentParser } from '../lib/aiAgentService.js';

export const TEST_SUITE = [
  {
    name: '1. Classify Issue & Location extraction',
    input: 'The AC in Block A classroom is not functioning.',
    expectedCategory: 'Issue',
    expectedUrgency: 'High',
    expectedDepartment: 'Maintenance',
    expectedLocation: 'Block A'
  },
  {
    name: '2. Critical Electrical Hazard',
    input: 'Exposed live electrical wires sparking near elevator in Hostel Block 2 emergency!',
    expectedCategory: 'Issue',
    expectedUrgency: 'Critical',
    expectedDepartment: 'Maintenance',
    expectedLocation: 'Hostel Block 2'
  },
  {
    name: '3. Complaint for Mess food quality → Hostel',
    input: 'The hostel mess food quality has been terrible and unhygienic this whole week.',
    expectedCategory: 'Complaint',
    expectedUrgency: 'Medium',
    expectedDepartment: 'Hostel',
    expectedLocationNull: true
  },
  {
    name: '4. Feedback suggestion for Library → Academic',
    input: 'We should consider adding soft study pods in the 2nd floor library reading section.',
    expectedCategory: 'Feedback',
    expectedUrgency: 'Low',
    expectedDepartment: 'Academic',
    expectedLocation: 'Library'
  },
  {
    name: '5. Compliment for CTS Wi-Fi repair → CTS',
    input: 'Kudos to the CTS team for fixing the Wi-Fi router in Block 3 within 15 minutes!',
    expectedCategory: 'Compliment',
    expectedUrgency: 'Low',
    expectedDepartment: 'CTS',
    expectedLocation: 'Block 3'
  },
  {
    name: '6. Bullying / Ragging Incident → Student Welfare / Critical',
    input: 'Seniors were bullying and harassing freshers near old sports ground last night.',
    expectedCategory: 'Complaint',
    expectedUrgency: 'Critical',
    expectedDepartment: 'Student Welfare'
  },
  {
    name: '7. Hinglish Wi-Fi Issue → CTS',
    input: 'wifi nhi chal raha',
    expectedCategory: 'Issue',
    expectedUrgency: 'High',
    expectedDepartment: 'CTS',
    expectedLocationNull: true
  },
  {
    name: '8. Hinglish Fan Issue → Hostel',
    input: 'mere room ka pankha kharab hai',
    expectedCategory: 'Issue',
    expectedUrgency: 'High',
    expectedDepartment: 'Hostel',
    expectedLocationNull: true
  },
  {
    name: '9. Anti-hallucination location test (missing location -> null)',
    input: 'The water tap is leaking everywhere',
    expectedCategory: 'Issue',
    expectedLocationNull: true
  },
  {
    name: '10. Vague / Unmapped report → Administration',
    input: 'Something is wrong with campus transport bus timing',
    expectedCategory: 'Issue',
    expectedUrgency: 'Medium',
    expectedDepartment: 'Administration'
  }
];

export function runClassificationTests() {
  console.log('=== RUNNING CAMPUSAI LLM AI AGENT AUTOMATED TEST SUITE ===');
  let passedCount = 0;
  let failedCount = 0;
  const results = [];

  for (const test of TEST_SUITE) {
    const output = runLocalAIAgentParser(test.input);
    let passed = true;
    const failures = [];

    if (test.expectedCategory && output.category !== test.expectedCategory) {
      passed = false;
      failures.push(`Category mismatch: expected "${test.expectedCategory}", got "${output.category}"`);
    }

    if (test.expectedUrgency && output.urgency !== test.expectedUrgency) {
      passed = false;
      failures.push(`Urgency mismatch: expected "${test.expectedUrgency}", got "${output.urgency}"`);
    }

    if (test.expectedDepartment && output.department !== test.expectedDepartment) {
      passed = false;
      failures.push(`Department mismatch: expected "${test.expectedDepartment}", got "${output.department}"`);
    }

    if (test.expectedLocation && (!output.location || !output.location.includes(test.expectedLocation))) {
      passed = false;
      failures.push(`Location mismatch: expected containing "${test.expectedLocation}", got "${output.location}"`);
    }

    if (test.expectedLocationNull && output.location !== null) {
      passed = false;
      failures.push(`Expected location to be null, got "${output.location}"`);
    }

    // Verify summary & problem are NOT verbatim input echoes
    if (output.summary === test.input || output.problem === test.input) {
      passed = false;
      failures.push(`Summary or Problem is echoing raw input verbatim`);
    }

    if (passed) {
      passedCount++;
      results.push({ name: test.name, passed: true });
    } else {
      failedCount++;
      results.push({ name: test.name, passed: false, failures });
    }
  }

  console.log(`RESULTS: ${passedCount} PASSED, ${failedCount} FAILED OUT OF ${TEST_SUITE.length} TESTS.`);
  return { passedCount, failedCount, total: TEST_SUITE.length, results };
}
