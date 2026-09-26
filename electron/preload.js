const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("beninlandDesktop", {
  isDesktop: true,
  platform: process.platform,
  version: "1.0.0",
  openExternal: (url) => ipcRenderer.send("open-external", url),
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  close: () => ipcRenderer.send("window-close"),
});
