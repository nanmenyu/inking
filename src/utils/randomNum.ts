/**
 * 生成从minNum到maxNum的随机数
 */
export default function (minNum: number, maxNum: number): number {
    switch (arguments.length) {
        case 1:
            return parseInt((Math.random() * minNum + 1).toString(), 10);
        case 2:
            return parseInt((Math.random() * (maxNum - minNum + 1)).toString() + minNum, 10);
        default:
            return 0;
    }
}