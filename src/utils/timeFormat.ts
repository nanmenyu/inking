/**
 * 时间戳转时间格式 如： 2021-12-24 11:01:50
 */
export default function (timeStamp: number): string {
    function add0(m: number) {
        return m < 10 ? '0' + m : m;
    }

    let time = new Date(timeStamp),
        y = time.getFullYear(),
        m = time.getMonth() + 1,
        d = time.getDate(),
        h = time.getHours(),
        mm = time.getMinutes(),
        s = time.getSeconds();

    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}