import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-feedboxai.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Initial 9 Departments definition
export const DEPARTMENTS_LIST = [
  { id: '11111111-1111-1111-1111-111111111101', name: 'CTS', code: 'CTS', description: 'Computer & Technology Services, Campus IT Infrastructure & Wi-Fi' },
  { id: '11111111-1111-1111-1111-111111111102', name: 'Administration', code: 'ADMIN', description: 'General Administrative Desk, Security, Transport, and Logistics' },
  { id: '11111111-1111-1111-1111-111111111103', name: 'Placement Cell', code: 'PLACEMENT', description: 'Career Services, Campus Recruitment Drives, and Corporate Liaison' },
  { id: '11111111-1111-1111-1111-111111111104', name: 'Hostel', code: 'HOSTEL', description: 'Student Residences, Mess Facilities, Water Supply, and Hostel Maintenance' },
  { id: '11111111-1111-1111-1111-111111111105', name: 'Academic', code: 'ACADEMIC', description: 'Classrooms, Lecture Halls, Curriculum Support, and Faculty Labs' },
  { id: '11111111-1111-1111-1111-111111111106', name: 'Examination Cell', code: 'EXAM', description: 'Exams, Grade Cards, Result Processing, and Hall Tickets' },
  { id: '11111111-1111-1111-1111-111111111107', name: 'Student Welfare', code: 'WELFARE', description: 'Clubs, Events, Sports Complex, Grievance Redressal, and Counseling' },
  { id: '11111111-1111-1111-1111-111111111108', name: 'Finance', code: 'FINANCE', description: 'Fee Payment, Scholarships, Refunds, and Financial Desk' },
  { id: '11111111-1111-1111-1111-111111111109', name: 'Maintenance', code: 'MAINT', description: 'Civil, Electrical, Plumbing, HVAC, and Campus Physical Maintenance' }
];

// Initial Admin Users for testing each department
export const DEMO_ADMINS = [
  { email: 'cts.admin@college.edu', name: 'Alex Vance', role: 'department_admin', deptCode: 'CTS' },
  { email: 'admin.manager@college.edu', name: 'Sarah Jenkins', role: 'department_manager', deptCode: 'ADMIN' },
  { email: 'placement.admin@college.edu', name: 'Rohan Sharma', role: 'department_admin', deptCode: 'PLACEMENT' },
  { email: 'hostel.admin@college.edu', name: 'David Miller', role: 'department_admin', deptCode: 'HOSTEL' },
  { email: 'academic.admin@college.edu', name: 'Dr. Anita Roy', role: 'department_admin', deptCode: 'ACADEMIC' },
  { email: 'exam.admin@college.edu', name: 'Prof. S. K. Gupta', role: 'department_admin', deptCode: 'EXAM' },
  { email: 'welfare.admin@college.edu', name: 'Priya Verma', role: 'department_admin', deptCode: 'WELFARE' },
  { email: 'finance.admin@college.edu', name: 'Michael Chang', role: 'department_admin', deptCode: 'FINANCE' },
  { email: 'maint.admin@college.edu', name: 'Marcus Brody', role: 'department_admin', deptCode: 'MAINT' },
  { email: 'super.admin@college.edu', name: 'Super Administrator', role: 'super_admin', deptCode: 'CTS' }
];

// Initial Demo Student Users
export const DEMO_STUDENTS = [
  {
    email: 'student@college.edu',
    name: 'Yash Sharma',
    rollNumber: '21CS042',
    department: 'Computer Science & Engineering',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
  },
  {
    email: 'ananya.rao@college.edu',
    name: 'Ananya Rao',
    rollNumber: '22EC018',
    department: 'Electronics & Communication',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
  },
  {
    email: 'rohit.kumar@college.edu',
    name: 'Rohit Kumar',
    rollNumber: '23ME055',
    department: 'Mechanical Engineering',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
  }
];

