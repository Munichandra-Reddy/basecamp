import React from 'react';
import TaskKanbanBoard from '../components/tasks/TaskKanbanBoard';

export default function TasksPage({ onOpenCreateTask }) {
  return <TaskKanbanBoard onOpenCreateTask={onOpenCreateTask} />;
}
