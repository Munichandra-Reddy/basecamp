import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const WorkspaceContext = createContext();

const initialWorkspaces = [
  { id: 1, name: 'ABC Technologies', slug: 'abc-technologies', subscription_plan: 'Pro', role: 'Workspace Admin', member_count: 5, project_count: 3 },
  { id: 2, name: 'Geonixa', slug: 'geonixa', subscription_plan: 'Business', role: 'Member', member_count: 12, project_count: 6 },
  { id: 3, name: 'Personal Projects', slug: 'personal-projects', subscription_plan: 'Free', role: 'Workspace Admin', member_count: 1, project_count: 2 }
];

export function WorkspaceProvider({ children }) {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [activeWorkspace, setActiveWorkspace] = useState(initialWorkspaces[0]);
  const [activeProject, setActiveProject] = useState({ id: 1, name: 'E-Commerce Website', slug: 'e-commerce-website' });

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get('/workspaces');
      if (res.data && res.data.length > 0) {
        setWorkspaces(res.data);
        const savedId = localStorage.getItem('teamflow_active_workspace_id');
        const found = res.data.find(w => w.id === parseInt(savedId)) || res.data[0];
        setActiveWorkspace(found);
      }
    } catch (err) {
      // Keep initial demo workspace
    }
  };

  const switchWorkspace = (ws) => {
    setActiveWorkspace(ws);
    localStorage.setItem('teamflow_active_workspace_id', ws.id);
  };

  const createWorkspace = async (name, slug) => {
    try {
      const res = await api.post('/workspaces', { name, slug });
      const newWs = res.data;
      setWorkspaces(prev => [...prev, newWs]);
      switchWorkspace(newWs);
      return { success: true, workspace: newWs };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to create workspace.' };
    }
  };

  const updateWorkspaceSettings = async (id, name) => {
    try {
      const res = await api.put(`/workspaces/${id}`, { name });
      const updatedWs = res.data;
      setWorkspaces(prev => prev.map(w => w.id === updatedWs.id ? { ...w, ...updatedWs } : w));
      if (activeWorkspace?.id === updatedWs.id) {
        setActiveWorkspace(prev => ({ ...prev, ...updatedWs }));
      }
      return { success: true, workspace: updatedWs };
    } catch (err) {
      setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, name } : w));
      if (activeWorkspace?.id === id) {
        setActiveWorkspace(prev => ({ ...prev, name }));
      }
      return { success: true };
    }
  };

  return (
    <WorkspaceContext.Provider value={{
      workspaces,
      activeWorkspace,
      activeProject,
      switchWorkspace,
      createWorkspace,
      updateWorkspaceSettings,
      setActiveProject,
      refreshWorkspaces: fetchWorkspaces
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => useContext(WorkspaceContext);
