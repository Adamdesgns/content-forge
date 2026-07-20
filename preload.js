const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('contentForge', {
  platform: process.platform,
  dataPath: () => ipcRenderer.invoke('app:data-path'),
  loadData: () => ipcRenderer.invoke('app:load-data'),
  saveData: (data) => ipcRenderer.invoke('app:save-data', data),
  exportData: (data) => ipcRenderer.invoke('app:export-data', data),
  importData: () => ipcRenderer.invoke('app:import-data'),
  readPrompt: (filename) => ipcRenderer.invoke('app:read-prompt', filename),
  bufferFetch: (token, body) => ipcRenderer.invoke('buffer:fetch', { token, body }),
  onMenuNewProject: (callback) => ipcRenderer.on('menu:new-project', callback),
  onMenuSave: (callback) => ipcRenderer.on('menu:save', callback),
  onMenuExport: (callback) => ipcRenderer.on('menu:export', callback),
  onMenuImport: (callback) => ipcRenderer.on('menu:import', callback)
});
