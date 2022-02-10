const exec = require('child_process').exec;

module.exports = () => new Promise((resolve, reject) => {
    /* powershell :声明powershell指令
       CHCP 65001: 切换至UTF-8代码页,避免中文乱码
    */
    const cmd = `powershell -command chcp 65001;Add-Type -AssemblyName System.Drawing;$installedFonts= New-Object 'System.Drawing.Text.InstalledFontCollection';$installedFonts.Families`;

    exec(cmd, {
        maxBuffer: 1024 * 1024 * 10
    }, (err, stdout) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(parse(stdout));
    })

});

// 数据整形
const parse = (str) => {
    return str.split('\n').map(ln => ln.trim()).filter(f => !!f).slice(3);
}