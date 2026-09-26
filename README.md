# 🚀 TeamFlow - Full-Stack Team Collaboration & Project Management SaaS Platform

TeamFlow is a full-stack, enterprise-grade project management platform inspired by the **Atlas** UI design aesthetic. It brings together multi-workspace management, interactive Kanban task boards, real-time Campfire team chat, schedule calendars, document management, automatic check-ins, time tracking, notifications, role-based access control (RBAC), and analytics in one cohesive workspace.

![Atlas Design Inspiration](C:/Users/DELL/.gemini/antigravity/brain/0bb3260f-5be4-4179-9a96-938e01c0daf1/.user_uploaded/media_1790167529486.jpg)

---

## 🌟 Features Implemented

1. **🏠 Landing Page**: Public header, Hero with CTAs (`[Start Free]`, `[View Demo]`), interactive dashboard preview illustration, feature breakdown, solutions, pricing tiers, and FAQ.
2. **🔐 Authentication System**: Registration, Login, Forgot Password, Reset Password, session management, 2FA toggle, and Google/GitHub OAuth UI integration.
3. **🏢 Workspace System**: Multi-workspace management (`ABC Technologies`, `Geonixa`, `Personal Projects`), workspace creation with custom URL slugs, workspace switcher, and workspace-scoped data isolation.
4. **📊 Main Dashboard**: Overview metric cards (Projects: 12, To-dos: 86, Due Soon: 8, Team Online: 14), interactive "My Work" checklist, real-time activity feed, and upcoming schedule calendar.
5. **📁 Projects Management**: Grid/List view, progress calculation (e.g. 75%), status filters (All, Active, Completed, Archived, My Projects), search bar, and project creation modal.
6. **📋 Project Overview**: Tabbed interface (Overview | To-dos | Chat | Schedule | Files | People | Milestones).
7. **✅ To-Do Lists & Task Kanban Board**: Interactive Atlas-inspired Kanban board with columns (`To Do`, `In Progress`, `Completed`, `Overdue`), priority pills (`High`, `Medium`, `Low`), due dates, brand logo tags, subtask progress, and assignee avatars.
8. **🧩 Task Details Modal**: Task descriptions, subtask checkboxes & creation, comments thread with avatars, attachments uploader, tag selector (`#frontend`, `#backend`, `#bug`, `#urgent`), and live Time Tracker with start/pause timer.
9. **💬 Team Chat / Campfire**: Real-time project chat powered by Socket.IO with message stream, reactions (`👍`, `🔥`, `❤️`), typing indicators, @mentions, and search.
10. **📅 Schedule / Calendar**: Interactive Month/Week/Day calendar for meetings, task deadlines, milestones, and team events.
11. **📂 Docs & Files**: Folder directory structure (`Design`, `Development`, `Requirements`, `Reports`), document list with preview modal, upload file modal, versioning details, and deletion.
12. **👥 People / Team Directory**: Member list with live availability indicators (`🟢 Active`, `🟡 Away`), assigned task counts, roles, and invitation modal.
13. **📝 Automatic Check-ins**: Automated Friday status updates questionnaire (`On track`, `At risk`, `Off track`, completed work, next plan, blockers) and project manager summary.
14. **🔔 Notifications Center**: Notification bell dropdown with unread badge count for task assignments, comments, mentions, deadlines, and file uploads.
15. **🔎 Global Search**: Keyboard shortcut (`Cmd/Ctrl + K`) global search modal categorizing projects, tasks, people, and files.
16. **📈 Reports & Analytics**: Metric breakdowns, project progress statistics, overdue alerts, time tracking logs, and team workload capacity bars.
17. **⏱️ Time Tracking**: Task-based timer widget with live seconds counter, start/pause toggle, and estimated vs. tracked hours.
18. **🏷️ Tags & Categorization**: Global tag management for categorizing tasks (`#frontend`, `#backend`, `#urgent`, `#bug`, `#design`, `#testing`).
19. **🎯 Milestones**: Visual milestone progress stepper (`Planning` ✅ → `UI Wireframes` ✅ → `Beta Release Candidate` 🔵).
20. **🛡️ Roles & Permissions (RBAC)**: Role permissions matrix supporting `Super Admin`, `Workspace Admin`, `Project Manager`, `Team Lead`, `Member`, and `Guest`.
21. **⚙️ Settings**: Workspace settings, user profile customization, and security preferences.
22. **💳 SaaS Subscriptions**: Subscription pricing tiers comparison (`Free`, `Pro`, `Business`).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Socket.io-client, React Router DOM v6
- **Backend**: Node.js, Express.js, Socket.IO Server, JWT Auth, Bcryptjs, Multer
- **Database**: SQLite3 (Embedded database with SQL migrations & seed data in `backend/data/teamflow.sqlite`)

---

## 🚀 How to Run TeamFlow Locally

### 1. Quick Start (Windows)
Double-click `start.bat` in the root folder or run:

```bash
# Install backend dependencies & start server
cd backend
npm install
npm run dev

# In a separate terminal, start frontend client
cd frontend
npm install
npm run dev
```

The frontend will be live at `http://localhost:3000` and proxy requests to the backend API at `http://localhost:5000`.

---

## 🔑 Demo Account Credentials

- **Email**: `reyhan@abctechnologies.com`
- **Password**: `password123`
- **Role**: Super Admin / Workspace Admin
