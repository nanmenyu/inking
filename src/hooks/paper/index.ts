import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js';

/**
 * 导出TXT
 */
export function exportTXT(filename: string, container: HTMLElement) {
    window.$API.ipcSend('expFile', {
        type: 'TXT',
        name: filename,
        file: container.innerText,
        path: ''
    });
}

/**
 * 导出DOCX
 */
export function exportDOCX(filename: string, container: HTMLElement) {
    const htmlString = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + container.outerHTML + '</body></html>';
    window.$API.ipcSend('expFile', {
        type: 'DOCX',
        name: filename,
        file: htmlString,
        path: ''
    });
}

/**
 * 导出PDF
 */
export function exportPDF(filename: string, container: HTMLElement) {
    // 测试17k~~~15K字左右的极限，字太多会白板
    // 输出配置项 见：https://ekoopmans.github.io/html2pdf.js/
    html2pdf().set({
        // Margin ,[vMargin, hMargin] ,[top, left, bottom, right]
        margin: [0.3, 0, 0.3, 0],
        // 默认文件名
        filename: filename + '.pdf',
        // 开启智能分页
        pagebreak: {
            mode: 'avoid-all'
        },
        // PDF中的链接是否有效
        enableLinks: true,
        html2canvas: {
            scale: 2,
            backgroundColor: '#fff' //默认白色（如果DOM中未指定）
        },
        jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait'
        }
    }).from(container).save();
}