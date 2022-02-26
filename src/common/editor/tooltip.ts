import { Plugin } from "prosemirror-state"

export const selectionSizePlugin = new Plugin({
    view(editorView: any) { return new SelectionSizeTooltip(editorView) }
})

class SelectionSizeTooltip {
    tooltip: any
    constructor(view: any) {
        this.tooltip = document.createElement("div");
        this.tooltip.className = "tooltip";
        view.dom.parentNode.appendChild(this.tooltip);

        this.update(view, null);
    }

    update(view: any, lastState: any) {
        let state = view.state;
        // 如果document/selection没有更改，请不要执行任何操作
        if (lastState && lastState.doc.eq(state.doc) &&
            lastState.selection.eq(state.selection)) return;

        // 如果selection为空，则隐藏工具提示
        if (state.selection.empty) {
            this.tooltip.style.display = "none";
            return;
        }

        // 否则，请重新定位并更新其内容
        this.tooltip.style.display = "";
        let { from, to } = state.selection;
        // 这些是屏幕坐标
        let start = view.coordsAtPos(from), end = view.coordsAtPos(to);
        // 工具提示所在的框，用作基础
        let box = this.tooltip.offsetParent.getBoundingClientRect();
        // 从选择端点找到一个中心x位置（当与线相交时，端点可能更偏左）
        let left = Math.max((start.left + end.left) / 2, start.left + 3);
        this.tooltip.style.left = (left - box.left) + "px";
        this.tooltip.style.bottom = (box.bottom - start.top) + "px";
        this.tooltip.textContent = '🥵' + (to - from);
    }

    destroy() { this.tooltip.remove() }
}