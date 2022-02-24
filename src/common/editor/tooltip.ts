import { Plugin } from "prosemirror-state"

export const selectionSizePlugin = new Plugin({
    view(editorView: any) { return new SelectionSizeTooltip(editorView) }
})

class SelectionSizeTooltip {
    constructor(view: any) {
        this.tooltip = document.createElement("div")
        this.tooltip.className = "tooltip"
        view.dom.parentNode.appendChild(this.tooltip)

        this.update(view, null)
    }

    update(view, lastState) {
        let state = view.state
        // Don't do anything if the document/selection didn't change
        if (lastState && lastState.doc.eq(state.doc) &&
            lastState.selection.eq(state.selection)) return

        // Hide the tooltip if the selection is empty
        if (state.selection.empty) {
            this.tooltip.style.display = "none"
            return
        }

        // Otherwise, reposition it and update its content
        this.tooltip.style.display = ""
        let { from, to } = state.selection
        // These are in screen coordinates
        let start = view.coordsAtPos(from), end = view.coordsAtPos(to)
        // The box in which the tooltip is positioned, to use as base
        let box = this.tooltip.offsetParent.getBoundingClientRect()
        // Find a center-ish x position from the selection endpoints (when
        // crossing lines, end may be more to the left)
        let left = Math.max((start.left + end.left) / 2, start.left + 3)
        this.tooltip.style.left = (left - box.left) + "px"
        this.tooltip.style.bottom = (box.bottom - start.top) + "px"
        this.tooltip.textContent = to - from
    }

    destroy() { this.tooltip.remove() }
}