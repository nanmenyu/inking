const {
    app,
    // protocol,
    BrowserWindow,
    session,
    // Menu,
    ipcMain,
    dialog
} = require('electron');
const path = require('path');
const fs = require('fs');
const jschardet = require("jschardet");
const fontList = require('./nodelib/getFontList');
const b64toFile = require('./nodelib/b64toFile');
const deleteFolder = require('./nodelib/deleteFolder');
const writeFileByUser = require('./nodelib/writeFileByUser');
const reptile = require('./nodelib/reptile');
const HTMLtoDOCX = require('html-to-docx/dist/html-to-docx.umd');
const { autoUpdater } = require('electron-updater');
const { default: axios } = require('axios');

const NODE_ENV = process.env.NODE_ENV;
const uploadUrl = 'http://localhost:8888/download/'; // 安装包helatest.yml所在服务器地址

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
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true,
            nodeIntegration: true,
            // webSecurity: false
        },
    })
    if (NODE_ENV === 'development') {
        // 如果处于开发模式，则加载开发时服务的url
        await win.loadURL('http://localhost:3000');
        win.webContents.openDevTools();
    } else {
        // 不在开发模式时加载 index.html
        win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`);

        win.webContents.openDevTools();
    }
    // // 打开开发工具
    // if (NODE_ENV === "development") {
    //     win.webContents.openDevTools()
    // }
    // updateHandle();
}

app.commandLine.appendSwitch('ignore-certificate-errors');    //忽略ssl证书的检测

app.whenReady().then(() => {
    createWindow();
    if (NODE_ENV === 'development') {
        // vue开发者工具扩展(插件)
        session.defaultSession.loadExtension('C:/Users/Administrator/AppData/Local/Google/Chrome/User Data/Default/Extensions/ljjemllljcmogpfapbkkighbhhppjdbg/6.0.0.21_1');
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

// 转html至txt/docx/json
ipcMain.on('expFile', async (e, data) => {
    if (data.type === 'DOCX') {
        const fileBuffer = await HTMLtoDOCX(data.file, null, {
            table: { row: { cantSplit: true } },
            footer: true
        });
        dialog.showSaveDialog({
            title: '导出为DOCX',
            defaultPath: data.name + '.docx',
            filters: [{ name: 'DOCX', extensions: ['docx'] }]
        }).then(file => {
            if (file) {
                fs.writeFile(file.filePath, fileBuffer, err => {
                    if (err) e.sender.send('expFile-result', 'err');
                    else e.sender.send('expFile-result', 'success');
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
                    if (err) e.sender.send('expFile-result', 'err');
                    else e.sender.send('expFile-result', 'success');
                });
            }
        })
    } else if (data.type === 'TXT_mult') {
        dialog.showOpenDialog({
            title: '选择目标文件夹',
            properties: ['openDirectory']
        }).then(file => {
            if (file) {
                const basePath = file.filePaths[0] + '/' + data.name;
                // 依次导出为TXT
                data.file.forEach(v_item => {
                    const volumePath = basePath + '/' + v_item.volumeName;
                    v_item.volume.forEach(c_item => {
                        const chapterPath = volumePath + '/' + c_item.chapterName + '.txt';
                        if (writeFileByUser(chapterPath, c_item.chapter)) e.sender.send('expFile-result', 'err');
                        else e.sender.send('expFile-result', 'success');
                    })
                });
            }
        })
    } else if (data.type === 'DOCX_mult') {
        dialog.showOpenDialog({
            title: '选择目标文件夹',
            properties: ['openDirectory']
        }).then(file => {
            if (file) {
                const basePath = file.filePaths[0] + '/' + data.name;
                // 依次导出为DOCX
                data.file.forEach(v_item => {
                    const volumePath = basePath + '/' + v_item.volumeName;
                    v_item.volume.forEach(async c_item => {
                        const chapterPath = volumePath + '/' + c_item.chapterName + '.docx';
                        const fileBuffer = await HTMLtoDOCX(c_item.chapter, null, {
                            table: { row: { cantSplit: true } },
                            footer: true
                        });
                        if (writeFileByUser(chapterPath, fileBuffer)) e.sender.send('expFile-result', 'err');
                        else e.sender.send('expFile-result', 'success');
                    })
                });
            }
        })
    } else if (data.type === 'JSON') {
        dialog.showSaveDialog({
            title: '导出为JSON',
            defaultPath: data.name + '.json',
            filters: [{ name: 'JSON', extensions: ['json'] }]
        }).then(file => {
            if (file) {
                fs.writeFile(file.filePath, data.file, err => {
                    if (err) e.sender.send('expFile-result', 'err');
                    else e.sender.send('expFile-result', 'success');
                });
            }
        })
    }
})

// 利用node获取编码
ipcMain.on('needChardet', (e, data) => {
    e.sender.send('getChardetResult', jschardet.detect(data));
})

// 数据爬取
ipcMain.on('reptile', (e, config) => {
    reptile(config, (data => {
        e.sender.send('getReptileData', data);
    }));
})
// API代理
ipcMain.on('api', (e, data) => {
    if (data.type === 'youdao') {
        axios.get('http://fanyi.youdao.com/translate', {
            params: {
                doctype: 'json',
                type: 'AUTO',
                i: data.word
            }
        }).then(res => {
            e.sender.send('apiData', res.data);
        }).catch(err => {
            console.log(err);
        })
    }
})

// 打开全屏
ipcMain.on('fullscreen', (e, full) => {
    win.setFullScreen(full);
    e.sender.send('isFullScreen', win.isFullScreen());
})

// 自动检测更新
ipcMain.on('checkForUpdate', () => {
    // 收到renderer进程的检查通知后，执行自动更新检查
    // autoUpdater.checkForUpdates()
    let checkInfo = autoUpdater.checkForUpdates();
    console.log('🐲🐲🐲🐲\n', checkInfo);
    checkInfo.then(function (data) {
        versionInfo = data.versionInfo // 获取更新包版本等信息
    })
})

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle() {
    let message = {
        error: { status: -1, msg: '检测更新查询异常' },
        checking: { status: 0, msg: '正在检查更新...' },
        updateAva: { status: 1, msg: '检测到新版本,正在下载,请稍后' },
        updateNotAva: { status: 2, msg: '您现在使用的版本为最新版本,无需更新!' },
    };
    let versionInfo = '';
    autoUpdater.setFeedURL(uploadUrl);
    // 检测更新查询异常
    autoUpdater.on('error', function (error) {
        sendUpdateMessage(message.error);
    })
    // 当开始检查更新的时候触发
    autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking);
    })
    // 当发现有可用更新的时候触发，更新包下载会自动开始
    autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(message.updateAva);
    })
    // 当发现版本为最新版本触发
    autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva);
    })
    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        mainWindow.webContents.send('downloadProgress', progressObj);
    })
    // 包下载成功时触发
    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        // 收到renderer进程确认更新
        ipcMain.on('updateNow', (e, arg) => {
            console.log('开始更新');
            autoUpdater.quitAndInstall(); // 包下载完成后，重启当前的应用并且安装更新
        })
        // 主进程向renderer进程发送是否确认更新
        mainWindow.webContents.send('isUpdateNow', versionInfo);
    })
}