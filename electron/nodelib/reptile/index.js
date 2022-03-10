const axios = require('axios');
const cheerio = require('cheerio');

module.exports = (config, cb) => {
    if (config.type === 'wordSearch_baidu') {
        let data_baidu_base, data_baidu_extend;
        // 先爬取基础链接
        axios.get('https://hanyu.baidu.com/s', {
            params: {
                wd: config.word
            }
        }).then(res => {
            data_baidu_base = organizeData(res);
            if (data_baidu_base.basicmean === '' && data_baidu_base.detailmean === ''
                && data_baidu_base.source === '' && data_baidu_base.liju === ''
                && data_baidu_base.synonym === '' && data_baidu_base.antonym === '') {
                // 基础链接没有数据则爬取扩展链接
                axios.get('https://hanyu.baidu.com/s', {
                    params: {
                        wd: config.word,
                        ptype: 'zici'
                    }
                }).then(res => {
                    cb(organizeData(res));
                }).catch(err => {
                    console.log(err)
                })
            } else {
                cb(organizeData(res));
            }
        }).catch(err => {
            console.log(err)
        })

        // 数据整理
        function organizeData(res) {
            const $ = cheerio.load(res.data); // 准备cheerio
            // 百度汉语数据爬取
            const baidu_hanyu = {
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
            return baidu_hanyu;
        }
    }
}