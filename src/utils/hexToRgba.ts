/**
 * 输入hex字符串转rgb字符串
 */
export default function hexToRgba(hex: string, opacity: number): string {
    let regExp = /^#[0-9A-F]{6}$/i;
    if (regExp.test(hex)) {
        let r = parseInt("0x" + hex.slice(1, 3)),
            g = parseInt("0x" + hex.slice(3, 5)),
            b = parseInt("0x" + hex.slice(5, 7));
        if (opacity === undefined) {
            return "rgb(" + r + "," + g + "," + b + ")";
        } else if (opacity >= 0 && opacity <= 1) {
            return "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
        }
    }
    return '';
}