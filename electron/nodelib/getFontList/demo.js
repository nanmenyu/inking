// 功能测试代码 查询本机字体
const demo = require('./index.js');

let start = (new Date()).getTime();
demo.getFonts()
    .then((fonts) => {
        let end = (new Date()).getTime();
        console.log(fonts);
        console.log('查询用时：', end - start, 'ms')
    })