import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const WorkspaceContext = createContext();

const initialWorkspaces = [
  { id: 1, name: 'ABC Technologies', slug: 'abc-technologies', subscription_plan: 'Pro', role: 'Workspace Admin', member_count: 5, project_count: 3 },
  { id: 2, name: 'Geonixa', slug: 'geonixa', subscription_plan: 'Business', role: 'Member', member_count: 12, project_count: 6 },
  { id: 3, name: 'Personal Projects', slug: 'personal-projects', subscription_plan: 'Free', role: 'Workspace Admin', member_count: 1, project_count: 2 }
];

const getCustomWorkspaces = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('teamflow_custom_workspaces') || '[]');
  } catch (e) {
    return [];
  }
};

const saveCustomWorkspace = (wsObj) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCustomWorkspaces();
    const updated = [wsObj, ...existing.filter(w => String(w.id) !== String(wsObj.id) && w.slug !== wsObj.slug)];
    localStorage.setItem('teamflow_custom_workspaces', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save workspace to localStorage:', e);
  }
};

const getMergedWorkspaces = (fetchedWorkspaces = []) => {
  const custom = getCustomWorkspaces();
  const map = new Map();

  initialWorkspaces.forEach(w => map.set(String(w.id), w));
  fetchedWorkspaces.forEach(w => map.set(String(w.id), w));
  custom.forEach(w => map.set(String(w.id), w));

  return Array.from(map.values());
};

export function WorkspaceProvider({ children }) {
  const [workspaces, setWorkspaces] = useState(() => getMergedWorkspaces([]));
  const [activeWorkspace, setActiveWorkspace] = useState(() => {
    const all = getMergedWorkspaces([]);
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('teamflow_active_workspace_id');
      const found = all.find(w => String(w.id) === String(savedId));
      if (found) return found;
    }
    return all[0];
  });
  const [activeProject, setActiveProject] = useState({ id: 1, name: 'E-Commerce Website', slug: 'e-commerce-website' });

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get('/workspaces');
      if (res.data && res.data.length > 0) {
        const merged = getMergedWorkspaces(res.data);
        setWorkspaces(merged);
        if (typeof window !== 'undefined') {
          const savedId = localStorage.getItem('teamflow_active_workspace_id');
          const found = merged.find(w => String(w.id) === String(savedId)) || merged[0];
          setActiveWorkspace(found);
        }
      }
    } catch (err) {
      setWorkspaces(getMergedWorkspaces([]));
    }
  };

  const switchWorkspace = (ws) => {
    setActiveWorkspace(ws);
    if (typeof window !== 'undefined') {
      localStorage.setItem('teamflow_active_workspace_id', ws.id);
    }
  };

  const createWorkspace = async (name, slug) => {
    const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const localWs = {
      id: Date.now(),
      name,
      slug: cleanSlug,
      subscription_plan: 'Free',
      role: 'Workspace Admin',
      member_count: 1,
      project_count: 0
    };

    try {
      const res = await api.post('/workspaces', { name, slug: cleanSlug });
      const newWs = res.data || localWs;
      saveCustomWorkspace(newWs);
      setWorkspaces(prev => [newWs, ...prev.filter(w => String(w.id) !== String(newWs.id))]);
      switchWorkspace(newWs);
      return { success: true, workspace: newWs };
    } catch (err) {
      saveCustomWorkspace(localWs);
      setWorkspaces(prev => [localWs, ...prev.filter(w => String(w.id) !== String(localWs.id))]);
      switchWorkspace(localWs);
      return { success: true, workspace: localWs };
    }
  };

  const updateWorkspaceSettings = async (id, name) => {
    try {
      const res = await api.put(`/workspaces/${id}`, { name });
      const updatedWs = res.data;
      setWorkspaces(prev => prev.map(w => String(w.id) === String(updatedWs.id) ? { ...w, ...updatedWs } : w));
      if (String(activeWorkspace?.id) === String(updatedWs.id)) {
        setActiveWorkspace(prev => ({ ...prev, ...updatedWs }));
      }
      saveCustomWorkspace(updatedWs);
      return { success: true, workspace: updatedWs };
    } catch (err) {
      setWorkspaces(prev => prev.map(w => String(w.id) === String(id) ? { ...w, name } : w));
      if (String(activeWorkspace?.id) === String(id)) {
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
