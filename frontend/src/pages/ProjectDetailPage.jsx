import React from 'react';
import ProjectOverview from '../components/projects/ProjectOverview';

export default function ProjectDetailPage({ onOpenCreateTask }) {
  return <ProjectOverview onOpenCreateTask={onOpenCreateTask} />;
}
