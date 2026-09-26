import React, { useState, useEffect, useRef } from 'react';
import { Folder, FileText, Upload, Download, Trash2, Edit2, Plus, Search, Eye, Info, Check } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const defaultFolders = [
  { id: 1, name: 'Design', count: 3 },
  { id: 2, name: 'Development', count: 2 },
  { id: 3, name: 'Requirements', count: 1 },
  { id: 4, name: 'Reports', count: 1 }
];

const defaultFiles = [
  { id: 1, folder_id: 1, name: 'homepage.fig', size: '12.4 MB', version: 'v1.2', uploader: 'Priya Sharma', date: 'Sep 23' },
  { id: 2, folder_id: 1, name: 'dashboard.fig', size: '18.1 MB', version: 'v2.0', uploader: 'Priya Sharma', date: 'Sep 21' },
  { id: 3, folder_id: 1, name: 'logo.png', size: '850 KB', version: 'v1.0', uploader: 'Reyhan Adinata', date: 'Sep 15' },
  { id: 4, folder_id: 2, name: 'API Documentation.pdf', size: '3.4 MB', version: 'v2.1', uploader: 'Chandra Reddy', date: 'Sep 22' },
  { id: 5, folder_id: 2, name: 'Database.sql', size: '1.2 MB', version: 'v1.0', uploader: 'Rahul Kumar', date: 'Sep 20' },
  { id: 6, folder_id: 3, name: 'requirements.pdf', size: '4.5 MB', version: 'v1.0', uploader: 'Rahul Kumar', date: 'Sep 02' },
  { id: 7, folder_id: 4, name: 'weekly-report.xlsx', size: '920 KB', version: 'v1.1', uploader: 'Suresh Babu', date: 'Sep 19' }
];

const loadCustomFolders = () => {
  try {
    return JSON.parse(localStorage.getItem('teamflow_custom_folders') || '[]');
  } catch (e) {
    return [];
  }
};

const loadCustomFiles = () => {
  try {
    return JSON.parse(localStorage.getItem('teamflow_custom_files') || '[]');
  } catch (e) {
    return [];
  }
};

