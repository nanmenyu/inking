const fs = require('fs');
const { contextBridge, ipcRenderer } = require('electron')

// 将主进程的方法挂载到全局
contextBridge.exposeInMainWorld('$API', {
    'fs': fs,
    'ipcSend': ipcRenderer.send,
    'ipcOn': (type, fn) => {
        ipcRenderer.on(type, (event, ...args) => fn(...args));
    },
    'ipcOnce': (type, fn) => {
        ipcRenderer.once(type, (event, ...args) => fn(...args));
    }
})
