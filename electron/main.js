const {
    app,
    protocol,
    BrowserWindow,
    session,
    // Menu,
    ipcMain,
    dialog
} = require('electron');
const path = require('path');
const fs = require('fs');
const fontList = require('./nodelib/getFontList');
const b64toFile = require('./nodelib/b64toFile');
const deleteFolder = require('./nodelib/deleteFolder');
const HTMLtoDOCX = require('../node_modules/html-to-docx/dist/html-to-docx.umd');
const createProtocol = require('./nodelib/createProtocol');

const NODE_ENV = process.env.NODE_ENV

// 自定义协议到系统协议中
protocol.registerSchemesAsPrivileged([{
    scheme: 'app',
    privileges: {
        secure: true,
        standard: true
    }
}]);

let win;
async function createWindow() {
    // 创建浏览器窗口
    win = new BrowserWindow({
        width: 1440,
        height: 810,
        minWidth: 1150,
        minHeight: 700,
        frame: false, //实现头部的隐藏
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // win.loadURL(
    //     NODE_ENV === 'development'
    //         ? 'http://localhost:3000'
    //         : `file://${path.join(__dirname, '../dist/index.html')}`
    // );
    if (NODE_ENV === 'development') {
        // 如果处于开发模式，则加载开发时服务的url
        await win.loadURL('http://localhost:3000');
        win.webContents.openDevTools();
    } else {
        // createProtocol('app');
        // 不在开发模式时加载 index.html
        win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`);
    }
    // // 打开开发工具
    // if (NODE_ENV === "development") {
    //     win.webContents.openDevTools()
    // }

}

app.whenReady().then(() => {
    createWindow()
    if (NODE_ENV === 'development') {
        // vue开发者工具扩展(插件)
        session.defaultSession.loadExtension('C:/Users/Administrator/AppData/Local/Google/Chrome/User Data/Default/Extensions/ljjemllljcmogpfapbkkighbhhppjdbg/6.0.0.21_0');
    }
    app.on('activate', function () {
        // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
        // 打开的窗口，那么程序会重新创建一个窗口。
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})


// 当Electron完成初始化并准备创建浏览器窗口时，将调用此方法
// 某些API只能在此事件发生后使用
// app.on('ready', () => {
//     if (NODE_ENV === 'development') {
//         // vue开发者工具扩展(插件)
//         session.defaultSession.loadExtension('C:/Users/Administrator/AppData/Local/Google/Chrome/User Data/Default/Extensions/ljjemllljcmogpfapbkkighbhhppjdbg/6.0.0.21_0');
//     }
//     createWindow();
// })

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

// 实现自定义标题栏，最小化，最大化，关闭
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

// 转html至txt/docx
ipcMain.on('expFile', async (e, data) => {
    if (data.type === 'DOCX') {
        const fileBuffer = await HTMLtoDOCX(data.file, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true,
        });

        dialog.showSaveDialog({
            title: '导出为DOCX',
            defaultPath: data.name + '.docx',
            filters: [{ name: 'DOCX', extensions: ['docx'] }]
        }).then(file => {
            if (file) {
                fs.writeFile(file.filePath, fileBuffer, err => {
                    if (err) console.log(err);
                });
            }
        })
    } else if (data.type === 'TXT') {
        dialog.showSaveDialog({
            title: '导出为TXT',
            defaultPath: data.name + '.txt',
            filters: [{ name: 'TXT', extensions: ['txt'] }]
        }).then(file => {
            if (file) {
                fs.writeFile(file.filePath, data.file, err => {
                    if (err) console.log(err);
                });
            }
        })
    }

})
