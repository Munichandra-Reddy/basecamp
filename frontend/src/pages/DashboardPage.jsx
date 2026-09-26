import React from 'react';
import MainDashboard from '../components/dashboard/MainDashboard';

export default function DashboardPage({ onOpenCreateTask }) {
  return <MainDashboard onOpenCreateTask={onOpenCreateTask} />;
}
