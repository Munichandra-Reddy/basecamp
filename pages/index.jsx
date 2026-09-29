import React from 'react';
import { WorkOrbitProvider, useWorkOrbit } from '../context/WorkOrbitContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardView from '../components/DashboardView';
import ProjectsView from '../components/ProjectsView';
import TasksView from '../components/TasksView';
import TeamWorkloadView from '../components/TeamWorkloadView';
import CommunicationView from '../components/CommunicationView';
import ResourcesView from '../components/ResourcesView';
import InsightsView from '../components/InsightsView';
import AutomationView from '../components/AutomationView';
import AIView from '../components/AIView';
import ClientPortalView from '../components/ClientPortalView';
import UniversalSearchModal from '../components/UniversalSearchModal';
import QuickTaskModal from '../components/QuickTaskModal';

function MainAppContent() {
  const { activeTab } = useWorkOrbit();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'all-projects':
      case 'kanban':
      case 'gantt':
      case 'roadmap':
        return <ProjectsView />;
      case 'my-tasks':
      case 'my-calendar':
      case 'inbox':
        return <TasksView />;
      case 'people':
      case 'teams':
      case 'workload':
        return <TeamWorkloadView />;
      case 'chat':
      case 'messages':
      case 'meetings':
        return <CommunicationView />;
      case 'files':
      case 'docs':
      case 'wiki':
        return <ResourcesView />;
      case 'reports':
      case 'goals':
      case 'analytics':
        return <InsightsView />;
      case 'workflows':
      case 'integrations':
      case 'webhooks':
        return <AutomationView />;
      case 'ai-assistant':
      case 'project-insights':
      case 'meeting-ai':
        return <AIView />;
      case 'client-portal':
      case 'forms':
      case 'settings':
        return <ClientPortalView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* 9-Category Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <UniversalSearchModal />
      <QuickTaskModal />
    </div>
  );
}

export default function Home() {
  return (
    <WorkOrbitProvider>
      <MainAppContent />
    </WorkOrbitProvider>
  );
}
