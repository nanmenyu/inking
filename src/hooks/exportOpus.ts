import { db } from '../db/db';
import { v4 } from 'uuid';

/**
 * 导出目标作品为单个TXT文件
 */
export function exportOpusAsTXT(opus: Userdb) {
    let opusStr = '';
    opus.data.forEach((v_item, index) => {
        // 未标记删除的卷
        if (!v_item.discard) {
            // 插入卷名
            if (index > 0) {
                opusStr += '\n\n' + v_item.volumeName + '\n';
            } else {
                opusStr += v_item.volumeName + '\n'
            }
            v_item.volume.forEach((c_item, i) => {
                // 未标记删除的章
                if (!c_item.discard) {
                    // 插入章名
                    if (i > 0) {
                        opusStr += '\n\n' + c_item.chapterName + '\n';
                    } else {
                        opusStr += '\n' + c_item.chapterName + '\n';
                    }
                    // 插入章内容
                    opusStr += c_item.chapter.join('\n');
                }
            })
        }
    })
    window.$API.ipcSend('expFile', {
        type: 'TXT',
        name: filterFilename(opus.title),
        file: opusStr
    });
}

/**
 * 导出目标作品为单个DOCX文件
 */
export function exportOpusAsDOCX(opus: Userdb) {
    let opusHTML = '';
    opus.data.forEach(v_item => {
        // 未标记删除的卷
        if (!v_item.discard) {
            opusHTML += '<h3>' + v_item.volumeName + '</h3>';
            v_item.volume.forEach(c_item => {
                // 未标记删除的章
                if (!c_item.discard) {
                    opusHTML += '<h4>' + c_item.chapterName + '</h4>';
                    c_item.chapter.forEach(para => {
                        opusHTML += '<p>' + para + '</p>';
                    })
                }
            })
        }
    })
    opusHTML = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + opusHTML + '</body></html>';
    window.$API.ipcSend('expFile', {
        type: 'DOCX',
        name: filterFilename(opus.title),
        file: opusHTML
    });
}

/**
 * 导出目标作品为多个TXT文件
 */
export function exportOpusAsTXT_(opus: Userdb) {
    const opusArr: Array<{ volumeName: string, volume: Array<{ chapterName: string, chapter: string }> }> = [];
    opus.data.forEach(v_item => {
        // 未标记删除的卷
        if (!v_item.discard) {
            const volumeArr: Array<{ chapterName: string, chapter: string }> = [];
            v_item.volume.forEach(c_item => {
                // 未标记删除的章
                if (!c_item.discard) {
                    volumeArr.push({
                        chapterName: filterFilename(c_item.chapterName) + v4(),
                        chapter: c_item.chapter.join('\n')
                    })
                }
            })
            opusArr.push({
                volumeName: filterFilename(v_item.volumeName) + v4(),
                volume: volumeArr
            })
        }
    })

    window.$API.ipcSend('expFile', {
        type: 'TXT_mult',
        name: filterFilename(opus.title),
        file: opusArr
    });
}

/**
 * 导出目标作品为多个DOCX文件
 */
export function exportOpusAsDOCX_(opus: Userdb) {
    const opusArr: Array<{ volumeName: string, volume: Array<{ chapterName: string, chapter: string }> }> = [];
    opus.data.forEach(v_item => {
        // 未标记删除的卷
        if (!v_item.discard) {
            const volumeArr: Array<{ chapterName: string, chapter: string }> = [];
            v_item.volume.forEach(c_item => {
                // 未标记删除的章
                if (!c_item.discard) {
                    volumeArr.push({
                        chapterName: filterFilename(c_item.chapterName) + v4(),
                        chapter: '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + c_item.chapter.map(para => '<p>' + para + '</p>').join('') + '</body></html>'
                    })
                }
            })
            opusArr.push({
                volumeName: filterFilename(v_item.volumeName) + v4(),
                volume: volumeArr
            })
        }
    })
    window.$API.ipcSend('expFile', {
        type: 'DOCX_mult',
        name: filterFilename(opus.title),
        file: opusArr
    });
}

/**
 * 导出备份json
 */
export function exportOpusBackup(cb?: Function, name?: string,) {
    name = name ?? 'inkingBackup' + new Date().getTime(); // 默认文件名
    let inkingBackup: Array<Userdb> = [];

    db.opus.where(':id').between(1, Infinity).toArray().then(value => {
        inkingBackup = value;
    }).then(() => {
        window.$API.ipcSend('expFile', {
            type: 'JSON',
            name: name,
            file: JSON.stringify(inkingBackup)
        });
        if (typeof cb === 'function') cb();
    })
}

/**
 * 文件名特殊字符替换
 */
function filterFilename(fname: string): string {
    // windows文件命名禁用字符
    const forbidden = /[\\/:*?"><|]/g;
    return fname.replaceAll(forbidden, '□');;
}