import { classifyComplaintLocal } from '../lib/aiClassifier.js';

export const TEST_SUITE = [
  {
    name: '1. Wi-Fi complaint → CTS',
    input: 'My wifi is not working',
    expectedDept: 'CTS',
    expectedCategory: 'technical',
    expectedSubcategory: 'wifi'
  },
  {
    name: '2. Internet speed → CTS',
    input: 'Internet is very slow in my room',
    expectedDept: 'CTS',
    expectedCategory: 'technical',
    expectedSubcategory: 'internet_speed'
  },
  {
    name: '3. VTOP/login issue → CTS',
    input: 'I cannot login to VTOP portal',
    expectedDept: 'CTS',
    expectedCategory: 'technical',
    expectedSubcategory: 'portal_login'
  },
  {
    name: '4. Broken door latch → Hostel Committee / Carpenter / Urgent',
    input: 'My door latch is broken and want to replace it as soon as possible in block 3 7th floor B 701',
    expectedDept: 'Hostel Committee',
    expectedCategory: 'carpenter',
    expectedSubcategory: 'door_latch',
    expectedPriority: 'urgent',
    expectedLocation: { hostel_block: 'Block 3', floor: '7', wing: 'B', room: 'B701' }
  },
  {
    name: '5. Broken chair → Hostel Committee / Carpenter',
    input: 'My study chair is broken in room 302',
    expectedDept: 'Hostel Committee',
    expectedCategory: 'carpenter',
    expectedSubcategory: 'chair_repair'
  },
  {
    name: '6. Broken fan → Hostel Committee / Electrical',
    input: 'The fan in my room is not working',
    expectedDept: 'Hostel Committee',
    expectedCategory: 'electrical',
    expectedSubcategory: 'fan'
  },
  {
    name: '7. Broken light → Hostel Committee / Electrical',
    input: 'My room light is flickering',
    expectedDept: 'Hostel Committee',
    expectedCategory: 'electrical',
    expectedSubcategory: 'light_fixture'
  },
  {
    name: '8. Water leakage → Hostel Committee / Plumbing',
    input: 'there is water leaking from my bathroom in block 3 room B701',
    expectedDept: 'Hostel Committee',
    expectedCategory: 'plumbing',
    expectedSubcategory: 'water_leakage',
    expectedLocation: { hostel_block: 'Block 3', room: 'B701' }
  },
  {
    name: '9. Broken tap → Hostel Committee / Plumbing',
    input: 'the washroom tap is broken',
    expectedDept: 'Hostel Committee',
    expectedCategory: 'plumbing',
    expectedSubcategory: 'tap_repair'
  },
  {
    name: '10. Cleaning complaint → Hostel Committee / Housekeeping',
    input: 'my room needs cleaning and garbage removal',
    expectedDept: 'Hostel Committee',
    expectedCategory: 'housekeeping',
    expectedSubcategory: 'cleaning_request'
  },
  {
    name: '11. Food quality → Mess',
    input: 'hostel food quality is very bad and oily',
    expectedDept: 'Mess',
    expectedCategory: 'mess',
    expectedSubcategory: 'food_quality'
  },
  {
    name: '12. Theft / Stolen → Security',
    input: 'I lost my ID card near the main gate',
    expectedDept: 'Security',
    expectedCategory: 'security'
  },
  {
    name: '13. Attendance issue → Academic',
    input: 'there is a problem with my attendance in chemistry lab',
    expectedDept: 'Academic',
    expectedCategory: 'academic',
    expectedSubcategory: 'attendance_dispute'
  },
  {
    name: '14. Fee payment issue → Accounts',
    input: 'my fee payment is showing pending after online transfer',
    expectedDept: 'Accounts',
    expectedCategory: 'finance',
    expectedSubcategory: 'payment_status'
  },
  {
    name: '15. Bus complaint → Transport',
    input: 'campus bus timing is unpunctual and driver skipped the route',
    expectedDept: 'Transport',
    expectedCategory: 'transport'
  },
  {
    name: '16. Room change request → Hostel Committee / Accommodation',
    input: 'I need room change to block 4',
    expectedDept: 'Hostel Committee',
    expectedCategory: 'accommodation',
    expectedSubcategory: 'room_change'
  },
  {
    name: '17. Urgent safety issue → Electrical / Urgent',
    input: 'There is exposed electrical wiring in my room ASAP emergency',
    expectedDept: 'Hostel Committee',
    expectedCategory: 'electrical',
    expectedPriority: 'urgent'
  },
  {
    name: '18. Missing location → null location fields',
    input: 'My fan is not working',
    expectedDept: 'Hostel Committee',
    expectedLocationNull: true
  },
  {
    name: '19. Hinglish complaint: Wi-Fi',
    input: 'wifi nhi chal raha',
    expectedDept: 'CTS',
    expectedCategory: 'technical',
    expectedSubcategory: 'wifi'
  },
  {
    name: '20. Hinglish complaint: Fan',
    input: 'mere room ka pankha kharab hai',
    expectedDept: 'Hostel Committee',
    expectedCategory: 'electrical'
  },
  {
    name: '21. Hinglish complaint: Tap leak',
    input: 'bathroom ka nal leak kar raha hai',
    expectedDept: 'Hostel Committee',
    expectedCategory: 'plumbing'
  },
  {
    name: '22. Hinglish complaint: Door latch',
    input: 'door ka latch toot gaya hai jaldi fix karo',
    expectedDept: 'Hostel Committee',
    expectedCategory: 'carpenter',
    expectedPriority: 'urgent'
  },
  {
    name: '23. Multi-issue complaint → Splitting',
    input: 'My wifi isn\'t working and bathroom tap is leaking in B701',
    expectedMultiIssue: true
  },
  {
    name: '24. Ambiguous complaint → Manual Review',
    input: 'Something is wrong',
    expectedRoutingStatus: 'manual_review'
  }
];

