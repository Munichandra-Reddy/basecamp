import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialProjects,
  initialTasks,
  initialTeamMembers,
  initialMeetings,
  initialAutomations,
  initialGoals,
  initialDecisions,
  initialChatMessages,
  initialFiles,
  initialTemplates
} from '../data/initialData';

const WorkOrbitContext = createContext();

export function WorkOrbitProvider({ children }) {
  const [activeTab, setActiveTabState] = useState('dashboard');
  const [navHistory, setNavHistory] = useState(['dashboard']);

  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [meetings] = useState(initialMeetings);
  const [automations, setAutomations] = useState(initialAutomations);
  const [goals, setGoals] = useState(initialGoals);
  const [decisions, setDecisions] = useState(initialDecisions);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [files, setFiles] = useState(initialFiles);
  const [templates] = useState(initialTemplates);

  // Search & Modal States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [activeProjectFilter, setActiveProjectFilter] = useState('all');

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'Task Overdue', message: 'Payment API Integration was due today', type: 'urgent', read: false, time: '10m ago' },
    { id: 'notif-2', title: 'Project Risk Detected', message: 'Mobile Banking App risk escalated to High', type: 'warning', read: false, time: '30m ago' },
    { id: 'notif-3', title: 'New Comment', message: 'Karthik mentioned you in E-Commerce sprint', type: 'info', read: true, time: '2h ago' }
  ]);

  // Navigation History Stack (Screening Back Support)
  const setActiveTab = (newTab) => {
    if (newTab !== activeTab) {
      setNavHistory(prev => [...prev, newTab]);
      setActiveTabState(newTab);
    }
  };

  const goBack = () => {
    if (navHistory.length > 1) {
      const updated = [...navHistory];
      updated.pop(); // pop current tab
      const previousTab = updated[updated.length - 1];
      setNavHistory(updated);
      setActiveTabState(previousTab || 'dashboard');
    } else {
      setActiveTabState('dashboard');
    }
  };

  // Timer Tick Interval for active task timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTasks(prev =>
        prev.map(t => {
          if (t.isTimerRunning) {
            return {
              ...t,
              actualHours: parseFloat((t.actualHours + 0.01).toFixed(2))
            };
          }
          return t;
        })
      );
    }, 36000); // simulation tick
    return () => clearInterval(timer);
  }, []);

  // Helper functions
  const toggleProjectFavorite = (id) => {
    setProjects(prev =>
      prev.map(p => p.id === id ? { ...p, favorite: !p.favorite } : p)
    );
  };

  const toggleProjectPinned = (id) => {
    setProjects(prev =>
      prev.map(p => p.id === id ? { ...p, pinned: !p.pinned } : p)
    );
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updated = { ...t, status: newStatus };
          if (newStatus === 'Completed') {
            updated.isTimerRunning = false;
          }
          return updated;
        }
        return t;
      })
    );
  };

  const updateTaskPriority = (taskId, newPriority) => {
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, priority: newPriority } : t)
    );
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const toggleTimer = (taskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return { ...t, isTimerRunning: !t.isTimerRunning };
        }
        return { ...t, isTimerRunning: false }; // pause other timers
      })
    );
  };

  const addTask = (newTask) => {
    const created = {
      id: `tsk-${Date.now()}`,
      startDate: new Date().toISOString().split('T')[0],
      estimatedHours: newTask.estimatedHours || 8,
      actualHours: 0,
      isTimerRunning: false,
      tags: newTask.tags || ['Task'],
      subtasks: newTask.subtasks || [],
      dependencies: [],
      blockedBy: [],
      watchers: ['usr-1'],
      commentsCount: 0,
      type: newTask.type || 'Task',
      status: newTask.status || 'Todo',
      priority: newTask.priority || 'Medium',
      ...newTask
    };
    setTasks(prev => [created, ...prev]);
  };

  const addProject = (newProj) => {
    const created = {
      id: `proj-${Date.now()}`,
      slug: (newProj.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      startDate: new Date().toISOString().split('T')[0],
      status: 'In Progress',
      health: 'Healthy',
      healthReason: 'Newly created project',
      priority: newProj.priority || 'Medium',
      spent: 0,
      revenue: (newProj.budget || 100000) * 1.3,
      team: ['usr-1', 'usr-2'],
      tags: newProj.tags || ['New'],
      logo: newProj.logo || '📁',
      color: '#3b82f6',
      favorite: false,
      pinned: false,
      completion: 0,
      ...newProj
    };
    setProjects(prev => [created, ...prev]);
  };

  const addAutomationRule = (rule) => {
    const newRule = {
      id: `aut-${Date.now()}`,
      status: 'Active',
      runsCount: 0,
      ...rule
    };
    setAutomations(prev => [newRule, ...prev]);
  };

  const addChatMessage = (text, channel = '#general', fileAttachment = null) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'Karthik Raja',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel,
      text,
      fileAttachment,
      reactions: [],
      pinned: false
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const addDecision = (decision) => {
    const newDec = {
      id: `dec-${Date.now()}`,
      number: decisions.length + 24,
      date: new Date().toISOString().split('T')[0],
      madeBy: 'Karthik Raja',
      ...decision
    };
    setDecisions(prev => [newDec, ...prev]);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <WorkOrbitContext.Provider value={{
      activeTab,
      setActiveTab,
      goBack,
      canGoBack: activeTab !== 'dashboard' || navHistory.length > 1,
      projects,
      setProjects,
      tasks,
      setTasks,
      teamMembers,
      setTeamMembers,
      meetings,
      automations,
      goals,
      decisions,
      chatMessages,
      files,
      templates,
      toggleProjectFavorite,
      toggleProjectPinned,
      updateTaskStatus,
      updateTaskPriority,
      toggleSubtask,
      toggleTimer,
      addTask,
      addProject,
      addAutomationRule,
      addChatMessage,
      addDecision,
      searchQuery,
      setSearchQuery,
      isSearchOpen,
      setIsSearchOpen,
      isQuickTaskOpen,
      setIsQuickTaskOpen,
      selectedTaskId,
      setSelectedTaskId,
      selectedProjectId,
      setSelectedProjectId,
      activeProjectFilter,
      setActiveProjectFilter,
      notifications,
      markNotificationsRead
    }}>
      {children}
    </WorkOrbitContext.Provider>
  );
}

export const useWorkOrbit = () => useContext(WorkOrbitContext);
