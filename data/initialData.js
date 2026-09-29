export const initialProjects = [
  {
    id: 'proj-1',
    name: 'E-Commerce Website',
    slug: 'e-commerce-website',
    description: 'Next.js storefront with Stripe payment integration, admin dashboard, and inventory management.',
    client: 'ABC Tech Solutions',
    projectManager: 'Karthik Raja',
    startDate: '2026-09-01',
    deadline: '2026-10-15',
    status: 'In Progress', // Planning, Not Started, In Progress, At Risk, On Hold, Completed
    health: 'Healthy', // Healthy, At Risk, Delayed
    healthReason: 'All critical milestones on track. 74% completed.',
    priority: 'High',
    budget: 500000,
    spent: 320000,
    revenue: 650000,
    team: ['usr-1', 'usr-2', 'usr-3', 'usr-4'],
    tags: ['Web', 'React', 'E-Commerce', 'Priority'],
    logo: '🛍️',
    color: '#3b82f6',
    favorite: true,
    pinned: true,
    completion: 74
  },
  {
    id: 'proj-2',
    name: 'Mobile Banking App',
    slug: 'mobile-banking-app',
    description: 'Cross-platform React Native app with biometric login, transaction history, and QR payments.',
    client: 'Apex Global Financial',
    projectManager: 'Priya Sharma',
    startDate: '2026-08-15',
    deadline: '2026-10-05',
    status: 'At Risk',
    health: 'At Risk',
    healthReason: '7 overdue tasks, Payment API integration blocked, Priya at 94% workload.',
    priority: 'Urgent',
    budget: 850000,
    spent: 620000,
    revenue: 1100000,
    team: ['usr-2', 'usr-3', 'usr-5'],
    tags: ['Mobile', 'iOS', 'Android', 'FinTech'],
    logo: '📱',
    color: '#f59e0b',
    favorite: true,
    pinned: false,
    completion: 61
  },
  {
    id: 'proj-3',
    name: 'Q4 Marketing Campaign',
    slug: 'q4-marketing-campaign',
    description: 'Omnichannel digital campaign for end-of-year product launches and social media growth.',
    client: 'Internal Growth',
    projectManager: 'Rahul Kumar',
    startDate: '2026-09-10',
    deadline: '2026-11-01',
    status: 'In Progress',
    health: 'Healthy',
    healthReason: 'Design assets delivered ahead of schedule.',
    priority: 'Medium',
    budget: 200000,
    spent: 85000,
    revenue: 350000,
    team: ['usr-1', 'usr-4'],
    tags: ['Marketing', 'SEO', 'Design'],
    logo: '🚀',
    color: '#10b981',
    favorite: false,
    pinned: false,
    completion: 91
  },
  {
    id: 'proj-4',
    name: 'Enterprise CRM Migration',
    slug: 'enterprise-crm-migration',
    description: 'Migrating legacy customer records to cloud database with custom analytics dashboard.',
    client: 'Geonixa Systems',
    projectManager: 'Suresh V',
    startDate: '2026-08-01',
    deadline: '2026-10-10',
    status: 'At Risk',
    health: 'Delayed',
    healthReason: 'Data extraction failed schema checks; requires schema re-alignment.',
    priority: 'High',
    budget: 600000,
    spent: 490000,
    revenue: 750000,
    team: ['usr-1', 'usr-5'],
    tags: ['Database', 'Migration', 'Cloud'],
    logo: '🗄️',
    color: '#ef4444',
    favorite: false,
    pinned: true,
    completion: 34
  }
];

