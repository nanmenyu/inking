import { Plugin, PluginKey } from "prosemirror-state";
// import { EditorView } from "prosemirror-view";
import { main } from "./index";
import { schema } from "./schema";

// 用于处理重新定位和停用超时的游标类
class Cursor {
    #el: HTMLDivElement;
    #cursorTimeout = 10000;
    #cursorTimeoutFn: number = 0;

    constructor() {
        this.#el = document.createElement("div");
        this.#el.classList.add("cursor");
        main.appendChild(this.#el);
    }

    activate(): Cursor {
        this.#el.classList.remove("inactive");
        return this;
    }

    deactivate(): Cursor {
        this.#el.classList.add("inactive");
        return this;
    }

    resetTimeout(): Cursor {
        this.activate();
        clearTimeout(this.#cursorTimeoutFn);
        this.#cursorTimeoutFn = setTimeout(
            () => this.deactivate(),
            this.#cursorTimeout
        );
        return this;
    }

    // 视口内坐标
    reposition(x: number, y: number): Cursor {
        this.#el.style.transform = `translate(${x - 2}px, ${window.scrollY + y - 4
            }px)`;
        return this;
    }

    repositionToViewAnchor(view: EditorView): Cursor {
        // 如果选择“全部”，则锚点将设置为0
        const coords = view.coordsAtPos(Math.max(view.state.selection.anchor, 1));
        this.reposition(coords.right, coords.top);
        return this;
    }
}

export const CursorPlugin = new Plugin<void, typeof schema>({
    key: new PluginKey("cursor"),
    view: (view) => {
        const cursor = new Cursor();
        window.addEventListener("resize", () => {
            cursor.repositionToViewAnchor(view);
        });
        view.root.addEventListener("focus", () => {
            cursor.resetTimeout();
        }, true);
        view.root.addEventListener("blur", () => {
            cursor.deactivate();
        }, true);
        cursor.repositionToViewAnchor(view);
        return {
            update: (view) => {
                cursor.resetTimeout();
                cursor.repositionToViewAnchor(view);
            },
        };
    },
});
