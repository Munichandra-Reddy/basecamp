import React from 'react';
import ProjectGrid from '../components/projects/ProjectGrid';

export default function ProjectsPage({ onOpenNewProject }) {
  return <ProjectGrid onOpenNewProject={onOpenNewProject} />;
}
