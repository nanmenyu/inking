/**
 * 函数节流
 */
export function throttle(func: (para: any) => void, delay: number) {
    let timer: Object | null = null;
    return function (this: any, ...args: any) {
        let context = this;
        if (!timer) {
            timer = setTimeout(function () {
                func.apply(context, args);
                timer = null;
            }, delay);
        }
    }
}
