import axios from "axios";
import config from '../../package.json';
import { useMainStore } from '../store';

/**
 * 检测版本更新
 */
export default function toupdate(proxy: Record<string, any>, haveMsg: boolean, cb?: Function) {
    const mainStore = useMainStore();
    const $message = proxy.$message;
    const $modal = proxy.$modal;

    axios.get('http://localhost:8888/update').then(res => {
        if (res.data.version !== config.version) {
            // 发现新版本
            $modal.info({
                title: '发现新版本',
                content: `发现新版本v${res.data.version}，是否开启下载更新？`,
                onOk: () => {
                    window.$API.ipcSend('checkForUpdate', res.data.upDateUrl);
                    window.$API.ipcOn('get-updateMsg', (data: { msg: number, data: any }) => {
                        switch (data.msg) {
                            case -1:
                                $message.error('网络连接问题');
                                break;
                            case 0:
                                $message.error('更新出现错误');
                                break;
                            case 1:
                                $message.error('开始检查更新');
                                break;
                            case 2:
                                // console.log('发现更新');
                                break;
                            case 3:
                                $message.error('没有发现更新');
                                break;
                            case 4:
                                mainStore.downloading = true;
                                mainStore.downloadProgress = data.data.percent.toFixed(1);
                                break;
                            case 5:
                                mainStore.downloading = false;
                                mainStore.downloadProgress = 0;
                                $message.success('下载完成, 3秒钟后安装新版本,请不要点击取消...')
                                break;
                        }
                    })
                }
            })
        } else {
            if (haveMsg) $message.success('现在已经是最新版本');
            if (typeof cb === 'function') cb();
        }
    }).catch((err) => {
        if (haveMsg) $message.error('网络出现问题');
        if (typeof cb === 'function') cb();
    })
}