const saveCustomFile = (fileObj) => {
  try {
    const existing = loadCustomFiles();
    const filtered = existing.filter(f => String(f.id) !== String(fileObj.id));
    const updated = [fileObj, ...filtered];
    localStorage.setItem('teamflow_custom_files', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save file to localStorage:', e);
  }
};

const saveCustomFolder = (folderObj) => {
  try {
    const existing = loadCustomFolders();
    const filtered = existing.filter(f => String(f.id) !== String(folderObj.id));
    const updated = [folderObj, ...filtered];
    localStorage.setItem('teamflow_custom_folders', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save folder to localStorage:', e);
  }
};

const getMergedFolders = (fetched = []) => {
  const custom = loadCustomFolders();
  const customMap = new Map();
  custom.forEach(f => customMap.set(String(f.id), f));

  const baseList = fetched.length > 0 ? fetched.map(f => ({
    id: f.id,
    name: f.name,
    count: f.count || 0
  })) : defaultFolders;

  const combined = [...custom];
  baseList.forEach(f => {
    if (!customMap.has(String(f.id))) {
      combined.push(f);
    }
  });

  return combined;
};

const getMergedFiles = (fetched = []) => {
  const custom = loadCustomFiles();
  const customMap = new Map();
  custom.forEach(f => customMap.set(String(f.id), f));

  const baseList = fetched.length > 0 ? fetched.map(f => ({
    id: f.id,
    folder_id: f.folder_id || 1,
    name: f.name,
    size: f.file_size ? (f.file_size > 1024 * 1024 ? `${(f.file_size / (1024 * 1024)).toFixed(1)} MB` : `${(f.file_size / 1024).toFixed(0)} KB`) : '2.1 MB',
    version: f.version || 'v1.0',
    uploader: f.uploader_name || 'Reyhan Adinata',
    date: f.created_at ? new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Sep 24'
  })) : defaultFiles;

  const combined = [...custom];
  baseList.forEach(f => {
    if (!customMap.has(String(f.id))) {
      combined.push(f);
    }
  });

  return combined;
};

export default function FileManager({ projectId = 1 }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [folders, setFolders] = useState(() => getMergedFolders());
  const [files, setFiles] = useState(() => getMergedFiles());

  const [activeFolderId, setActiveFolderId] = useState(null);
  const [search, setSearch] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  useEffect(() => {
    api.get(`/files/projects/${projectId}/files`)
      .then(res => {
        if (res.data) {
          if (res.data.folders && res.data.folders.length > 0) {
            setFolders(getMergedFolders(res.data.folders));
          }
          if (res.data.files && res.data.files.length > 0) {
            setFiles(getMergedFiles(res.data.files));
          }
        }
      })
      .catch(() => {});
  }, [projectId]);

  const filteredFiles = files.filter(f => {
    const matchesFolder = activeFolderId ? f.folder_id === activeFolderId : true;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const processFileUpload = async (fileName, fileSizeNum = 2200000) => {
    const formattedSize = fileSizeNum > 1024 * 1024
      ? `${(fileSizeNum / (1024 * 1024)).toFixed(1)} MB`
      : `${(fileSizeNum / 1024).toFixed(0)} KB`;

    const newFile = {
      id: Date.now(),
      folder_id: activeFolderId || 1,
      name: fileName,
      size: formattedSize,
      version: 'v1.0',
      uploader: user?.name || 'Reyhan Adinata',
      date: 'Just now'
    };

    saveCustomFile(newFile);

    setFiles(prev => [newFile, ...prev]);

    setUploadSuccessMsg(`"${fileName}" uploaded successfully!`);
    setTimeout(() => setUploadSuccessMsg(''), 3500);

    try {
      await api.post(`/files/projects/${projectId}/upload`, {
        folder_id: activeFolderId || 1,
        name: fileName,
        file_size: fileSizeNum
      });
    } catch (err) {
      // Offline fallback already saved
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    processFileUpload(file.name, file.size);
    e.target.value = '';
  };

  const createFolder = async () => {
    const name = prompt('Enter new folder name:');
    if (!name || !name.trim()) return;

    const trimmedName = name.trim();
    const newFolder = { id: Date.now(), name: trimmedName, count: 0 };

    saveCustomFolder(newFolder);

    setFolders(prev => [...prev, newFolder]);

    try {
      await api.post(`/files/projects/${projectId}/folders`, { name: trimmedName });
    } catch (err) {
      // Offline fallback
    }
  };

  const handleDeleteFile = async (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));

    try {
      const custom = loadCustomFiles().filter(f => String(f.id) !== String(fileId));
      localStorage.setItem('teamflow_custom_files', JSON.stringify(custom));
    } catch (e) {}

    try {
      await api.delete(`/files/${fileId}`);
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Native File Chooser */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Docs & Files</h1>
          <p className="text-xs text-slate-500 mt-0.5">Central file repository for project specs, designs, and reports.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={createFolder}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>New Folder</span>
          </button>

          <button
            onClick={handleUploadClick}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 active:scale-95 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {uploadSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadSuccessMsg}</span>
        </div>
      )}

      {/* Folders Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveFolderId(null)}
          className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
            activeFolderId === null ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <Folder className="w-6 h-6 text-blue-600 fill-blue-100" />
          <div>
            <div className="font-bold text-sm text-slate-900">All Files</div>
            <div className="text-[11px] text-slate-400">{files.length} items</div>
          </div>
        </div>

        {folders.map((f) => {
          const itemCount = files.filter(file => file.folder_id === f.id).length;
          return (
            <div
              key={f.id}
              onClick={() => setActiveFolderId(f.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                activeFolderId === f.id ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <Folder className="w-6 h-6 text-amber-500 fill-amber-100" />
              <div>
                <div className="font-bold text-sm text-slate-900">{f.name}</div>
                <div className="text-[11px] text-slate-400">{itemCount > 0 ? itemCount : f.count} items</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & File List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs font-medium outline-none"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredFiles.map((file) => (
            <div key={file.id} className="p-4 hover:bg-slate-50 transition flex items-center justify-between gap-4 group">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>{file.name}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {file.version}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Uploaded by <span className="font-bold text-slate-700">{file.uploader}</span> • {file.date}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-500">{file.size}</span>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                  <button
                    onClick={() => setPreviewFile(file)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <a
                    href={`#download-${file.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading ${file.name} (${file.size})...`);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Preview: {previewFile.name}</h3>
            <div className="p-8 rounded-xl bg-slate-100 text-center text-slate-500 text-sm">
              📄 Preview mode for {previewFile.name} ({previewFile.version})
            </div>
            <button onClick={() => setPreviewFile(null)} className="w-full py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
