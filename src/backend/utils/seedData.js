import bcrypt from 'bcryptjs';
import db from '../config/db.js';

export async function seedInitialData() {
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount && userCount.count > 0) {
    return; // Data already seeded
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Users
  const users = [
    { name: 'Reyhan Adinata', email: 'reyhan@abctechnologies.com', role: 'Super Admin', status: 'Active', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { name: 'Rahul Kumar', email: 'rahul@abctechnologies.com', role: 'Project Manager', status: 'Active', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { name: 'Priya Sharma', email: 'priya@abctechnologies.com', role: 'UI/UX Designer', status: 'Active', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { name: 'Chandra Reddy', email: 'chandra@abctechnologies.com', role: 'Backend Developer', status: 'Active', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { name: 'Suresh Babu', email: 'suresh@abctechnologies.com', role: 'Frontend Developer', status: 'Away', avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' }
  ];

  const userIds = [];
  for (const u of users) {
    const res = await db.run(
      `INSERT INTO users (name, email, password, avatar_url, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [u.name, u.email, hashedPassword, u.avatar_url, u.role, u.status]
    );
    userIds.push(res.lastID);
  }

  const [reyhanId, rahulId, priyaId, chandraId, sureshId] = userIds;

  // 2. Workspaces
  const ws1 = await db.run(
    `INSERT INTO workspaces (name, slug, owner_id, subscription_plan) VALUES (?, ?, ?, ?)`,
    ['ABC Technologies', 'abc-technologies', reyhanId, 'Pro']
  );
  const ws2 = await db.run(
    `INSERT INTO workspaces (name, slug, owner_id, subscription_plan) VALUES (?, ?, ?, ?)`,
    ['Geonixa', 'geonixa', reyhanId, 'Business']
  );
  const ws3 = await db.run(
    `INSERT INTO workspaces (name, slug, owner_id, subscription_plan) VALUES (?, ?, ?, ?)`,
    ['Personal Projects', 'personal-projects', reyhanId, 'Free']
  );

  const mainWsId = ws1.lastID;

  // Workspace Members
  for (const uId of userIds) {
    const role = uId === reyhanId ? 'Workspace Admin' : uId === rahulId ? 'Project Manager' : 'Member';
    await db.run(
      `INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, ?)`,
      [mainWsId, uId, role]
    );
    await db.run(
      `INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, ?)`,
      [ws2.lastID, uId, 'Member']
    );
  }

  // 3. Tags
  const tags = [
    { name: '#frontend', color: '#3B82F6' },
    { name: '#backend', color: '#10B981' },
    { name: '#design', color: '#F59E0B' },
    { name: '#bug', color: '#EF4444' },
    { name: '#urgent', color: '#8B5CF6' },
    { name: '#testing', color: '#EC4899' }
  ];
  for (const t of tags) {
    await db.run(`INSERT INTO tags (workspace_id, name, color) VALUES (?, ?, ?)`, [mainWsId, t.name, t.color]);
  }

  // 4. Projects
  const proj1 = await db.run(
    `INSERT INTO projects (workspace_id, name, description, owner_id, start_date, due_date, status, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [mainWsId, 'E-Commerce Website', 'Full-stack online store with payment gateway and product management', rahulId, '2026-09-01', '2026-10-30', 'Active', 75]
  );
  const proj2 = await db.run(
    `INSERT INTO projects (workspace_id, name, description, owner_id, start_date, due_date, status, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [mainWsId, 'Mobile App Redesign', 'iOS & Android native UI overhaul and user onboarding optimization', priyaId, '2026-08-15', '2026-11-15', 'Active', 40]
  );
  const proj3 = await db.run(
    `INSERT INTO projects (workspace_id, name, description, owner_id, start_date, due_date, status, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [mainWsId, 'Design System Audit', 'Comprehensive UI audit across web and mobile design tokens', reyhanId, '2026-09-10', '2026-09-28', 'Active', 90]
  );

  const p1Id = proj1.lastID;

  // Project Members
  for (const uId of userIds) {
    await db.run(`INSERT INTO project_members (project_id, user_id) VALUES (?, ?)`, [p1Id, uId]);
    await db.run(`INSERT INTO project_members (project_id, user_id) VALUES (?, ?)`, [proj2.lastID, uId]);
  }

  // 5. Tasks
  const tasksData = [
    { project_id: p1Id, title: 'Copywriting Review', description: 'Review website landing page text and marketing banners', assignee_id: priyaId, due_date: '2026-09-28', priority: 'Medium', status: 'To Do', est: 8, tracked: 0 },
    { project_id: p1Id, title: 'UX Audit', description: 'Evaluate user navigation flow across checkout steps', assignee_id: sureshId, due_date: '2026-09-29', priority: 'Medium', status: 'To Do', est: 12, tracked: 0 },
    { project_id: p1Id, title: 'Sprint Planning', description: 'Define user stories for next sprint iteration', assignee_id: rahulId, due_date: '2026-09-30', priority: 'Medium', status: 'To Do', est: 6, tracked: 0 },
    { project_id: p1Id, title: 'Wireframe v2 Upload', description: 'Upload updated dashboard wireframes to Figma export folder', assignee_id: priyaId, due_date: '2026-09-25', priority: 'Low', status: 'In Progress', est: 16, tracked: 28800 },
    { project_id: p1Id, title: 'QA Testing', description: 'Execute integration tests on payment endpoints', assignee_id: chandraId, due_date: '2026-09-26', priority: 'Low', status: 'In Progress', est: 20, tracked: 36000 },
    { project_id: p1Id, title: 'Prototype Review', description: 'Conduct internal team walkthrough of prototype interactive flows', assignee_id: reyhanId, due_date: '2026-09-27', priority: 'Medium', status: 'In Progress', est: 10, tracked: 18000 },
    { project_id: p1Id, title: 'Design System Audit', description: 'Complete typography and color token audit', assignee_id: priyaId, due_date: '2026-09-20', priority: 'High', status: 'Completed', est: 15, tracked: 54000 },
    { project_id: p1Id, title: 'Landing Page Copywriting', description: 'Finalize value propositions and feature highlights', assignee_id: sureshId, due_date: '2026-09-21', priority: 'High', status: 'Completed', est: 10, tracked: 36000 },
    { project_id: p1Id, title: 'Mobile App Redesign', description: 'Finish splash screen and onboarding illustrations', assignee_id: priyaId, due_date: '2026-09-22', priority: 'High', status: 'Completed', est: 25, tracked: 90000 },
    { project_id: p1Id, title: 'Review Landing Page', description: 'Final review of responsiveness on mobile browsers', assignee_id: rahulId, due_date: '2026-09-18', priority: 'Medium', status: 'Overdue', est: 14, tracked: 10800 },
    { project_id: p1Id, title: 'Complete API Integration', description: 'Connect backend REST routes to React Redux store', assignee_id: chandraId, due_date: '2026-09-19', priority: 'High', status: 'Overdue', est: 18, tracked: 43200 }
  ];

  for (const t of tasksData) {
    const res = await db.run(
      `INSERT INTO tasks (project_id, title, description, assignee_id, due_date, priority, status, estimated_hours, tracked_seconds) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [t.project_id, t.title, t.description, t.assignee_id, t.due_date, t.priority, t.status, t.est, t.tracked]
    );

    await db.run(`INSERT INTO subtasks (task_id, title, is_completed) VALUES (?, ?, ?)`, [res.lastID, 'Header section layout', 1]);
    await db.run(`INSERT INTO subtasks (task_id, title, is_completed) VALUES (?, ?, ?)`, [res.lastID, 'Hero section components', 1]);
    await db.run(`INSERT INTO subtasks (task_id, title, is_completed) VALUES (?, ?, ?)`, [res.lastID, 'Feature grid responsiveness', 0]);
    await db.run(`INSERT INTO subtasks (task_id, title, is_completed) VALUES (?, ?, ?)`, [res.lastID, 'Footer links & CTA', 0]);

    await db.run(
      `INSERT INTO task_comments (task_id, user_id, content) VALUES (?, ?, ?)`,
      [res.lastID, rahulId, 'Please ensure the mobile layout follows the latest Figma specifications.']
    );
    await db.run(
      `INSERT INTO task_comments (task_id, user_id, content) VALUES (?, ?, ?)`,
      [res.lastID, priyaId, 'Sure, updating the grid layout today. Will post preview links soon.']
    );
  }

  // 6. Messages
  const messages = [
    { project_id: p1Id, user_id: rahulId, content: 'API integration is completed for authentication and user sessions.' },
    { project_id: p1Id, user_id: priyaId, content: 'Awesome! I will start QA testing the login and workspace creation flows.' },
    { project_id: p1Id, user_id: chandraId, content: 'Great progress team! Please complete all task reviews before Friday check-in.' },
    { project_id: p1Id, user_id: sureshId, content: 'Uploaded the updated homepage wireframe file in Docs & Files.' }
  ];
  for (const m of messages) {
    await db.run(
      `INSERT INTO messages (project_id, user_id, content) VALUES (?, ?, ?)`,
      [m.project_id, m.user_id, m.content]
    );
  }

  // 7. Docs & Files
  const f1 = await db.run(`INSERT INTO folders (project_id, name) VALUES (?, ?)`, [p1Id, 'Design']);
  const f2 = await db.run(`INSERT INTO folders (project_id, name) VALUES (?, ?)`, [p1Id, 'Development']);
  const f3 = await db.run(`INSERT INTO folders (project_id, name) VALUES (?, ?)`, [p1Id, 'Requirements']);

  await db.run(
    `INSERT INTO files (project_id, folder_id, name, file_url, file_size, uploaded_by, version) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [p1Id, f1.lastID, 'homepage.fig', 'https://example.com/homepage.fig', 12450000, priyaId, '1.2']
  );
  await db.run(
    `INSERT INTO files (project_id, folder_id, name, file_url, file_size, uploaded_by, version) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [p1Id, f2.lastID, 'API Documentation.pdf', 'https://example.com/api_docs.pdf', 3450000, chandraId, '2.0']
  );

  // 8. Calendar Events
  await db.run(
    `INSERT INTO calendar_events (workspace_id, project_id, title, event_type, start_time, end_time, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [mainWsId, p1Id, 'API Architecture Review', 'Meeting', '2026-09-24T10:00:00', '2026-09-24T11:30:00', 'Sprint technical review']
  );
  await db.run(
    `INSERT INTO calendar_events (workspace_id, project_id, title, event_type, start_time, end_time, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [mainWsId, p1Id, 'Team Weekly Sync', 'Meeting', '2026-09-25T14:00:00', '2026-09-25T15:00:00', 'All-hands project alignment']
  );

  // 9. Milestones
  await db.run(
    `INSERT INTO milestones (project_id, title, due_date, status, progress) VALUES (?, ?, ?, ?, ?)`,
    [p1Id, 'Planning & Architecture', '2026-09-05', 'Completed', 100]
  );
  await db.run(
    `INSERT INTO milestones (project_id, title, due_date, status, progress) VALUES (?, ?, ?, ?, ?)`,
    [p1Id, 'UI/UX Wireframes', '2026-09-15', 'Completed', 100]
  );

  // 10. Check-ins
  await db.run(
    `INSERT INTO checkins (project_id, user_id, status, completed_work, next_plan, blockers) VALUES (?, ?, ?, ?, ?, ?)`,
    [p1Id, rahulId, 'On track', 'Completed Login API & workspace middleware integration.', 'Working on real-time web socket broadcasting.', 'None at present.']
  );

  // 11. Notifications
  await db.run(
    `INSERT INTO notifications (user_id, type, title, message, link_url) VALUES (?, ?, ?, ?, ?)`,
    [reyhanId, 'task_assigned', 'Task Assigned', 'Rahul assigned you a task: Wireframe v2 Upload', '/tasks']
  );

  // 12. Activity Logs
  await db.run(
    `INSERT INTO activity_logs (workspace_id, user_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?, ?)`,
    [mainWsId, rahulId, 'completed_task', 'task', 1, 'Rahul completed "Login API"']
  );

  console.log('Database successfully seeded with TeamFlow initial data.');
}
