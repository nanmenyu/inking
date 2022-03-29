const { contextBridge, ipcRenderer, shell } = require('electron');

// 将主进程的方法挂载到全局
contextBridge.exposeInMainWorld('$API', {
    '__dirname': __dirname,
    'ipcSend': ipcRenderer.send,
    'ipcOn': (type, fn) => {
        ipcRenderer.on(type, (event, ...args) => fn(...args));
    },
    'ipcOnce': (type, fn) => {
        ipcRenderer.once(type, (event, ...args) => fn(...args));
    },
    'openExternalUrl': (url) => {
        shell.openExternal(url);
    }
})
