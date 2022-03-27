/**
 * 导出目标作品为单个TXT文件
 */
export function exportOpusAsTXT(opus: Userdb) {
    let opusStr = '';
    opus.data.forEach((v_item, index) => {
        // 插入卷名
        if (index > 0) {
            opusStr += '\n\n' + v_item.volumeName + '\n';
        } else {
            opusStr += v_item.volumeName + '\n'
        }
        v_item.volume.forEach((c_item, i) => {
            // 插入章名
            if (i > 0) {
                opusStr += '\n\n' + c_item.chapterName + '\n';
            } else {
                opusStr += '\n' + c_item.chapterName + '\n';
            }
            // 插入章内容
            opusStr += c_item.chapter.join('\n');
        })
    })
    window.$API.ipcSend('expFile', {
        type: 'TXT',
        name: opus.title,
        file: opusStr
    });
}

/**
 * 导出目标作品为单个DOCX文件
 */
export function exportOpusAsDOCX(opus: Userdb) {
    let opusHTML = '';
    opus.data.forEach(v_item => {
        opusHTML += '<h3>' + v_item.volumeName + '</h3>';
        v_item.volume.forEach(c_item => {
            opusHTML += '<h4>' + c_item.chapterName + '</h4>';
            c_item.chapter.forEach(para => {
                opusHTML += '<p>' + para + '</p>';
            })
        })
    })
    opusHTML = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + opusHTML + '</body></html>';
    window.$API.ipcSend('expFile', {
        type: 'DOCX',
        name: opus.title,
        file: opusHTML
    });
}

/**
 * 导出目标作品为多个TXT文件
 */
export function exportOpusAsTXT_(opus: Userdb) {
    const opusArr = opus.data.map(v_item => {
        return {
            volumeName: v_item.volumeName,
            volume: v_item.volume.map(c_item => {
                return {
                    chapterName: c_item.chapterName,
                    chapter: c_item.chapter.join('\n')
                }
            })
        }
    })
    window.$API.ipcSend('expFile', {
        type: 'TXT_mult',
        name: opus.title,
        file: opusArr
    });
}

/**
 * 导出目标作品为多个DOCX文件
 */
export function exportOpusAsDOCX_(opus: Userdb) {
    const opusArr = opus.data.map(v_item => {
        return {
            volumeName: v_item.volumeName,
            volume: v_item.volume.map(c_item => {
                return {
                    chapterName: c_item.chapterName,
                    chapter: '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + c_item.chapter.map(para => '<p>' + para + '</p>').join('') + '</body></html>'
                }
            })
        }
    })
    window.$API.ipcSend('expFile', {
        type: 'DOCX_mult',
        name: opus.title,
        file: opusArr
    });
}