export const initialTasks = [
  {
    id: 'tsk-101',
    title: 'Complete Payment API Integration',
    description: 'Integrate Stripe SDK for payment gateways, webhook listeners, and auto-invoicing.',
    projectId: 'proj-1',
    projectName: 'E-Commerce Website',
    assigneeId: 'usr-2',
    assigneeName: 'Rahul Kumar',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    creatorId: 'usr-1',
    priority: 'Urgent', // Urgent, High, Medium, Low
    status: 'In Progress', // Backlog, Todo, In Progress, Review, Blocked, Completed
    startDate: '2026-09-20',
    dueDate: '2026-09-29', // Due today
    estimatedHours: 8,
    actualHours: 5.7,
    isTimerRunning: true,
    tags: ['Backend', 'API', 'Stripe'],
    subtasks: [
      { id: 'sub-1', title: 'Create database schema for payments', completed: true },
      { id: 'sub-2', title: 'Implement Stripe Checkout API route', completed: true },
      { id: 'sub-3', title: 'Setup Webhook listener for payment events', completed: true },
      { id: 'sub-4', title: 'Integrate OTP verification step', completed: false },
      { id: 'sub-5', title: 'End-to-end sandbox testing', completed: false }
    ],
    dependencies: [],
    blockedBy: [],
    watchers: ['usr-1', 'usr-3'],
    commentsCount: 6,
    type: 'Task'
  },
  {
    id: 'tsk-102',
    title: 'Design Homepage UI & Wireframes',
    description: 'Responsive layout design for hero banner, product grid, user testimonial carousel, and footer.',
    projectId: 'proj-1',
    projectName: 'E-Commerce Website',
    assigneeId: 'usr-3',
    assigneeName: 'Priya Sharma',
    assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    creatorId: 'usr-1',
    priority: 'High',
    status: 'Review',
    startDate: '2026-09-15',
    dueDate: '2026-09-29',
    estimatedHours: 12,
    actualHours: 11.5,
    isTimerRunning: false,
    tags: ['Figma', 'UI/UX', 'Design'],
    subtasks: [
      { id: 'sub-201', title: 'Wireframes & layout grid', completed: true },
      { id: 'sub-202', title: 'Color palette & typography', completed: true },
      { id: 'sub-203', title: 'Figma interactive prototype', completed: true }
    ],
    dependencies: [],
    blockedBy: [],
    watchers: ['usr-1'],
    commentsCount: 3,
    type: 'Task'
  },
  {
    id: 'tsk-103',
    title: 'Frontend Component Development',
    description: 'Convert Figma components into modular Next.js components using Tailwind CSS.',
    projectId: 'proj-1',
    projectName: 'E-Commerce Website',
    assigneeId: 'usr-2',
    assigneeName: 'Rahul Kumar',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    creatorId: 'usr-1',
    priority: 'High',
    status: 'Blocked',
    startDate: '2026-09-28',
    dueDate: '2026-10-02',
    estimatedHours: 16,
    actualHours: 2.0,
    isTimerRunning: false,
    tags: ['React', 'Frontend', 'Tailwind'],
    subtasks: [
      { id: 'sub-301', title: 'Navbar & Header components', completed: true },
      { id: 'sub-302', title: 'Product Card grid', completed: false },
      { id: 'sub-303', title: 'Checkout summary card', completed: false }
    ],
    dependencies: ['tsk-102'],
    blockedBy: ['tsk-102 (Design Homepage UI)'],
    watchers: ['usr-1', 'usr-3'],
    commentsCount: 2,
    type: 'Task'
  },
  {
    id: 'tsk-104',
    title: 'Login Button Unresponsive on Chrome Mobile',
    description: 'User reported tap event bug on Android Chrome version 124 when entering email address.',
    projectId: 'proj-2',
    projectName: 'Mobile Banking App',
    assigneeId: 'usr-2',
    assigneeName: 'Rahul Kumar',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    creatorId: 'usr-3',
    priority: 'Urgent',
    status: 'In Progress',
    startDate: '2026-09-27',
    dueDate: '2026-09-28', // Overdue
    estimatedHours: 4,
    actualHours: 5.2,
    isTimerRunning: false,
    tags: ['Bug', 'Mobile', 'Chrome'],
    subtasks: [
      { id: 'sub-401', title: 'Reproduce bug on Android simulator', completed: true },
      { id: 'sub-402', title: 'Fix pointer-events CSS overlap', completed: false }
    ],
    dependencies: [],
    blockedBy: [],
    watchers: ['usr-1', 'usr-3'],
    commentsCount: 8,
    type: 'Bug'
  },
  {
    id: 'tsk-105',
    title: 'Database Schema Migration to PostgreSQL',
    description: 'Migrate MongoDB documents into normalized PostgreSQL tables for transaction safety.',
    projectId: 'proj-4',
    projectName: 'Enterprise CRM Migration',
    assigneeId: 'usr-5',
    assigneeName: 'Suresh V',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    creatorId: 'usr-1',
    priority: 'High',
    status: 'In Progress',
    startDate: '2026-09-20',
    dueDate: '2026-10-04',
    estimatedHours: 20,
    actualHours: 14.0,
    isTimerRunning: false,
    tags: ['Postgres', 'SQL', 'Database'],
    subtasks: [
      { id: 'sub-501', title: 'Design ER diagram', completed: true },
      { id: 'sub-502', title: 'Write SQL migration scripts', completed: true },
      { id: 'sub-503', title: 'Verify data integrity checksums', completed: false }
    ],
    dependencies: [],
    blockedBy: [],
    watchers: ['usr-1'],
    commentsCount: 4,
    type: 'Task'
  }
];