// Department keywords classification dictionary for automatic department routing
export function classifyReportDepartment(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();

  if (/wifi|wi-fi|internet|network|router|ip|mac|laptop|server|cloud|portal login|login issue|software|cyber|cts/.test(text)) {
    return DEPARTMENTS_LIST.find(d => d.code === 'CTS');
  }
  if (/placement|interview|resume|recruit|company|drive|offer|internship|tpo/.test(text)) {
    return DEPARTMENTS_LIST.find(d => d.code === 'PLACEMENT');
  }
  if (/hostel|room|mess|geyser|bed|dorm|washroom|bathroom|canteen|laundry/.test(text)) {
    return DEPARTMENTS_LIST.find(d => d.code === 'HOSTEL');
  }
  if (/exam|test|mark|grade|result|re-evaluation|hall ticket|admit card|hallticket/.test(text)) {
    return DEPARTMENTS_LIST.find(d => d.code === 'EXAM');
  }
  if (/fee|challan|payment|scholarship|receipt|refund|dues|tuition|finance/.test(text)) {
    return DEPARTMENTS_LIST.find(d => d.code === 'FINANCE');
  }
  if (/fan|ac|air condition|light|plumb|water cooler|leak|door|window|switch|desk|chair|board|pipe|electrical|maint/.test(text)) {
    return DEPARTMENTS_LIST.find(d => d.code === 'MAINT');
  }
  if (/course|lecture|syllabus|attendance|prof|faculty|lab experiment|assignment|academic/.test(text)) {
    return DEPARTMENTS_LIST.find(d => d.code === 'ACADEMIC');
  }
  if (/event|club|sport|gym|ground|cultural|fest|ragging|welfare|counseling/.test(text)) {
    return DEPARTMENTS_LIST.find(d => d.code === 'WELFARE');
  }
  return DEPARTMENTS_LIST.find(d => d.code === 'ADMIN');
}

// ----------------------------------------------------
// LOCAL STORAGE & REAL-TIME BACKEND ADAPTER
// ----------------------------------------------------
const STORAGE_KEY_REPORTS = 'feedboxai_supabase_reports';
const STORAGE_KEY_STATUS_HISTORY = 'feedboxai_supabase_history';
const STORAGE_KEY_COMMENTS = 'feedboxai_supabase_comments';
const STORAGE_KEY_SESSION = 'feedboxai_admin_session';
const STORAGE_KEY_USER = 'feedboxai_current_user';

