// Use Electron's file system instead of localStorage

const isElectron = () => {
  return window && window.process && window.process.type;
};

export const electronStorage = {
  async save(key, data) {
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('save-data', `${key}.json`, data);
      return result.success;
    } else {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    }
  },

  async load(key) {
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('load-data', `${key}.json`);
      return result.data;
    } else {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
  }
};