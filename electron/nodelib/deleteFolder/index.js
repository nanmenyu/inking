const { app } = require('electron')
const fs = require("fs");  // 引入fs模块
const path = require('path');
const isDevelopment = process.env.NODE_ENV !== 'production';

const deleteFolder = (_path) => {
    let exePath = _path;
    // if (isDevelopment) {
    //     exePath = __dirname + _path;
    // } else {
    //     exePath = path.dirname(app.getPath('exe')) + _path;
    // }
    let files = [];
    //判断给定的路径是否存在
    if (fs.existsSync(exePath)) {
        files = fs.readdirSync(exePath); //返回文件和子目录的数组
        files.forEach(file => {
            let curPath = path.join(exePath, file);
            //fs.statSync同步读取文件夹文件,如果是文件夹,在重复触发函数
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        // 清除文件夹
        fs.rmdirSync(exePath);
    } else {
        console.log("给定的路径不存在,请给出正确的路径");
    }
}
module.exports = {
    deleteFolder
}