// Initialize default seed state into LocalStorage if empty
function initializeLocalStorageBackend() {
  if (!localStorage.getItem(STORAGE_KEY_REPORTS)) {
    const seedReports = [
      {
        id: '22222222-2222-2222-2222-222222222201',
        title: 'Wi-Fi signal drops continuously in Library 2nd Floor',
        description: 'Access point AP-L2-04 drops signal every 8-10 minutes on the second floor study hall. Signal registers 4 bars but IP leases fail systematically.',
        category: 'issue',
        urgency: 'high',
        status: 'processing',
        department_id: '11111111-1111-1111-1111-111111111101', // CTS
        location: 'Library, 2nd Floor Study Hall',
        attachment_url: null,
        ai_classification: { category: 'issue', suggested_department: 'CTS', confidence: 0.96, urgency: 'high' },
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        resolved_at: null
      },
      {
        id: '22222222-2222-2222-2222-222222222202',
        title: 'Broken classroom fan in Room 302',
        description: 'Overhead oscillating fan squeaks intensely during lectures and smells of burnt wiring.',
        category: 'complaint',
        urgency: 'medium',
        status: 'resolved',
        department_id: '11111111-1111-1111-1111-111111111109', // Maintenance
        location: 'Academic Building A, Room 302',
        attachment_url: null,
        ai_classification: { category: 'complaint', suggested_department: 'Maintenance', confidence: 0.94, urgency: 'medium' },
        created_at: new Date(Date.now() - 432000000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        resolved_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '22222222-2222-2222-2222-222222222203',
        title: 'Placement Portal registration submission error',
        description: 'Unable to upload updated resume PDF for upcoming TechCorp recruitment drive. Shows HTTP 500 error.',
        category: 'issue',
        urgency: 'critical',
        status: 'processing',
        department_id: '11111111-1111-1111-1111-111111111103', // Placement Cell
        location: 'Online Placement Portal / Block C',
        attachment_url: null,
        ai_classification: { category: 'issue', suggested_department: 'Placement Cell', confidence: 0.98, urgency: 'critical' },
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 43200000).toISOString(),
        resolved_at: null
      },
      {
        id: '22222222-2222-2222-2222-222222222204',
        title: 'Hot water supply disruption in Hostel Block B',
        description: 'Geyser circuit breaker trips every morning at 7:00 AM on 3rd floor west wing.',
        category: 'complaint',
        urgency: 'high',
        status: 'submitted',
        department_id: '11111111-1111-1111-1111-111111111104', // Hostel
        location: 'Hostel Block B, 3rd Floor',
        attachment_url: null,
        ai_classification: { category: 'complaint', suggested_department: 'Hostel', confidence: 0.95, urgency: 'high' },
        created_at: new Date(Date.now() - 10800000).toISOString(),
        updated_at: new Date(Date.now() - 10800000).toISOString(),
        resolved_at: null
      },
      {
        id: '22222222-2222-2222-2222-222222222205',
        title: 'Library 2nd floor natural light seating suggestion',
        description: 'Reorienting the study carrels toward natural light along the north window bay would double usable space.',
        category: 'feedback',
        urgency: 'low',
        status: 'processing',
        department_id: '11111111-1111-1111-1111-111111111105', // Academic
        location: 'Central Library, North Bay',
        attachment_url: null,
        ai_classification: { category: 'feedback', suggested_department: 'Academic', confidence: 0.89, urgency: 'low' },
        created_at: new Date(Date.now() - 604800000).toISOString(),
        updated_at: new Date(Date.now() - 604800000).toISOString(),
        resolved_at: null
      }
    ];
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(seedReports));
  }

  if (!localStorage.getItem(STORAGE_KEY_STATUS_HISTORY)) {
    const seedHistory = [
      {
        id: 'h1',
        report_id: '22222222-2222-2222-2222-222222222201',
        changed_by_name: 'System AI',
        old_status: 'none',
        new_status: 'submitted',
        note: 'Report received and classified by AI',
        created_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'h2',
        report_id: '22222222-2222-2222-2222-222222222201',
        changed_by_name: 'Alex Vance (CTS)',
        old_status: 'submitted',
        new_status: 'processing',
        note: 'Technician dispatched to inspect library AP-L2-04 router',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'h3',
        report_id: '22222222-2222-2222-2222-222222222202',
        changed_by_name: 'Marcus Brody (Maintenance)',
        old_status: 'submitted',
        new_status: 'processing',
        note: 'Assigned to Electrical Maintenance team',
        created_at: new Date(Date.now() - 345600000).toISOString()
      },
      {
        id: 'h4',
        report_id: '22222222-2222-2222-2222-222222222202',
        changed_by_name: 'Marcus Brody (Maintenance)',
        old_status: 'processing',
        new_status: 'resolved',
        note: 'Replaced faulty fan motor unit with quiet dual-bearing assembly',
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEY_STATUS_HISTORY, JSON.stringify(seedHistory));
  }

  if (!localStorage.getItem(STORAGE_KEY_COMMENTS)) {
    const seedComments = [
      {
        id: 'c1',
        report_id: '22222222-2222-2222-2222-222222222201',
        admin_name: 'Alex Vance',
        department_name: 'CTS',
        comment: 'Resetting access point router firmware and checking DHCP lease limits.',
        created_at: new Date(Date.now() - 64800000).toISOString()
      },
      {
        id: 'c2',
        report_id: '22222222-2222-2222-2222-222222222203',
        admin_name: 'Rohan Sharma',
        department_name: 'Placement Cell',
        comment: 'High priority flag raised for TechCorp drive applicants. IT team notified.',
        created_at: new Date(Date.now() - 43200000).toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(seedComments));
  }
}

// Call initialization
initializeLocalStorageBackend();

// Helper: Get reports from storage
export function getLocalReports() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_REPORTS) || '[]');
  } catch {
    return [];
  }
}

// Helper: Save reports to storage
export function saveLocalReports(reports) {
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
}

// Helper: Get status history
export function getLocalHistory(reportId) {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY_STATUS_HISTORY) || '[]');
    return reportId ? list.filter(h => h.report_id === reportId) : list;
  } catch {
    return [];
  }
}

// Helper: Save new history entry
export function addLocalHistoryEntry(entry) {
  const list = getLocalHistory();
  const updated = [entry, ...list];
  localStorage.setItem(STORAGE_KEY_STATUS_HISTORY, JSON.stringify(updated));
}

// Helper: Get comments
export function getLocalComments(reportId) {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY_COMMENTS) || '[]');
    return reportId ? list.filter(c => c.report_id === reportId) : list;
  } catch {
    return [];
  }
}

// Helper: Save new comment
export function addLocalCommentEntry(entry) {
  const list = getLocalComments();
  const updated = [entry, ...list];
  localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(updated));
}

// ----------------------------------------------------
// AUTHENTICATION API (STUDENTS & ADMIN STAFF)
// ----------------------------------------------------

