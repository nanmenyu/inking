import { Plugin } from 'prosemirror-state';
import { useMainStore } from '../../store/index';

const mainStore = useMainStore();// 使用pinia 

export const selectionSizePlugin = new Plugin({
    view(editorView: any) { return new SelectionSizetoolTip(editorView) }
})

class SelectionSizetoolTip {
    toolTip: HTMLElement
    leftTip: HTMLElement
    rightTip: HTMLElement
    contentTip1: HTMLElement
    contentTip2: HTMLElement
    contentTip3: HTMLElement
    constructor(view: any) {
        this.toolTip = document.createElement('div');
        this.toolTip.className = 'toolTip';
        this.leftTip = document.createElement('div');
        this.leftTip.className = 'leftTip';
        this.rightTip = document.createElement('div');
        this.rightTip.className = 'rightTip';

        // 第一个按钮内容框（添加关键词
        this.contentTip1 = document.createElement('div');
        this.contentTip1.className = 'contentTip';
        this.contentTip1.setAttribute('data-belong', 'btn1');
        // 第二个按钮内容框（快捷查词
        this.contentTip2 = document.createElement('div');
        this.contentTip2.className = 'contentTip';
        this.contentTip2.setAttribute('data-belong', 'btn2');
        // 第三个按钮内容框（快捷翻译
        this.contentTip3 = document.createElement('div');
        this.contentTip3.className = 'contentTip';
        this.contentTip3.setAttribute('data-belong', 'btn3');

        this.toolTip.append(this.leftTip);
        this.toolTip.append(this.rightTip);
        this.toolTip.append(this.contentTip1);
        this.toolTip.append(this.contentTip2);
        this.toolTip.append(this.contentTip3);

        for (let i = 0; i < 4; i++) {
            const btn = document.createElement('span');
            btn.setAttribute('class', `btn btn${i + 1} iconfont`);
            if (i === 0) {
                btn.setAttribute('title', '添加为关键词');
                btn.innerHTML = '&#xe600;';
            }
            if (i === 1) {
                btn.setAttribute('title', '快速查词');
                btn.innerHTML = '&#xe61a;';
            }
            if (i === 2) {
                btn.setAttribute('title', '快速翻译');
                btn.innerHTML = '&#xe61c;';
            }
            if (i === 3) {
                btn.setAttribute('title', '右侧搜索');
                btn.innerHTML = '&#xe915;';
            }
            this.rightTip.append(btn);
        }
        view.dom.parentNode.appendChild(this.toolTip);
        this.toolTip.addEventListener('contextmenu', (e: MouseEvent) => {
            // 阻止纸张上的右键菜单事件
            e.stopPropagation();
        })
        this.update(view, null);
    }

    update(view: any, lastState: any) {
        let state = view.state;
        // 如果document/selection没有更改，请不要执行任何操作
        if (lastState && lastState.doc.eq(state.doc) &&
            lastState.selection.eq(state.selection)) return;

        // 如果selection为空，则隐藏工具提示
        if (state.selection.empty) {
            this.toolTip.style.display = 'none';
            return;
        }

        // 否则，请重新定位并更新其内容
        this.toolTip.style.display = '';
        let { from, to } = state.selection;
        let targetStr = view.docView.contentDOM.innerText;
        mainStore.curSelectedText = targetStr.slice(from - 1, to - 1);
        // 这些是屏幕坐标
        let start = view.coordsAtPos(from), end = view.coordsAtPos(to);
        // 工具提示所在的框，用作基础
        let box = this.toolTip.offsetParent!.getBoundingClientRect();
        // 从选择端点找到一个中心x位置（当与线相交时，端点可能更偏左）
        let left = Math.max((start.left + end.left) / 2, start.left + 3);
        this.toolTip.style.left = (left - box.left) + 'px';
        this.toolTip.style.bottom = (box.bottom - start.top) + 'px';
        let count = to - from;
        if (count < 5) {
            this.leftTip.textContent = count + '字符😑';
        } else if (count < 10) {
            this.leftTip.textContent = count + '字符😯';
        } else if (count < 20) {
            this.leftTip.textContent = count + '字符😬';
        } else {
            this.leftTip.textContent = count + '字符😱';
        }
    }

    destroy() { this.toolTip.remove() }
}