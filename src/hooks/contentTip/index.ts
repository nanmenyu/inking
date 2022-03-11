
// 调整快捷搜索块的方向
export function setContentTipPos(toolTip: HTMLElement, contentTip: HTMLElement, mainEditor: HTMLElement) {
    // 是否需要调换
    if (parseInt(toolTip.style.left.replace('px', '')) > mainEditor.clientWidth / 2) {
        contentTip.style.left = '';
        contentTip.style.right = toolTip.clientWidth + 4 + 'px';
    } else {
        contentTip.style.right = '';
        contentTip.style.left = toolTip.clientWidth + 4 + 'px';
    }
    if (contentTip.style.display === 'none') contentTip.style.display = 'block';
    else if (contentTip.style.display === 'block') contentTip.style.display = 'none';
}

// 设置快捷查词的内容
export function setHTMLdata(contentTip: HTMLElement, data: any): boolean {
    let isFounded = false;
    if (data.site === 'baidu') {
        // 百度汉语数据
        if (data.basicmean === '' && data.detailmean === '' && data.source === '' && data.liju === '' && data.synonym === '' && data.antonym === '') {
            contentTip.innerHTML = '<div class="word-notfound"><div class="word-notfound-img"></div></div>';
            isFounded = false;
        } else {
            const basicmeanHTML = data.basicmean === '' ? '' : '<div class="basicmean"><h3>基本释义</h3>' + data.basicmean + '</div>';
            const detailmeanHTML = data.detailmean === '' ? '' : '<div class="detailmean"><h3>详细释义</h3>' + data.detailmean + '</div>';
            const sourceHTML = data.source === '' ? '' : '<div class="source"><h3>出处</h3>' + data.source + '</div>';
            const dataHTML = data.liju === '' ? '' : '<div class="liju"><h3>例句</h3>' + data.liju + '</div>';
            const synonymHTML = data.synonym === '' ? '' : '<div class="synonym">' + data.synonym + '</div>';
            const antonymHTML = data.antonym === '' ? '' : '<div class="antonym">' + data.antonym + '</div>';
            const temp = basicmeanHTML + detailmeanHTML + sourceHTML + dataHTML + synonymHTML + antonymHTML;
            contentTip.innerHTML = '<div class="word-search"><div id="source-website" title="点击切换">来源:百度汉语</div>' + temp + '</div>';
            adjustHeight();
            isFounded = true;
        }
    } else if (data.site === 'zdic') {
        // 汉典数据
        if (data.jnr === '' && data.gnr === '' && data.cyjs === '') {
            contentTip.innerHTML = '<div class="word-notfound"><div class="word-notfound-img"></div></div>';
            isFounded = false;
        } else {
            const jnrHTML = data.jnr === '' ? '' : '<div class="jnr"><h3>字词解释</h3>' + data.jnr + '</div>';
            const gnrHTML = data.gnr === '' ? '' : '<div class="gnr"><h3>国语辞典</h3>' + data.gnr + '</div>';
            const cyjsHTML = data.cyjs === '' ? '' : '<div class="cyjs"><h3>成语解释</h3>' + data.cyjs + '</div>';
            contentTip.innerHTML = '<div class="word-search"><div id="source-website" title="点击切换">来源:汉典</div>' + jnrHTML + gnrHTML + cyjsHTML + '</div>';
            adjustHeight();
            isFounded = true;
        }
    }
    // 高度要是太高就适当扩展宽度
    function adjustHeight() {
        if (contentTip.clientHeight > 500) {
            (<HTMLElement>contentTip.firstElementChild).style.width = '500px';
        } else {
            (<HTMLElement>contentTip.firstElementChild).style.width = '300px';
        }
    }
    return isFounded;
}


// 获取翻译后的内容并呈现
export function setTranslationContent(contentTip: HTMLElement, currentText: string): void {
    window.$API.ipcSend('api', {
        type: 'youdao',
        word: currentText
    });
    window.$API.ipcOnce('apiData', (data: any) => {
        let transContent = '';
        data.translateResult.forEach((para: Array<{ src: string, tgt: string }>) => {
            let paragraph = '';
            para.forEach(sent => {
                paragraph += sent.tgt;
            })
            if (paragraph !== '') transContent += '<p>' + paragraph + '</p>';
        })
        contentTip.innerHTML = '<div class="translation">' + transContent + '</div>';
        // 适应高度而变宽
        if (contentTip.clientHeight > 150) {
            (<HTMLElement>contentTip.firstElementChild).style.width = '300px';
        } else if (contentTip.clientHeight > 300) {
            (<HTMLElement>contentTip.firstElementChild).style.width = '500px';
        } else {
            (<HTMLElement>contentTip.firstElementChild).style.width = '100px';
        }
    })
}