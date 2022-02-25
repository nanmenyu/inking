/**
 * 通过关键字生成对应的Marks数组
 */
export default function genkeywordMarks(keywordArr: Array<string>) {
    // [color,background-color]
    const result: Array<{
        match: RegExp, class: string, style: string
    }> = [];
    const colorGroup = [
        ['#f53f3f', '#ffece8'], ['#d91ad9', '#ffe8fb'], ['#f77234', '#fff3e8'], ['#ff7d00', '#fff7e8'], ['#9fdb1d', '#fcffe8'], ['#f7ba1e', '#fffce8'], ['#00b42a', '#e8ffea'], ['#3491fa', '#e8f7ff'], ['#14c9c9', '#e8fffb'], ['#165dff', '#e8f3ff'], ['#722ed2', '#f5e8ff'], ['#f5319d', '#ffe8f1'],
        ['#86909c', '#f2f3f5']
    ]
    // 关键字取最大集，例如：vue+vuex=vuex bc+abcd=abcd
    keywordArr.forEach((item, index) => {
        let color = colorGroup[index % colorGroup.length][0];
        let bgColor = colorGroup[index % colorGroup.length][1];
        item.split('/').forEach(it => {
            result.push({
                match: new RegExp(it, 'g'),
                class: 'keyWord',
                style: `color: ${color};background-color:${bgColor};`
            })
        })
    })
    return result;
}