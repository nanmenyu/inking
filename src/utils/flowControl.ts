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

/**
 * 函数防抖
 */
// export function debounce(func: (para: any) => void, wait = 0) {
//     let timeid, result;
//     return function () {
//         let context = this;
//         let args = arguments;

//         if (timeid) {
//             clearTimeout(timeid);
//         }
//         timeid = setTimeout(function () {
//             result = func.apply(context, args);
//         }, wait);

//         return result;
//     }
// }