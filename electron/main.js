const {
    app,
    // protocol,
    BrowserWindow,
    session,
    Menu,
    ipcMain,
    // dialog
} = require('electron');
const path = require('path');
// const fs = require('fs');
// const log = require('electron-log'); // 日志输出模块 
const fontList = require('./nodelib/getFontList');
const b64toFile = require('./nodelib/b64toFile');
const deleteFolder = require('./nodelib/deleteFolder');
const isDevelopment = process.env.NODE_ENV !== 'production';
// const NODE_ENV = process.env.NODE_ENV;
// 取消顶部默认菜单栏（开发状态开启）
isDevelopment ? null : Menu.setApplicationMenu(null);

// 创建主窗口
let win;
async function createWindow() {
    // 创建浏览器窗口
    win = new BrowserWindow({
        width: 1440,
        height: 810,
        minWidth: 1150,
        minHeight: 700,
        frame: false, //实现头部的隐藏
        // transparent: true,
        // backgroundColor: '#00000000',
        webPreferences: {
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, '/preload.js')
        }
    })
    console.log(process.env.ELECTRON_NODE_INTEGRATION);
    // 加载 index.html
    await win.loadURL(
        isDevelopment ?
            'http://localhost:3000' :
            `file://${path.join(__dirname, '../dist/index.html')}`
    );
    // 打开开发工具
    if (isDevelopment) {
        win.webContents.openDevTools();
    }

}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
    if (isDevelopment) {
        // vue开发者工具扩展(插件)
        session.defaultSession.loadExtension('C:/Users/Administrator/AppData/Local/Google/Chrome/User Data/Default/Extensions/ljjemllljcmogpfapbkkighbhhppjdbg/6.0.0.21_0');
    }
    createWindow();
})

app.on('activate', () => {
    // 通常在 macOS 上,当点击 dock 中的应用程序图标时,如果没有其他
    // 打开的窗口,那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
})

app.on('window-all-closed', function () {
    // 在macOS上,应用程序及其菜单栏通常保持活动状态,直到用户使用Cmd+Q明确退出
    if (process.platform !== 'darwin') app.quit();
})

ipcMain.on('count-fonts-item', function (e) {
    // 获取系统的字体列表
    fontList.getFonts()
        .then(fonts => {
            e.sender.send('get-fonts-item', fonts);
        })
        .catch(err => {
            // log.error(err);
            console.log(err);
        })
});

// 实现自定义标题栏,最小化,最大化,关闭
ipcMain.on('window-min', () =>
    win.minimize()
);
ipcMain.on('window-max', () => {
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
});
ipcMain.on('window-close', () => {
    win.destroy();
});

// 将传来的base64转换为图片并保存
ipcMain.on('saveBase64-toImg', (e, data) => {
    b64toFile(data.b64, data.path, data.fname, () => {
        e.sender.send('saveBase64-toImg-successful');
    })
})

// 删除文件夹
ipcMain.on('deleteFolder', (e, path) => {
    deleteFolder(path);
})

// 在开发模式下根据父进程的请求干净退出
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        })
    }
}