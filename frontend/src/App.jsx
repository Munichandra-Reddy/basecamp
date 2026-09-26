import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import GlobalSearchModal from './components/common/GlobalSearchModal';
import CreateTaskModal from './components/tasks/CreateTaskModal';
import NewProjectModal from './components/projects/NewProjectModal';
import WorkspaceModal from './components/workspace/WorkspaceModal';
import SubscriptionModal from './components/pricing/SubscriptionModal';

import LandingPage from './components/landing/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import ChatPage from './pages/ChatPage';
import FilesPage from './pages/FilesPage';
import TeamPage from './pages/TeamPage';
import CheckinsPage from './pages/CheckinsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const [showSearch, setShowSearch] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  if (isLandingPage || !user) {
    return <LandingPage onNavigateDashboard={() => navigate('/dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setShowSearch(true)}
        onOpenCreateTask={() => setShowCreateTask(true)}
        onOpenCreateWorkspace={() => setShowCreateWorkspace(true)}
        onOpenPricing={() => setShowPricing(true)}
      />

      {/* Main Layout Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content Container */}
        <main className="flex-1 p-6 max-w-7xl mx-auto overflow-x-hidden">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage onOpenCreateTask={() => setShowCreateTask(true)} />} />
            <Route path="/projects" element={<ProjectsPage onOpenNewProject={() => setShowNewProject(true)} />} />
            <Route path="/projects/:id" element={<ProjectDetailPage onOpenCreateTask={() => setShowCreateTask(true)} />} />
            <Route path="/tasks" element={<TasksPage onOpenCreateTask={() => setShowCreateTask(true)} />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/files" element={<FilesPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/checkins" element={<CheckinsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>

      {/* Modals Overlay */}
      <GlobalSearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <CreateTaskModal isOpen={showCreateTask} onClose={() => setShowCreateTask(false)} />
      <NewProjectModal isOpen={showNewProject} onClose={() => setShowNewProject(false)} />
      <WorkspaceModal isOpen={showCreateWorkspace} onClose={() => setShowCreateWorkspace(false)} />
      <SubscriptionModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