export const initialTeamMembers = [
  {
    id: 'usr-1',
    name: 'Karthik Raja',
    email: 'karthik@workorbit.io',
    role: 'Lead Architect / PM',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    workload: 80,
    activeTasksCount: 6,
    completedTasksCount: 24,
    overdueTasksCount: 1,
    availability: 'Online',
    location: 'Bangalore, IN (IST)',
    skills: ['System Design', 'React', 'Node.js', 'Project Management'],
    hoursLoggedThisWeek: 34.5,
    dailyCapacity: [100, 100, 90, 80, 70]
  },
  {
    id: 'usr-2',
    name: 'Rahul Kumar',
    email: 'rahul@workorbit.io',
    role: 'Senior Frontend Developer',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    workload: 50,
    activeTasksCount: 5,
    completedTasksCount: 19,
    overdueTasksCount: 3,
    availability: 'In Meeting',
    location: 'Delhi, IN (IST)',
    skills: ['Next.js', 'Tailwind', 'Stripe', 'TypeScript'],
    hoursLoggedThisWeek: 31.3,
    dailyCapacity: [60, 80, 75, 50, 40]
  },
  {
    id: 'usr-3',
    name: 'Priya Sharma',
    email: 'priya@workorbit.io',
    role: 'Lead Product Designer',
    department: 'Design',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    workload: 94, // Overloaded alert
    activeTasksCount: 14,
    completedTasksCount: 28,
    overdueTasksCount: 2,
    availability: 'Online',
    location: 'Mumbai, IN (IST)',
    skills: ['Figma', 'UI/UX', 'User Research', 'Design Systems'],
    hoursLoggedThisWeek: 42.0,
    dailyCapacity: [100, 100, 100, 95, 90]
  },
  {
    id: 'usr-4',
    name: 'Suresh V',
    email: 'suresh@workorbit.io',
    role: 'Backend & DevOps Engineer',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    workload: 40, // Capacity available
    activeTasksCount: 3,
    completedTasksCount: 15,
    overdueTasksCount: 0,
    availability: 'Online',
    location: 'Hyderabad, IN (IST)',
    skills: ['PostgreSQL', 'Docker', 'AWS', 'Python'],
    hoursLoggedThisWeek: 28.0,
    dailyCapacity: [40, 50, 40, 30, 40]
  }
];

export const initialMeetings = [
  {
    id: 'mtg-1',
    time: '10:30 AM',
    title: 'ABC Tech Client Sprint Sync',
    project: 'E-Commerce Website',
    attendees: ['Karthik Raja', 'Rahul Kumar', 'Priya Sharma'],
    link: 'https://meet.workorbit.io/abc-sprint'
  },
  {
    id: 'mtg-2',
    time: '12:00 PM',
    title: 'Mobile Banking App API Architecture Review',
    project: 'Mobile Banking App',
    attendees: ['Priya Sharma', 'Suresh V'],
    link: 'https://meet.workorbit.io/mobile-arch'
  },
  {
    id: 'mtg-3',
    time: '03:30 PM',
    title: 'Q4 Marketing Asset Design Review',
    project: 'Q4 Marketing Campaign',
    attendees: ['Karthik Raja', 'Priya Sharma'],
    link: 'https://meet.workorbit.io/design-review'
  }
];

export const initialAutomations = [
  {
    id: 'aut-1',
    name: 'Overdue Task Escalation',
    trigger: 'WHEN Task becomes Overdue',
    action: 'Notify Assignee & Project Manager AND Set Priority = Urgent',
    status: 'Active',
    runsCount: 42
  },
  {
    id: 'aut-2',
    name: 'Auto-Move Completed Tasks',
    trigger: 'WHEN Task Status becomes Completed',
    action: 'Move Task to Done Column AND Post Update in Campfire Chat',
    status: 'Active',
    runsCount: 128
  },
  {
    id: 'aut-3',
    name: 'New Project Onboarding Generator',
    trigger: 'WHEN New Project Created',
    action: 'Create default milestones, assign core team, setup folder hierarchy',
    status: 'Active',
    runsCount: 9
  },
  {
    id: 'aut-4',
    name: 'WhatsApp Task Dispatcher',
    trigger: 'WHEN Task Assigned to Team Member',
    action: 'Send instant push message to assignee via WhatsApp WorkOrbit bot',
    status: 'Active',
    runsCount: 84
  }
];