export async function loginStudentUser(identifier, password) {
  // If actual Supabase configured with real auth
  if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('demo')) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: identifier, password });
    if (error) throw error;
    const studentSession = {
      id: data.user.id,
      user_id: data.user.id,
      name: data.user.user_metadata?.full_name || identifier.split('@')[0],
      email: data.user.email,
      rollNumber: data.user.user_metadata?.roll_number || '21CS042',
      department: 'Computer Science & Engineering',
      role: 'student',
      userType: 'student',
      avatar: data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(studentSession));
    return studentSession;
  }

  // Demo Student Auth fallback
  const inputLower = (identifier || '').toLowerCase();
  const foundStudent = DEMO_STUDENTS.find(s => 
    s.email.toLowerCase() === inputLower || 
    s.rollNumber.toLowerCase() === inputLower
  ) || DEMO_STUDENTS[0];

  const studentSession = {
    id: `student-${foundStudent.rollNumber.toLowerCase()}`,
    user_id: `user-${foundStudent.rollNumber.toLowerCase()}`,
    name: foundStudent.name,
    email: foundStudent.email,
    rollNumber: foundStudent.rollNumber,
    department: foundStudent.department,
    role: 'student',
    userType: 'student',
    avatar: foundStudent.avatar
  };

  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(studentSession));
  return studentSession;
}

export async function loginAdminUser(email, password) {
  // If actual Supabase configured with real auth
  if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('demo')) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    // Fetch department mapping
    const { data: adminProfile, error: profileErr } = await supabase
      .from('department_admins')
      .select('*, departments(*)')
      .eq('user_id', data.user.id)
      .single();
      
    if (profileErr || !adminProfile) {
      throw new Error('User is authenticated but has no assigned department admin role.');
    }
    const sessionData = { ...adminProfile, userType: 'admin' };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionData));
    return sessionData;
  }

  // Demo Auth fallback: find matching admin by email or default to CTS
  const foundAdmin = DEMO_ADMINS.find(a => a.email.toLowerCase() === email.toLowerCase()) || DEMO_ADMINS[0];
  const dept = DEPARTMENTS_LIST.find(d => d.code === foundAdmin.deptCode) || DEPARTMENTS_LIST[0];

  const adminSession = {
    id: `admin-${foundAdmin.deptCode.toLowerCase()}`,
    user_id: `user-${foundAdmin.deptCode.toLowerCase()}`,
    name: foundAdmin.name,
    email: foundAdmin.email,
    role: foundAdmin.role,
    userType: 'admin',
    department: dept,
    department_id: dept.id
  };

  localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(adminSession));
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(adminSession));
  return adminSession;
}

export function getCurrentUserSession() {
  try {
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (savedUser) return JSON.parse(savedUser);
    
    const savedAdmin = localStorage.getItem(STORAGE_KEY_SESSION);
    if (savedAdmin) return JSON.parse(savedAdmin);
    
    return null;
  } catch {
    return null;
  }
}

export function getCurrentAdminSession() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export function logoutUserSession() {
  localStorage.removeItem(STORAGE_KEY_USER);
  localStorage.removeItem(STORAGE_KEY_SESSION);
  if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('demo')) {
    supabase.auth.signOut();
  }
}

export function logoutAdminUser() {
  logoutUserSession();
}

