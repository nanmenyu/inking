const platform = process.platform;
let getFontsFunc;

// 判断平台
switch (platform) {
    case 'darwin':
        getFontsFunc = require('./darwin');
        break;
    case 'win32':
        getFontsFunc = require('./win32');
        break;
    case 'linux':
        getFontsFunc = require('./linux');
        break;
    default:
        throw new Error(`Error: getFonts can not run on ${platform}.`);
}
// 获取字体
exports.getFonts = async () => {
    return await getFontsFunc();
}