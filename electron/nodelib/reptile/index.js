const axios = require('axios');
const cheerio = require('cheerio');

module.exports = (config, cb) => {
    if (config.type === 'wordSearch_baidu') {
        // 先爬取基础链接
        axios.get('https://hanyu.baidu.com/s', {
            params: {
                wd: config.word
            }
        }).then(res => {
            const data_baidu = organizeData(res);
            if (data_baidu.basicmean === '' && data_baidu.detailmean === ''
                && data_baidu.source === '' && data_baidu.liju === ''
                && data_baidu.synonym === '' && data_baidu.antonym === '') {
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
                cb(data_baidu);
            }
        }).catch(err => {
            console.log(err)
        })

        // 数据整理
        function organizeData(res) {
            const $ = cheerio.load(res.data); // 准备cheerio
            // 百度汉语数据爬取
            const baidu_hanyu = {
                site: 'baidu', // 标志
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
    } else if (config.type === 'wordSearch_zdic') {
        axios.get(encodeURI(`https://www.zdic.net/hans/${config.word}`)).then(res => {
            cb(organizeData(res));

            function organizeData(res) {
                const $ = cheerio.load(res.data);
                // 汉典数据爬取
                const zdic = {
                    site: 'zdic', // 标志
                    jnr: '', // 词语解释
                    gnr: '', // 国语辞典
                    cyjs: '' // 成语解释
                }
                zdic.jnr = $('.homograph-entry .dictionaries .jnr').html() ?? '';
                zdic.gnr = $('.homograph-entry .dictionaries .gnr .gycd ol').html() ?? '';
                zdic.cyjs = $('.homograph-entry .dictionaries #cyjs .content').html() ?? '';
                // 去除多余标签
                zdic.gnr = zdic.gnr.replaceAll('<span class="gc_jfy_i">反</span>', '反:').replaceAll('<span class="gc_jfy_i">近</span>', '近:')
                zdic.cyjs = zdic.cyjs.replaceAll(/<div.*div>/g, '').replaceAll(/<h3.*h3>/g, '');
                return zdic;
            }
        }).catch(err => {
            console.log(err)
        })
    }
}