// ----------------------------------------------------
// REPORTS API (RLS ENFORCED BY DEPARTMENT ID)
// ----------------------------------------------------
export async function getDepartmentReports(adminDepartmentId, isSuperAdmin = false) {
  // Real Supabase call if configured
  if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('demo')) {
    let query = supabase.from('reports').select('*, departments(*)');
    if (!isSuperAdmin && adminDepartmentId) {
      query = query.eq('department_id', adminDepartmentId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  // Local Storage RLS enforcement
  const allReports = getLocalReports();
  if (isSuperAdmin) {
    return allReports;
  }

  // RLS FILTER: Only return reports matching the admin's assigned department_id!
  return allReports.filter(r => r.department_id === adminDepartmentId);
}

export async function submitNewReport(reportData) {
  let aiAnalysis = reportData.aiClassification;
  if (!aiAnalysis || !aiAnalysis.category) {
    const { analyzeReportWithAIAgent } = await import('./aiAgentService.js');
    aiAnalysis = await analyzeReportWithAIAgent(`${reportData.title || ''} ${reportData.description || ''}`);
  }

  const deptName = reportData.department || aiAnalysis.department || 'Administration';
  const assignedDept = DEPARTMENTS_LIST.find(d => d.name.toLowerCase() === deptName.toLowerCase()) ||
                       DEPARTMENTS_LIST.find(d => d.code.toLowerCase() === deptName.toLowerCase()) ||
                       DEPARTMENTS_LIST.find(d => d.code === 'MAINT') ||
                       DEPARTMENTS_LIST[0];

  const categoryEnum = ['Complaint', 'Issue', 'Feedback', 'Compliment'].find(c => c.toLowerCase() === (aiAnalysis.category || reportData.category || '').toLowerCase()) || 'Issue';
  const urgencyEnum = ['Low', 'Medium', 'High', 'Critical'].find(u => u.toLowerCase() === (aiAnalysis.urgency || reportData.urgency || '').toLowerCase()) || 'Medium';

  const locString = typeof reportData.location === 'string'
    ? reportData.location
    : (typeof aiAnalysis.location === 'string'
        ? aiAnalysis.location
        : (aiAnalysis.location && typeof aiAnalysis.location === 'object'
            ? Object.values(aiAnalysis.location).filter(Boolean).join(', ')
            : 'Campus Main'));

  // Valid UUID generator for PostgreSQL
  const reportUuid = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : '22222222-2222-2222-2222-' + Math.floor(100000000000 + Math.random() * 900000000000);

  const newReport = {
    id: reportUuid,
    title: reportData.title || aiAnalysis.summary || 'Maintenance Report',
    description: reportData.description || aiAnalysis.problem || '',
    category: categoryEnum.toLowerCase(),
    urgency: urgencyEnum.toLowerCase(),
    status: 'submitted',
    department_id: assignedDept.id,
    department_name: assignedDept.name,
    location: locString,
    attachment_url: reportData.attachedPhoto || null,
    ai_classification: {
      category: categoryEnum,
      urgency: urgencyEnum,
      summary: aiAnalysis.summary || reportData.title,
      location: typeof aiAnalysis.location === 'string' ? aiAnalysis.location : locString,
      department: assignedDept.name,
      problem: aiAnalysis.problem || reportData.description,
      suggested_action: aiAnalysis.suggested_action || null,
      confidence: aiAnalysis.confidence || 0.96,
      ai_analysis_timestamp: aiAnalysis.ai_analysis_timestamp || new Date().toISOString()
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    resolved_at: null
  };

  // Real Supabase insert if configured
  if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('demo')) {
    try {
      // Clean DB payload matching PostgreSQL schema exactly
      const dbPayload = {
        id: newReport.id,
        title: newReport.title,
        description: newReport.description,
        category: newReport.category,
        urgency: newReport.urgency,
        status: newReport.status,
        department_id: newReport.department_id,
        location: newReport.location,
        attachment_url: newReport.attachment_url,
        ai_classification: newReport.ai_classification
      };

      const { data, error } = await supabase.from('reports').insert([dbPayload]).select().single();
      if (error) {
        console.warn('Supabase DB Insert Note (Saving to local store):', error.message);
      } else if (data) {
        newReport.id = data.id || newReport.id;
      }
    } catch (err) {
      console.warn('Supabase DB Insert Warning:', err.message);
    }
  }

  // Save to local backend
  const reports = getLocalReports();
  const updated = [newReport, ...reports];
  saveLocalReports(updated);

  // Add initial status history record
  addLocalHistoryEntry({
    id: `h-${Date.now()}`,
    report_id: newReport.id,
    changed_by_name: 'Student / User',
    old_status: 'none',
    new_status: 'submitted',
    note: `Report submitted and classified by AI Agent as [${categoryEnum} | ${urgencyEnum} Urgency] -> Routed to ${assignedDept.name}`,
    created_at: new Date().toISOString()
  });

  return newReport;
}

export async function updateReportStatusInDb(reportId, newStatus, note, adminUser) {
  const reports = getLocalReports();
  const target = reports.find(r => r.id === reportId);
  if (!target) throw new Error('Report not found');

  const oldStatus = target.status;
  target.status = newStatus;
  target.updated_at = new Date().toISOString();
  if (newStatus === 'resolved') {
    target.resolved_at = new Date().toISOString();
  }

  saveLocalReports(reports);

  // Add mandatory history entry
  const historyEntry = {
    id: `h-${Date.now()}`,
    report_id: reportId,
    changed_by_name: `${adminUser.name} (${adminUser.department?.name || 'Admin'})`,
    old_status: oldStatus,
    new_status: newStatus,
    note: note || `Status changed from ${oldStatus} to ${newStatus}`,
    created_at: new Date().toISOString()
  };
  addLocalHistoryEntry(historyEntry);

  return target;
}

export async function postReportCommentInDb(reportId, commentText, adminUser) {
  const commentEntry = {
    id: `c-${Date.now()}`,
    report_id: reportId,
    admin_name: adminUser.name,
    department_name: adminUser.department?.name || 'Department Admin',
    comment: commentText,
    created_at: new Date().toISOString()
  };

  addLocalCommentEntry(commentEntry);
  return commentEntry;
}
