const { app } = require('electron')
const fs = require("fs");  // 引入fs模块
const path = require('path');
// const log = require('electron-log');
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = (b64, _path, fname, cb) => {
    let exePath;
    if (isDevelopment) {
        exePath = _path;
    } else {
        exePath = path.dirname(app.getPath('exe')) + _path;
    }
    const base64 = b64.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/jpeg;base64
    const dataBuffer = Buffer.from(base64, 'base64'); //把base64码转成buffer对象
    fs.mkdir(exePath, { recursive: true }, function (err) {
        if (err) {
            // log.error(err);
            console.log(err);
        } else {
            fs.writeFile(exePath + '/' + fname, dataBuffer, function (err) {//用fs写入文件
                if (err) {
                    // log.error(err);
                    console.log(err);
                } else {
                    cb();
                }
            });
        }
    })
}


