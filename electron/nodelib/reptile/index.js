const axios = require('axios');
const cheerio = require('cheerio');

module.exports = (config, cb) => {
    axios.get(config.url, {
        params: config.params
    }).then(res => {
        const $ = cheerio.load(res.data); // 准备cheerio
        // 百度汉语数据爬取
        const baidu_hanyu = {
            // pinyin: '', // 拼音
            basicmean: '',// 基本解释
            detailmean: '', // 详细解释
            source: '',// 出处
            liju: '',// 例句
            synonym: '',// 近义词
            antonym: '',//反义词
        }
        // 获取基本的html数据
        baidu_hanyu.basicmean = $('#basicmean-wrapper .tab-content').html() ?? '';
        baidu_hanyu.detailmean = $('#detailmean-wrapper .tab-content').html() ?? '';
        baidu_hanyu.source = $('#source-wrapper .tab-content').html() ?? '';
        baidu_hanyu.liju = $('#liju-wrapper .tab-content').html() ?? '';
        baidu_hanyu.synonym = $('#syn_ant_wrapper #synonym').html() ?? '';
        baidu_hanyu.antonym = $('#syn_ant_wrapper #antonym').html() ?? '';
        // 去除标签的链接
        // href=".*"
        baidu_hanyu.synonym = baidu_hanyu.synonym.replaceAll(/href=".*"/g, '');
        baidu_hanyu.antonym = baidu_hanyu.antonym.replaceAll(/href=".*"/g, '');
        // 回调返回
        cb(baidu_hanyu);
    }).catch(err => {
        console.log(err)
    })
}