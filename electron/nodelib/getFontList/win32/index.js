const os = require('os');
const getByPowerShell = require('./getByPowerShell');
const getByVBS = require('./getByVBS');

const methods_new = [getByPowerShell, getByVBS];
const methods_old = [getByVBS, getByPowerShell];

module.exports = async () => {
    let fonts = [],
        os_v = parseInt(os.release()),
        methods = os_v >= 10 ? methods_new : methods_old

    for (let method of methods) {
        try {
            fonts = await method();
            if (fonts.length > 0) break;
        } catch (e) {
            console.log(e);
        }
    }

    return fonts
}