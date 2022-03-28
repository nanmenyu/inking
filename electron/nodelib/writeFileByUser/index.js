// 写文件，文件夹不存在则创建
const fs = require('fs');

module.exports = (filePath, data) => {
    if (!fs.existsSync(filePath)) mkdir(filePath);
    fs.writeFileSync(filePath, data, 'utf8', err => {
        if (err) return err;
    })
}

function mkdir(filePath) {
    const dirCache = {};
    const arr = filePath.split('/');
    let dir = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (!dirCache[dir] && !fs.existsSync(dir)) {
            dirCache[dir] = true;
            fs.mkdirSync(dir);
        }
        dir = dir + '/' + arr[i];
    }

    fs.writeFileSync(filePath, '');
}
