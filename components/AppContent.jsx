import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './common/Navbar';
import Sidebar from './common/Sidebar';
import GlobalSearchModal from './common/GlobalSearchModal';
import CreateTaskModal from './tasks/CreateTaskModal';
import NewProjectModal from './projects/NewProjectModal';
import WorkspaceModal from './workspace/WorkspaceModal';
import SubscriptionModal from './pricing/SubscriptionModal';

import LandingPage from './landing/LandingPage';
import MainDashboard from './dashboard/MainDashboard';
import ProjectGrid from './projects/ProjectGrid';
import ProjectOverview from './projects/ProjectOverview';
import TaskKanbanBoard from './tasks/TaskKanbanBoard';
import ScheduleCalendar from './calendar/ScheduleCalendar';
import ProjectChatRoom from './chat/ProjectChatRoom';
import FileManager from './files/FileManager';
import TeamDirectory from './team/TeamDirectory';
import CheckinSection from './checkins/CheckinSection';
import AnalyticsDashboard from './reports/AnalyticsDashboard';
import SettingsTabs from './settings/SettingsTabs';

function MainLayout() {
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
            <Route path="/dashboard" element={<MainDashboard onOpenCreateTask={() => setShowCreateTask(true)} />} />
            <Route path="/projects" element={<ProjectGrid onOpenNewProject={() => setShowNewProject(true)} />} />
            <Route path="/projects/:id" element={<ProjectOverview onOpenCreateTask={() => setShowCreateTask(true)} />} />
            <Route path="/tasks" element={<TaskKanbanBoard onOpenCreateTask={() => setShowCreateTask(true)} />} />
            <Route path="/calendar" element={<ScheduleCalendar />} />
            <Route path="/chat" element={<ProjectChatRoom projectId={1} />} />
            <Route path="/files" element={<FileManager projectId={1} />} />
            <Route path="/team" element={<TeamDirectory />} />
            <Route path="/checkins" element={<CheckinSection />} />
            <Route path="/reports" element={<AnalyticsDashboard />} />
            <Route path="/settings" element={<SettingsTabs />} />
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

export default function AppContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}
