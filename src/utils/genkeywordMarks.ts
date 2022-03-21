/**
 * 通过关键字生成对应的Marks数组
 */
// import { useMainStore } from '../store/index';
// const mainStore = useMainStore();

export default function genkeywordMarks(keywordArr: Array<Array<string>>) {
    // [color,background-color]
    const result: Array<Marker> = [];
    const colorGroup = [
        ['rgb(var(--orange-6)) ', 'rgb(var(--orange-1))'], ['rgb(var(--lime-6))', 'rgb(var(--lime-1))'],
        ['#f77234', '#fff3e8'], ['rgb(var(--red-6))', 'rgb(var(--red-1))'], ['rgb(var(--gold-6))', 'rgb(var(--gold-1))'],
        ['rgb(var(--orangered-6))', 'rgb(var(--orangered-1))'], ['rgb(var(--green-6))', 'rgb(var(--green-1))'],
        ['rgb(var(--gray-6))', 'rgb(var(--gray-2))'], ['rgb(var(--cyan-6))', 'rgb(var(--cyan-1))'],
        ['rgb(var(--magenta-6))', 'rgb(var(--magenta-1))'], ['rgb(var(--blue-6))', 'rgb(var(--blue-1))'],
        ['rgb(var(--pinkpurple-6))', 'rgb(var(--pinkpurple-1))'], ['rgb(var(--arcoblue-6))', 'rgb(var(--arcoblue-1))'],
        ['rgb(var(--purple-6))', 'rgb(var(--purple-1))']
    ];
    keywordArr.forEach((item, index) => {
        const color = colorGroup[index % colorGroup.length][0];
        const bgColor = colorGroup[index % colorGroup.length][1];
        item.forEach((it, i) => {
            // 跳过前两位的kid和iid
            if (i > 1 && it !== '') result.push({
                match: new RegExp(it, 'ig'),
                class: 'keyWord',
                style: `color: ${color};background-color:${bgColor};`
            })
        })
    })
    return result;
}