export function runClassificationTests() {
  console.log('=== RUNNING CAMPUSAI CLASSIFICATION & ROUTING AUTOMATED SUITE ===');
  let passedCount = 0;
  let failedCount = 0;
  const results = [];

  for (const test of TEST_SUITE) {
    const output = classifyComplaintLocal(test.input);
    let passed = true;
    const failures = [];

    if (test.expectedDept) {
      const actualDept = output.multiple_issues ? output.issues[0].department : output.department;
      if (actualDept !== test.expectedDept) {
        passed = false;
        failures.push(`Dept mismatch: expected "${test.expectedDept}", got "${actualDept}"`);
      }
    }

    if (test.expectedCategory) {
      const actualCategory = output.multiple_issues ? output.issues[0].category : output.category;
      if (actualCategory !== test.expectedCategory) {
        passed = false;
        failures.push(`Category mismatch: expected "${test.expectedCategory}", got "${actualCategory}"`);
      }
    }

    if (test.expectedPriority) {
      const actualPriority = output.multiple_issues ? output.issues[0].priority : output.priority;
      if (actualPriority !== test.expectedPriority) {
        passed = false;
        failures.push(`Priority mismatch: expected "${test.expectedPriority}", got "${actualPriority}"`);
      }
    }

    if (test.expectedLocation) {
      if (!output.location) {
        passed = false;
        failures.push('Location expected but got null');
      } else {
        if (test.expectedLocation.hostel_block && output.location.hostel_block !== test.expectedLocation.hostel_block) {
          passed = false;
          failures.push(`Block mismatch: expected "${test.expectedLocation.hostel_block}", got "${output.location.hostel_block}"`);
        }
        if (test.expectedLocation.room && output.location.room !== test.expectedLocation.room) {
          passed = false;
          failures.push(`Room mismatch: expected "${test.expectedLocation.room}", got "${output.location.room}"`);
        }
      }
    }

    if (test.expectedLocationNull && output.location !== null) {
      passed = false;
      failures.push(`Expected location to be null, got ${JSON.stringify(output.location)}`);
    }

    if (test.expectedMultiIssue && !output.multiple_issues) {
      passed = false;
      failures.push('Expected multi-issue splitting to trigger');
    }

    if (test.expectedRoutingStatus && output.routing_status !== test.expectedRoutingStatus) {
      passed = false;
      failures.push(`Routing status mismatch: expected "${test.expectedRoutingStatus}", got "${output.routing_status}"`);
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
