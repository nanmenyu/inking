import {
    rgbIncreaseBrightness, rgbDecreaseBrightness,
    rgbIncreaseSaturation, rgbDecreaseSaturation
} from '../../utils/colorChange';
import { useThemeStore } from '../../store';

// 全局共享部分主题数据
export function setSharedColor(theme: string) {
    const themeStore = useThemeStore();
    themeStore.primary_6 = getComputedStyle(document.body).getPropertyValue('--primary-6');
    themeStore.my_secondary_6 = getComputedStyle(document.body).getPropertyValue('--my-secondary-6');
    themeStore.color_text_1 = getComputedStyle(document.body).getPropertyValue('--color-text-1');
    themeStore.theme = theme;
}

// 传入RGB字符串重写主题变量(主色)
export function setupMainThemes(color: string) {
    const rgbColor = color.replace('RGB(', '').replace(')', '').split(',').map(it => parseInt(it));
    const primary1 = rgbDecreaseSaturation(rgbIncreaseBrightness(rgbColor, 25), 85);
    const primary2 = rgbDecreaseSaturation(rgbIncreaseBrightness(rgbColor, 25), 70);
    const primary3 = rgbDecreaseSaturation(rgbIncreaseBrightness(rgbColor, 25), 55);
    const primary4 = rgbDecreaseSaturation(rgbIncreaseBrightness(rgbColor, 25), 40);
    const primary5 = rgbIncreaseBrightness(rgbColor, 25);
    const primary6 = rgbColor;
    const primary7 = rgbDecreaseBrightness(rgbColor, 25);
    const primary8 = rgbDecreaseBrightness(rgbColor, 40);
    const primary9 = rgbDecreaseBrightness(rgbColor, 55);
    const primary10 = rgbDecreaseBrightness(rgbColor, 70);
    const newStyle = `
        body, body[arco-theme='dark'] {
            --nanmenyu: primary;
            --primary-1: ${primary1};
            --primary-2: ${primary2};
            --primary-3: ${primary3};
            --primary-4: ${primary4};
            --primary-5: ${primary5};
            --primary-6: ${primary6};
            --primary-7: ${primary7};
            --primary-8: ${primary8};
            --primary-9: ${primary9};
            --primary-10: ${primary10};
        }`;

    duplicateDetection(/--nanmenyu: primary/g)
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = newStyle;
    document.head.appendChild(style);
}

// 副色
export function setupSecondaryThemes(color: string) {
    const rgbColor = color.replace('RGB(', '').replace(')', '').split(',').map(it => parseInt(it));
    const mySecondary5 = rgbDecreaseSaturation(rgbColor, 25);;
    const mySecondary6 = rgbColor;
    const newStyle = `
        body, body[arco-theme='dark'] {
        --nanmenyu: secondary;
        --my-secondary-5: ${mySecondary5}; 
        --my-secondary-6: ${mySecondary6};
    }`;

    duplicateDetection(/--nanmenyu: secondary/g)
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = newStyle;
    document.head.appendChild(style);
}

function duplicateDetection(reg: RegExp) {
    const headChildren = (<HTMLElement>document.head).children;
    for (let i = 0; i < headChildren.length; i++) {
        if (headChildren.item(i)!.nodeName === 'STYLE') {
            // 查看是否有识别标识,有标识就删除该样式表
            if (reg.test((<HTMLElement>headChildren.item(i)!).innerText)) {
                headChildren.item(i)?.remove();
                break;
            }
        }
    }
}