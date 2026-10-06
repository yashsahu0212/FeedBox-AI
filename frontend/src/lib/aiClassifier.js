/**
 * AI-Powered Complaint, Feedback & Report Classification and Routing Engine
 * CampusAI Portal
 * 
 * Supports:
 * 1. English, Hinglish ("wifi nhi chal raha", "mere room ka pankha kharab hai", "bathroom ka nal leak kar raha hai")
 * 2. 8 Departments (CTS, Hostel Committee, Security, Academic, Accounts, Mess, Transport, Administration)
 * 3. Subcategories for Hostel Committee (carpenter, electrical, plumbing, housekeeping, maintenance, accommodation)
 * 4. Precise Location Extraction (Block, Floor, Wing, Room - without hallucination)
 * 5. Priority & Urgency detection (Low, Medium, High, Urgent)
 * 6. Intent classification (complaint, feedback, report, request)
 * 7. Multi-issue detection & splitting
 * 8. Confidence scoring & Manual Review routing (threshold < 0.70)
 * 9. n8n Webhook Integration layer with automatic fallback
 */

// ----------------------------------------------------
// LOCATION EXTRACTION HELPER
// ----------------------------------------------------
export function extractLocation(text = '') {
  if (!text) return null;

  let hostel_block = null;
  let floor = null;
  let wing = null;
  let room = null;
  let additional_location = null;

  // 1. Extract Room Number (e.g. B701, B-701, room 701, room B701, C-302)
  const roomMatch = text.match(/\b(?:room\s*)?([A-[#A-Za-z]?\s*[-–]?\s*\d{3,4})\b/i) ||
                    text.match(/\b(room\s*\d{3,4})\b/i) ||
                    text.match(/\b([A-Za-z]\d{3})\b/i);
  if (roomMatch) {
    const rawRoom = roomMatch[1].replace(/\s+/g, '').toUpperCase();
    if (!/BLOCK|FLOOR|WING/i.test(rawRoom)) {
      room = rawRoom.startsWith('ROOM') ? rawRoom.replace('ROOM', '').trim() : rawRoom;
      if (!room.startsWith('B') && !room.startsWith('A') && !room.startsWith('C') && !room.startsWith('D')) {
        // preserve formatted room
      }
    }
  }

  // 2. Extract Hostel Block (e.g. Block 3, Block-3, B3, block three, block C)
  const blockMatch = text.match(/\b(?:block|blk)\s*[-–]?\s*([a-zA-Z0-9]+)\b/i) ||
                     text.match(/\b(b-\d|b\d)\b/i);
  if (blockMatch) {
    const rawBlock = blockMatch[1].toUpperCase();
    if (rawBlock === 'THREE' || rawBlock === '3') hostel_block = 'Block 3';
    else if (rawBlock === 'ONE' || rawBlock === '1') hostel_block = 'Block 1';
    else if (rawBlock === 'TWO' || rawBlock === '2') hostel_block = 'Block 2';
    else if (rawBlock === 'FOUR' || rawBlock === '4') hostel_block = 'Block 4';
    else hostel_block = `Block ${rawBlock}`;
  } else if (room && /^([A-Z])\d{3}$/.test(room)) {
    // If room is B701, infer wing/block candidate if block not explicitly set
    const letter = room.charAt(0);
    if (!hostel_block) {
      // Keep hostel_block null unless explicitly mentioned as block 3
    }
  }

  // 3. Extract Floor (e.g. 7th floor, floor 7, 7F, 3rd floor, ground floor)
  const floorMatch = text.match(/\b(\d+)(?:st|nd|rd|th)?\s*floor\b/i) ||
                     text.match(/\bfloor\s*(\d+)\b/i) ||
                     text.match(/\b(\d+)F\b/i) ||
                     text.match(/\b(ground|basement)\s*floor\b/i);
  if (floorMatch) {
    const val = floorMatch[1].toLowerCase();
    if (val === 'ground') floor = 'Ground';
    else if (val === 'basement') floor = 'Basement';
    else floor = val;
  }

  // 4. Extract Wing (e.g. Wing B, B wing, wing-b, west wing)
  const wingMatch = text.match(/\b(?:wing\s*[-–]?\s*([a-zA-Z]))\b/i) ||
                    text.match(/\b([a-zA-Z])\s*wing\b/i) ||
                    text.match(/\b(west|east|north|south)\s*wing\b/i);
  if (wingMatch) {
    wing = wingMatch[1].toUpperCase();
  } else if (room && /^[A-Z]\d{3}$/.test(room)) {
    wing = room.charAt(0);
  }

  // 5. Additional location context (e.g. Library, Mess, Computer Lab, Science Complex)
  if (/library/i.test(text)) additional_location = 'Library';
  else if (/mess|canteen/i.test(text)) additional_location = 'Mess Hall';
  else if (/lab|laboratory/i.test(text)) additional_location = 'Academic Lab';
  else if (/corridor|hallway/i.test(text)) additional_location = 'Corridor';

  const hasLocation = hostel_block || floor || wing || room || additional_location;
  if (!hasLocation) return null;

  return {
    hostel_block: hostel_block || null,
    floor: floor || null,
    wing: wing || null,
    room: room || null,
    additional_location: additional_location || null
  };
}

// ----------------------------------------------------
// MULTI-ISSUE DETECTION HELPER
// ----------------------------------------------------
export function detectMultiIssue(text = '') {
  const lower = text.toLowerCase();

  // Check if text combines distinct topics: wifi/internet AND tap/water/fan/door
  const hasTech = /wifi|wi-fi|net\b|internet|vtop|login/i.test(lower);
  const hasPlumbing = /tap|leak|water|flush|toilet|shower|bathroom/i.test(lower);
  const hasElectrical = /fan|pankha|light|socket|switch|wire|ac\b/i.test(lower);
  const hasCarpenter = /door|latch|lock|chair|bed|table|cupboard|furniture/i.test(lower);

  const topicCount = [hasTech, hasPlumbing, hasElectrical, hasCarpenter].filter(Boolean).length;
  
  if (topicCount >= 2 && (/\band\b|\baur\b|\bplus\b|\balso\b|,/i.test(lower))) {
    return true;
  }
  return false;
}

// ----------------------------------------------------
// CORE AI CLASSIFICATION ENGINE
// ----------------------------------------------------
export function classifyComplaintLocal(text = '') {
  const rawText = (text || '').trim();
  const lower = rawText.toLowerCase();

  // 1. Ambiguous / Insufficient Check (< 0.70 Confidence -> Manual Review)
  if (!rawText || rawText.length < 6 || /^(something is wrong|problem|help|issue|fix it|not working|bad)$/i.test(rawText)) {
    return {
      original_text: rawText,
      intent_type: 'complaint',
      category: 'general',
      subcategory: 'unspecified',
      department: 'manual_review',
      priority: 'medium',
      issue_summary: rawText || 'Ambiguous complaint text provided',
      requested_action: 'Contact student for issue clarification',
      location: extractLocation(rawText),
      entities: [],
      confidence: 0.45,
      routing_status: 'manual_review',
      reason: 'Complaint lacks detailed context for automated department routing.'
    };
  }

  // 2. Check for Multi-Issue Complaint
  if (detectMultiIssue(rawText)) {
    const location = extractLocation(rawText);
    const subIssues = [];

    if (/wifi|wi-fi|net\b|internet/i.test(lower)) {
      subIssues.push({
        intent_type: 'complaint',
        category: 'technical',
        subcategory: 'wifi',
        department: 'CTS',
        priority: 'high',
        issue_summary: 'Wi-Fi connectivity issue',
        requested_action: 'Check network access point and restore connectivity',
        location: location
      });
    }

    if (/tap|leak|water|plumb/i.test(lower)) {
      subIssues.push({
        intent_type: 'complaint',
        category: 'plumbing',
        subcategory: 'tap_leakage',
        department: 'Hostel Committee',
        priority: 'high',
        issue_summary: 'Bathroom tap water leakage',
        requested_action: 'Dispatch plumbing maintenance team',
        location: location
      });
    }

    if (/fan|pankha|light|electrical/i.test(lower)) {
      subIssues.push({
        intent_type: 'complaint',
        category: 'electrical',
        subcategory: 'fan_or_light',
        department: 'Hostel Committee',
        priority: 'high',
        issue_summary: 'Room electrical appliance issue',
        requested_action: 'Dispatch electrical technician',
        location: location
      });
    }

    if (subIssues.length >= 2) {
      return {
        original_text: rawText,
        multiple_issues: true,
        issues: subIssues,
        location: location,
        confidence: 0.95,
        routing_status: 'auto_routed',
        reason: 'Multiple distinct department issues identified and split for parallel resolution.'
      };
    }
  }

  // 3. Determine Intent Type
  let intent_type = 'complaint';
  if (/suggest|opinion|could be better|improve|feedback|review|reorient/i.test(lower) && !/broken|leak|not working|urgent/i.test(lower)) {
    intent_type = 'feedback';
  } else if (/saw|witnessed|unauthorized|stolen|incident|reporting|found|lost/i.test(lower)) {
    intent_type = 'report';
  } else if (/want to|need room change|request|apply for|issue certificate/i.test(lower) && !/broken|leak|not working/i.test(lower)) {
    intent_type = 'request';
  }

  // 4. Department & Category Classification
  let department = 'Administration';
  let category = 'general';
  let subcategory = 'general_issue';
  let issue_summary = rawText;
  let requested_action = 'Investigate and resolve issue';
  let confidence = 0.92;

  // A. CTS / TECHNICAL DEPARTMENT
  if (/\b(wifi|wi-fi|internet|net|network|vtop|login|portal|router|lan|mac address|speed|disconnect)\b|nhi chal raha/i.test(lower)) {
    department = 'CTS';
    category = 'technical';

    if (/wifi|wi-fi/i.test(lower)) {
      subcategory = 'wifi';
      issue_summary = 'Wi-Fi network dropouts / connection failure';
      requested_action = 'Restore Wi-Fi connectivity and inspect access point';
    } else if (/speed|slow/i.test(lower)) {
      subcategory = 'internet_speed';
      issue_summary = 'Slow internet speed / high bandwidth latency';
      requested_action = 'Check network bandwidth and resolve speed bottleneck';
    } else if (/vtop|login|portal/i.test(lower)) {
      subcategory = 'portal_login';
      issue_summary = 'College portal / VTOP authentication error';
      requested_action = 'Reset portal session and verify credentials';
    } else {
      subcategory = 'network';
      issue_summary = 'Network IT infrastructure issue';
      requested_action = 'Inspect network switch and connectivity';
    }
    confidence = 0.96;
  }

  // B. HOSTEL COMMITTEE (Physical Infrastructure)
  else if (/latch|door|lock|pankha|fan|light|switch|socket|electricity|wire|wiring|tap|shower|toilet|leak|flush|drainage|pipe|washbasin|cleaning|garbage|dirty|room change|geyser|bed|chair|table|cupboard|furniture|room/i.test(lower)) {
    department = 'Hostel Committee';

    // B0. Room / Accommodation (Specific rule checked first)
    if (/room change|room allocation|accommodation/i.test(lower)) {
      category = 'accommodation';
      subcategory = 'room_change';
      issue_summary = 'Student hostel room change / transfer request';
      requested_action = 'Process room change application according to policy';
      confidence = 0.94;
    }
    // B1. Plumbing (Checked before generic furniture/room rules)
    else if (/tap|shower|toilet|leak|flush|drainage|pipe|washbasin|water|nal|bathroom/i.test(lower)) {
      category = 'plumbing';
      if (/tap|nal/i.test(lower)) subcategory = 'tap_repair';
      else if (/leak/i.test(lower)) subcategory = 'water_leakage';
      else if (/toilet|flush/i.test(lower)) subcategory = 'toilet_flush';
      else subcategory = 'pipe_drainage';
      issue_summary = 'Water leakage or plumbing fixture breakdown';
      requested_action = 'Inspect plumbing line and stop leakage';
      confidence = 0.96;
    }
    // B2. Carpenter
    else if (/latch|door|lock|wooden|bed|table|chair|cupboard|furniture|woodwork/i.test(lower)) {
      category = 'carpenter';
      if (/latch/i.test(lower)) subcategory = 'door_latch';
      else if (/lock/i.test(lower)) subcategory = 'door_lock';
      else if (/chair/i.test(lower)) subcategory = 'chair_repair';
      else subcategory = 'furniture';
      issue_summary = 'Door latch or wooden furniture broken/damaged';
      requested_action = 'Repair or replace damaged door/furniture fixture';
      confidence = 0.95;
    }
    // B2. Electrical
    else if (/fan|pankha|light|switch|socket|electricity|wire|wiring|spark|power/i.test(lower)) {
      category = 'electrical';
      if (/fan|pankha/i.test(lower)) subcategory = 'fan';
      else if (/light/i.test(lower)) subcategory = 'light_fixture';
      else if (/wire|wiring|spark/i.test(lower)) subcategory = 'wiring_hazard';
      else subcategory = 'power_socket';
      issue_summary = 'Room fan, light, or electrical wiring issue';
      requested_action = 'Inspect electrical fixture and restore power supply';
      confidence = 0.95;
    }
    // B3. Plumbing
    else if (/tap|shower|toilet|leak|flush|drainage|pipe|washbasin|water|nal/i.test(lower)) {
      category = 'plumbing';
      if (/tap|nal/i.test(lower)) subcategory = 'tap_repair';
      else if (/leak/i.test(lower)) subcategory = 'water_leakage';
      else if (/toilet|flush/i.test(lower)) subcategory = 'toilet_flush';
      else subcategory = 'pipe_drainage';
      issue_summary = 'Water leakage or plumbing fixture breakdown';
      requested_action = 'Inspect plumbing line and stop leakage';
      confidence = 0.96;
    }
    // B4. Housekeeping
    else if (/clean|cleaning|garbage|dirty|dustbin|washroom clean/i.test(lower)) {
      category = 'housekeeping';
      subcategory = 'cleaning_request';
      issue_summary = 'Room or washroom cleaning request';
      requested_action = 'Dispatch housekeeping personnel to clean area';
      confidence = 0.93;
    }
    // B5. Room / Accommodation
    else if (/room change|room allocation|accommodation/i.test(lower)) {
      category = 'accommodation';
      subcategory = 'room_change';
      issue_summary = 'Student hostel room change / transfer request';
      requested_action = 'Process room change application according to policy';
      confidence = 0.94;
    }
    // B6. Maintenance
    else {
      category = 'maintenance';
      subcategory = 'general_maintenance';
      issue_summary = 'General physical hostel maintenance issue';
      requested_action = 'Assign hostel maintenance crew for inspection';
      confidence = 0.90;
    }
  }

  // C. SECURITY
  else if (/theft|stolen|suspicious|unauthorized|security|guard|safety|stole|lost id|lost my id/i.test(lower)) {
    department = 'Security';
    category = 'security';
    if (/lost|stolen|theft/i.test(lower)) subcategory = 'theft_or_loss';
    else if (/unauthorized|suspicious/i.test(lower)) subcategory = 'unauthorized_access';
    else subcategory = 'safety_incident';
    issue_summary = 'Security or safety incident reported on campus';
    requested_action = 'Dispatch security personnel and review surveillance';
    confidence = 0.94;
  }

  // D. ACADEMIC / FACULTY
  else if (/faculty|class|professor|attendance|timetable|exam|marks|syllabus|academic|lecture/i.test(lower)) {
    department = 'Academic';
    category = 'academic';
    if (/attendance/i.test(lower)) subcategory = 'attendance_dispute';
    else if (/exam|mark/i.test(lower)) subcategory = 'examination';
    else subcategory = 'curriculum_or_class';
    issue_summary = 'Academic or classroom attendance discrepancy';
    requested_action = 'Forward to Academic Dean / Department Coordinator';
    confidence = 0.93;
  }

  // E. ACCOUNTS / FINANCE
  else if (/fee|payment|paid|refund|receipt|challan|tuition|finance|dues|transaction/i.test(lower)) {
    department = 'Accounts';
    category = 'finance';
    if (/pending|failed|payment/i.test(lower)) subcategory = 'payment_status';
    else if (/refund/i.test(lower)) subcategory = 'refund_request';
    else subcategory = 'fee_receipt';
    issue_summary = 'Fee payment or account financial status issue';
    requested_action = 'Verify payment gateway transaction logs and update fee status';
    confidence = 0.95;
  }

  // F. MESS / FOOD SERVICES
  else if (/food|mess|canteen|meal|hygiene|taste|oily|dinner|lunch|breakfast/i.test(lower)) {
    department = 'Mess';
    category = 'mess';
    if (/quality|taste|oily/i.test(lower)) subcategory = 'food_quality';
    else if (/hygiene|dirty/i.test(lower)) subcategory = 'mess_hygiene';
    else subcategory = 'mess_timing';
    issue_summary = 'Hostel mess food quality / hygiene complaint';
    requested_action = 'Notify Mess Manager and inspect food preparation standards';
    confidence = 0.95;
  }

  // G. TRANSPORT
  else if (/bus|route|driver|transport|shuttle|bus timing/i.test(lower)) {
    department = 'Transport';
    category = 'transport';
    subcategory = 'bus_service';
    issue_summary = 'Campus transport / bus schedule complaint';
    requested_action = 'Review bus route timeline and driver log';
    confidence = 0.93;
  }

  // 5. Priority & Urgency Calculation
  let priority = 'medium';

  // Explicit Urgent Triggers
  const hasUrgentWords = /urgent|asap|immediately|right now|emergency|very serious|hazard|critical|please fix immediately|jaldi/i.test(lower);
  const isSafetyRisk = /wire|wiring|spark|exposed|fire|leakage|flood|theft|unauthorized|latch|lock/i.test(lower);

  if (hasUrgentWords || (isSafetyRisk && /latch|wire|spark|flood|leak/i.test(lower))) {
    priority = 'urgent';
  } else if (/wifi|fan|light|water|pankha|nal|exam|payment/i.test(lower)) {
    priority = 'high';
  } else if (/chair|table|desk|slow|suggestion|feedback|oily/i.test(lower)) {
    priority = 'low';
  }

  // Extract precise location
  const location = extractLocation(rawText);

  // Formulate human explanation
  let reason = `Classified as ${category}${subcategory ? ` (${subcategory})` : ''} issue and automatically routed to ${department}.`;
  if (priority === 'urgent') {
    reason += ' Escalated to URGENT priority due to safety/security risk or explicit urgency request.';
  }

  return {
    original_text: rawText,
    intent_type: intent_type,
    category: category,
    subcategory: subcategory,
    department: department,
    priority: priority,
    issue_summary: issue_summary,
    requested_action: requested_action,
    location: location,
    entities: [],
    confidence: confidence,
    routing_status: confidence < 0.70 ? 'manual_review' : 'auto_routed',
    reason: reason
  };
}

// ----------------------------------------------------
// N8N WEBHOOK + LOCAL AI ENGINE HYBRID PROXY
// ----------------------------------------------------
/**
 * Classifies a complaint by attempting to call the n8n Webhook endpoint if available,
 * falling back seamlessly to the deterministic local AI classification engine.
 */
export async function classifyComplaintAI(rawText = '', options = {}) {
  const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || options.n8nWebhookUrl;

  if (n8nWebhookUrl) {
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaint_id: options.complaintId || `cmp-${Date.now()}`,
          user_id: options.userId || 'student-user',
          text: rawText,
          submitted_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result && (result.department || result.issues)) {
          return {
            ...result,
            source: 'n8n_webhook'
          };
        }
      }
    } catch (err) {
      console.warn('n8n Webhook connection attempt failed, falling back to local AI Engine:', err);
    }
  }

  // Fallback to local AI Engine
  const localResult = classifyComplaintLocal(rawText);
  return {
    ...localResult,
    source: 'local_ai_engine'
  };
}
