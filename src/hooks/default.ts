/**
 * 纸张的宽度 = 内容区 + 40px的左右边距
 */
export const paperSize: { [key: string]: number } = {
    'Max': 1280,
    'iPad Pro': 1024,
    'A4': 794,
    'iPad': 768,
    'Surface Duo': 540,
    'iPhone6/7/8 Plus': 414,
    'iPhone6/7/8 X': 375,
    'iPhone5/SE': 320,
    'Galaxy Fold': 280
};

/**
 * 色板的12个默认颜色
 */
export const themeColor = [
    'RGB(0,176,255)', 'RGB(0,191,166)', 'RGB(245,61,127)', 'RGB(83,109,254)', 'RGB(249,168,38)', 'RGB(253,84,78)',
    'RGB(1,121,202)', 'RGB(0,143,145)', 'RGB(241,100,100)', 'RGB(104,103,209)', 'RGB(255,143,87)', 'RGB(253,114,109)'
];