export const initialGoals = [
  {
    id: 'gol-1',
    title: 'Q4 Company Revenue & Deliverables Target',
    target: '₹50,00,000',
    current: '₹41,00,000',
    percentage: 82,
    category: 'Finance',
    deadline: '2026-12-31'
  },
  {
    id: 'gol-2',
    title: 'Achieve 95% On-Time Project Delivery Rate',
    target: '95%',
    current: '84%',
    percentage: 84,
    category: 'Operations',
    deadline: '2026-10-30'
  },
  {
    id: 'gol-3',
    title: 'Deploy AI Risk Assessment Engine across all active client workspaces',
    target: '100% Workspaces',
    current: '75%',
    percentage: 75,
    category: 'Product & Tech',
    deadline: '2026-10-15'
  }
];

export const initialDecisions = [
  {
    id: 'dec-23',
    number: 23,
    title: 'Use PostgreSQL instead of MongoDB for Enterprise CRM',
    date: '2026-09-25',
    madeBy: 'Engineering Team (Karthik & Suresh)',
    reason: 'Better relational data consistency, ACID compliance for customer transactions, and native JSONB indexing support.',
    project: 'Enterprise CRM Migration'
  },
  {
    id: 'dec-22',
    number: 22,
    title: 'Standardize UI Design Tokens in Figma & Tailwind',
    date: '2026-09-18',
    madeBy: 'Design & Frontend Team',
    reason: 'Streamline component reusability and cut front-end development cycle time by 30%.',
    project: 'E-Commerce Website'
  }
];

export const initialChatMessages = [
  {
    id: 'msg-1',
    sender: 'Karthik Raja',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    time: '10:15 AM',
    channel: '#general',
    text: 'Good morning team! Please check the updated sprint backlog for the E-Commerce Website. Payment API integration is due today @Rahul Kumar.',
    reactions: ['👍 4', '🚀 2'],
    pinned: true
  },
  {
    id: 'msg-2',
    sender: 'Rahul Kumar',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    time: '10:18 AM',
    channel: '#general',
    text: 'On it! Currently running end-to-end Stripe webhook tests. Will update once ready for testing.',
    reactions: ['🙌 3'],
    pinned: false
  },
  {
    id: 'msg-3',
    sender: 'Priya Sharma',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    time: '10:30 AM',
    channel: '#general',
    text: 'Uploaded the latest Figma wireframes `e-commerce-v2-final.fig`. Please take a look when you get a chance!',
    fileAttachment: 'e-commerce-v2-final.fig (14.2 MB)',
    reactions: ['❤️ 5'],
    pinned: false
  }
];

export const initialFiles = [
  {
    id: 'file-1',
    name: 'E-Commerce UI Specs & Design Tokens.pdf',
    size: '4.8 MB',
    version: 'v3',
    updatedAt: '2026-09-28',
    project: 'E-Commerce Website',
    folder: 'Designs',
    tag: 'Design'
  },
  {
    id: 'file-2',
    name: 'Stripe Payment Gateway Architecture.docx',
    size: '1.2 MB',
    version: 'v2',
    updatedAt: '2026-09-25',
    project: 'E-Commerce Website',
    folder: 'Documents',
    tag: 'Technical'
  },
  {
    id: 'file-3',
    name: 'Client SLA & Statement of Work 2026.pdf',
    size: '2.4 MB',
    version: 'v1',
    updatedAt: '2026-09-02',
    project: 'E-Commerce Website',
    folder: 'Contracts',
    tag: 'Legal'
  }
];

export const initialTemplates = [
  { id: 'tpl-1', title: 'Website Development Sprint', tasksCount: 8, category: 'Engineering' },
  { id: 'tpl-2', title: 'Mobile App Launch Checklist', tasksCount: 12, category: 'Mobile' },
  { id: 'tpl-3', title: 'Client Onboarding & Kickoff', tasksCount: 6, category: 'Agency' },
  { id: 'tpl-4', title: 'Q4 Product Marketing Campaign', tasksCount: 10, category: 'Marketing' }
];
