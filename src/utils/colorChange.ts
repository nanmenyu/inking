/**
 * 输入hex字符串转rgb字符串
 */
export function hexToRgba(hex: string, opacity: number): string {
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


/*
 * 增加三原色的饱和度。
 * value 要增加饱和度的颜色值。长度为3的整型数组，第1个成员是红色通道值，第2个成员是绿色通道值，第3个成员是蓝色通道值。
 * degress 取值为百分比值，0表示不增加饱和度，100表示将饱和度增加至最大。
 */
export function rgbIncreaseSaturation(value: Array<number>, degress: number): Array<number> {
    let maxIndex, midIndex, minIndex;
    if (degress < 0) degress = 0;
    else if (degress >= 100) degress = 1;
    else degress /= 100;
    if (value[0] >= value[1] && value[0] >= value[2]) {
        maxIndex = 0;
        if (value[1] <= value[2]) {
            midIndex = 2;
            minIndex = 1;
        } else {
            midIndex = 1;
            minIndex = 2;
        }
    } else if (value[1] >= value[2]) {
        maxIndex = 1;
        if (value[0] <= value[2]) {
            midIndex = 2;
            minIndex = 0;
        } else {
            midIndex = 0;
            minIndex = 2;
        }
    } else {
        maxIndex = 2;
        if (value[0] <= value[1]) {
            midIndex = 1;
            minIndex = 0;
        } else {
            midIndex = 0;
            minIndex = 1;
        }
    }
    if (value[minIndex] === 0 || value[maxIndex] === value[minIndex])
        return new Array(value[0], value[1], value[2]);
    const newArray = new Array(3);
    newArray[maxIndex] = value[maxIndex];
    newArray[midIndex] = value[midIndex] -
        Math.round(value[minIndex] * (value[maxIndex] - value[midIndex]) / (value[maxIndex] - value[minIndex]) * degress);
    newArray[minIndex] = value[minIndex] - Math.round(value[minIndex] * degress);
    return newArray;
}

/*
 * 降低三原色的饱和度。
 * value 要降低饱和度的颜色值。长度为3的整型数组，第1个成员是红色通道值，第2个成员是绿色通道值，第3个成员是蓝色通道值。
 * degress 取值为百分比值，0表示不降低饱和度，100表示将饱和度降低至最小。
 */
export function rgbDecreaseSaturation(value: Array<number>, degress: number): Array<number> {
    if (degress < 0) degress = 0;
    else if (degress >= 100) degress = 1;
    else degress /= 100;
    let maxIndex;
    if (value[0] >= value[1] && value[0] >= value[2]) {
        maxIndex = 0;
    } else if (value[1] >= value[2]) {
        maxIndex = 1;
    } else {
        maxIndex = 2;
    }
    const newArray = new Array(3);
    for (let i = 0; i < 3; i++) {
        newArray[i] = value[i] + Math.round((value[maxIndex] - value[i]) * degress);
    }
    return newArray;
}

/*
 * 增加三原色的亮度。
 * value 要增加亮度的颜色值。长度为3的整型数组，第1个成员是红色通道值，第2个成员是绿色通道值，第3个成员是蓝色通道值。
 * degress 取值为百分比值，0表示不增加亮度，100表示将亮度增加至最大。
 */
export function rgbIncreaseBrightness(value: Array<number>, degress: number): Array<number> {
    if (degress < 0) degress = 0;
    else if (degress >= 100) degress = 1;
    else degress /= 100;
    let maxIndex;
    if (value[0] >= value[1] && value[0] >= value[2]) {
        maxIndex = 0;
        if (value[0] === 0) {
            var v = Math.round(degress * 255);
            return new Array(v, v, v);
        }
    } else if (value[1] >= value[2]) {
        maxIndex = 1;
    } else {
        maxIndex = 2;
    }
    const maxRoom = 255 - value[maxIndex];
    const newValue = new Array(3);
    for (let i = 0; i < 3; i++) {
        newValue[i] = value[i] + Math.round(value[i] / value[maxIndex] * maxRoom * degress);
    }
    return newValue;
}

/*
 * 降低三原色的亮度。
 * value 要降低亮度的颜色值。长度为3的整型数组，第1个成员是红色通道值，第2个成员是绿色通道值，第3个成员是蓝色通道值。
 * degress 取值为百分比值，0表示不降低亮度，100表示将亮度降低至最小。
 */
export function rgbDecreaseBrightness(value: Array<number>, degress: number): Array<number> {
    if (degress < 0) degress = 1;
    else if (degress >= 100) degress = 0;
    else degress = 1 - degress / 100;
    const newValue = new Array(3);
    newValue[0] = Math.round(value[0] * degress);
    newValue[1] = Math.round(value[1] * degress);
    newValue[2] = Math.round(value[2] * degress);
    return newValue;
}