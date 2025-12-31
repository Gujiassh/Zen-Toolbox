// Input: Electron preload context, ipcRenderer handlers for window controls
// Output: Safe window.desktop API to control window and observe maximize state
// Pos: Renderer bridge for window chrome interactions (update me when folder changes)
//
// Note: Electron loads preload scripts via CommonJS `require`, even when the
// app uses ESM elsewhere. Keep this file CommonJS to avoid the
// "require() of ES Module ... not supported" error.

const { contextBridge, ipcRenderer } = require('electron');

const windowControls = {
  minimize: () => ipcRenderer.invoke('window:minimize'),
  toggleMaximize: () => ipcRenderer.invoke('window:toggle-maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  onMaximizeChanged: (callback) => {
    const listener = (_event, isMaximized) => callback?.(isMaximized);
    ipcRenderer.on('window:maximize-changed', listener);
    return () => ipcRenderer.removeListener('window:maximize-changed', listener);
  },
};

const seoFetch = (url) => ipcRenderer.invoke('seo:fetch', url);

contextBridge.exposeInMainWorld('desktop', {
  windowControls,
  seoFetch,
});
