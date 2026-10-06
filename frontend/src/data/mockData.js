export const initialTickets = [
  {
    id: "TICK-8842",
    title: "The Wi-Fi in the library keeps disconnecting",
    description: "Access point AP-L2-04 drops signal every 8-10 minutes on the second floor study hall. Frequent dropouts reported by multiple students on the North mezzanine. The signal strength registers 4 bars but IP leases fail systematically.",
    category: "Issue",
    department: "IT Services",
    status: "In Progress",
    submittedDate: "September 7, 2025",
    updatedTime: "14m ago",
    location: "Library, 2nd Floor Study Hall",
    attachedPhoto: null,
    timeline: [
      { status: "Submitted", time: "09:14 AM", note: "Ticket acknowledged via student portal", done: true },
      { status: "Assigned to IT Services", time: "10:02 AM", note: "Dispatched to Campus Network Operations", done: true },
      { status: "In Progress", time: "Active", note: "Technician on site inspecting access points", active: true },
      { status: "Resolved", time: "Pending", note: "Pending confirmation from student", done: false }
    ],
    comments: [
      { author: "IT Support (Alex)", time: "10:15 AM", text: "We are resetting the router AP-L2-04 and testing IP lease table limits." }
    ]
  },
  {
    id: "TICK-8839",
    title: "Broken classroom fan in Room 302",
    description: "Overhead oscillating fan squeaks intensely during lectures and smells of burnt wiring.",
    category: "Complaint",
    department: "Facilities & Maintenance",
    status: "Resolved",
    submittedDate: "September 3, 2025",
    updatedTime: "2 days ago",
    location: "Academic Building A, Room 302",
    attachedPhoto: null,
    timeline: [
      { status: "Submitted", time: "02:30 PM", note: "Ticket registered", done: true },
      { status: "Assigned", time: "03:00 PM", note: "Assigned to Facilities Electrical Team", done: true },
      { status: "Resolved", time: "05:15 PM", note: "Replaced motor unit and verified silent operation", done: true }
    ],
    comments: [
      { author: "Facilities (Marcus)", time: "05:15 PM", text: "Fan motor unit replaced with quiet dual-bearing assembly." }
    ]
  },
  {
    id: "TICK-8815",
    title: "Library 2nd floor seating suggestion",
    description: "Reorienting the carrels toward natural light along the north window bay would double usable study space.",
    category: "Feedback",
    department: "Campus Planning",
    status: "Reviewed",
    submittedDate: "August 29, 2025",
    updatedTime: "1 week ago",
    location: "Central Library, North Bay",
    attachedPhoto: null,
    timeline: [
      { status: "Submitted", time: "11:00 AM", note: "Feedback logged", done: true },
      { status: "Reviewed", time: "04:00 PM", note: "Forwarded to Campus Architect Committee for Q4 review", done: true }
    ],
    comments: [
      { author: "Campus Planning", time: "Aug 30", text: "Thank you! We have added this layout proposal to the upcoming fall facility optimization review." }
    ]
  },
  {
    id: "TICK-8790",
    title: "Water cooler leak outside Chem Lab",
    description: "Puddle forming across corridor linoleum creating a slip hazard near door 114.",
    category: "Issue",
    department: "Facilities & Maintenance",
    status: "Resolved",
    submittedDate: "August 15, 2025",
    updatedTime: "3 weeks ago",
    location: "Science Complex, Floor 1 near Room 114",
    attachedPhoto: null,
    timeline: [
      { status: "Submitted", time: "08:15 AM", note: "Hazard reported", done: true },
      { status: "In Progress", time: "08:45 AM", note: "Plumbing team dispatched", done: true },
      { status: "Resolved", time: "10:30 AM", note: "Valve gasket replaced and floor dried", done: true }
    ],
    comments: []
  }
];

export const nearbyActivity = [
  {
    id: "ACT-1",
    category: "Classroom Tech",
    title: "Main projector color calibration flickers during chemistry lectures in Hall 3B.",
    timeAgo: "24m ago",
    status: "Assigned to AV Desk",
    statusType: "secondary"
  },
  {
    id: "ACT-2",
    category: "Facilities",
    title: "Water fountain on the 3rd floor west wing has low pressure.",
    timeAgo: "1h ago",
    status: "Queued for inspection",
    statusType: "outline"
  },
  {
    id: "ACT-3",
    category: "HVAC",
    title: "Air conditioning in Computer Lab 4 running too cold (62°F).",
    timeAgo: "2h ago",
    status: "Thermostat calibrated",
    statusType: "resolved"
  }
];
