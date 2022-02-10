/**
 * 获取CSS样式(IE不兼容)
 */
export default function getStyle(el: HTMLElement, name: string, pclass?: string | null | undefined): string {
    // 标准DOM使用 getComputedStyle() 方法
    // 第二个参数是伪类, 'before','after',null（默认或false)
    pclass = pclass || null;
    return getComputedStyle(el, pclass)[name as any];
}