<!-- 右内容栏 -->
<template>
    <!-- 弹出框 -->
    <PopupMenu
        v-if="isModify"
        title="修改作品信息"
        determine="确定"
        @toModify="modify"
        @toDetermine="determine"
        :determineDisabled="form.name.length === 0 || form.opus.length === 0"
    >
        <a-form :model="form">
            <a-form-item field="name" label="作者名称">
                <a-input
                    v-model.trim="form.name"
                    style="width: 370px"
                    :max-length="25"
                    :error="form.name.length === 0"
                    show-word-limit
                    allow-clear
                    placeholder="请输入作者名称..."
                />
            </a-form-item>
            <a-form-item field="opus" label="作品名称">
                <a-input
                    v-model.trim="form.opus"
                    style="width: 370px"
                    :max-length="25"
                    :error="form.opus.length === 0"
                    show-word-limit
                    allow-clear
                    placeholder="请输入作品名称..."
                />
            </a-form-item>
            <a-divider style="border-bottom-style: dashed" />
            <a-form-item field="category" label="作品分类">
                <a-cascader
                    path-mode
                    :options="category"
                    v-model="form.category"
                    style="width: 370px"
                    placeholder="请选择作品分类..."
                />
            </a-form-item>
            <a-form-item field="tag" label="作品标签">
                <a-space size="small">
                    <a-input
                        :style="{ 'width': '180px' }"
                        :max-length="8"
                        v-model.trim="inputTag"
                        show-word-limit
                        placeholder="添加自定义标签..."
                    />
                    <a-button
                        type="outline"
                        @click="addTag"
                        :disabled="inputTag.length === 0 || selectedArr.length >= 4 || selectedArr.indexOf(inputTag) !== -1"
                    >
                        <icon-plus />添加
                    </a-button>
                    <a-button type="text" @click="rotateIcon('tag')">
                        标签墙
                        <icon-down :class="tagRotated ? 'rotate' : '-rotate'" />
                    </a-button>
                </a-space>
            </a-form-item>
            <!-- 显示已经选择的标签 -->
            <a-form-item v-if="selectedArr.length > 0" field="selected" :label="promptText">
                <a-space>
                    <a-tag
                        v-for="item in selectedArr"
                        :key="item"
                        color="#00b42a"
                        closable
                        @close="closeTag(item)"
                    >
                        <icon-check-circle-fill />
                        {{ item }}
                    </a-tag>
                </a-space>
            </a-form-item>
            <!-- 标签墙 -->
            <div id="tagWall" :class="tagRotated ? 'expansion' : '-expansion'">
                <a-tabs default-active-key="1" :animation="true">
                    <a-tab-pane key="1" title="起点">
                        <h4>起点中文网热门标签</h4>
                        <a-space wrap>
                            <a-tag
                                v-for="(item, i) in tagData['qidian']"
                                :key="item"
                                @click="checkTag(item)"
                                :color="deCheckedArr[i] === undefined ? tagColor[i] : deCheckedArr[i]"
                            >{{ item }}</a-tag>
                        </a-space>
                    </a-tab-pane>
                    <a-tab-pane key="2" title="红袖">红袖添香网热门标签</a-tab-pane>
                    <a-tab-pane key="3" title="晋江">晋江文学城热门标签</a-tab-pane>
                    <a-tab-pane key="4" title="晋江">晋江文学城热门标签</a-tab-pane>
                    <a-tab-pane key="5" title="晋江">晋江文学城热门标签</a-tab-pane>
                    <a-tab-pane key="6" title="晋江">晋江文学城热门标签</a-tab-pane>
                    <a-tab-pane key="7" title="晋江">晋江文学城热门标签</a-tab-pane>
                </a-tabs>
            </div>
            <!-- 标签墙 -->
            <a-divider style="border-bottom-style: dashed" />
            <a-form-item field="briefintro" label="作品简介">
                <a-textarea
                    show-word-limit
                    v-model="form.briefintro"
                    :max-length="500"
                    :auto-size="{
                        minRows: 5,
                        maxRows: 5
                    }"
                    style="width: 370px;overflow: hidden;"
                    placeholder="来点简介..."
                />
            </a-form-item>
        </a-form>
    </PopupMenu>
    <PopupMenu
        v-if="isNewVolume"
        title="新增卷"
        determine="确定"
        @toModify="modify"
        @toDetermine="addNewVolume"
        :determineDisabled="volumeName.length === 0"
    >
        <a-space>
            <a-form-item field="name" label="卷名">
                <a-input
                    v-model.trim="volumeName"
                    style="width: 370px"
                    :max-length="25"
                    :error="volumeName.length === 0"
                    show-word-limit
                    allow-clear
                    placeholder="请输入卷名..."
                />
            </a-form-item>
        </a-space>
    </PopupMenu>
    <PopupMenu
        v-if="isNewChapter"
        title="新增章"
        determine="确定"
        @toModify="modify"
        @toDetermine="addNewChapter"
        :determineDisabled="chapterName.length === 0"
    >
        <a-space>
            <a-form-item field="name" label="章名">
                <a-input
                    v-model.trim="chapterName"
                    style="width: 370px"
                    :max-length="25"
                    :error="chapterName.length === 0"
                    show-word-limit
                    allow-clear
                    placeholder="请输入章名..."
                />
            </a-form-item>
        </a-space>
    </PopupMenu>
    <PopupMenu
        v-if="isRename"
        title="重命名"
        determine="确定"
        @toModify="modify"
        @toDetermine="reName"
        :determineDisabled="showName.length === 0"
    >
        <a-space>
            <a-form-item field="name" label="名称">
                <a-input
                    v-model.trim="showName"
                    style="width: 370px"
                    :max-length="25"
                    :error="showName.length === 0"
                    show-word-limit
                    allow-clear
                    placeholder="请输入新名称..."
                />
            </a-form-item>
        </a-space>
    </PopupMenu>
    <PopupMenu
        v-if="isReplaceCover"
        v-show="isShowReplaceCover"
        title="更换封面(4:3)"
        determine="确定"
        @toModify="cancelReplace"
        @toDetermine="saveImgData"
        bodyStyle="max-height: 400px;padding: 0;overflow: hidden;"
    >
        <img :src="imgUrl" ref="coverImg" />
    </PopupMenu>
    <div v-if="isWastepaperBasket" id="modify-box">
        <div class="wastepaperBasket">
            <div class="box-header">
                <div class="header-title">废纸篓</div>
                <div class="header-close" @click="modify">
                    <icon-close />
                </div>
            </div>
            <div class="box-body" style="padding: 0 0 0 10px;">
                <a-empty v-if="basketData.data.length === 0">空空如也</a-empty>
                <ul v-else>
                    <li
                        v-for="item in basketData.data"
                        :key="item.id"
                        @click="item.checked = !item.checked"
                    >
                        <div class="left">
                            <span>{{ item.name }}</span>
                            <span>{{ item.discardTime }}&nbsp;&nbsp;&nbsp;&nbsp;剩余{{ item.reTime }}天</span>
                        </div>
                        <div class="right">
                            <div v-if="!item.checked" class="btn-unchecked"></div>
                            <div v-else class="btn-checked">
                                <icon-check style="color: #fff;font-size: 18px;" />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="box-footer">
                <a-space size="large">
                    <a-button @click="deleteSelect" status="danger" type="outline">删除</a-button>
                    <a-button @click="restoreSelect" status="success" type="outline">还原</a-button>
                    <a-button @click="selectAll" type="outline">全选</a-button>
                    <a-button @click="modify">取消</a-button>
                </a-space>
            </div>
        </div>
    </div>
    <!-- 内容栏 -->
    <div class="detail-content">
        <Toolbar></Toolbar>
        <div class="content">
            <div class="head">
                <div class="left">
                    <input
                        type="file"
                        accept="image/*"
                        ref="fileInput"
                        @change="_replaceCover"
                        style="display: none;"
                    />
                    <img
                        @mouseenter="wrapper = true"
                        @mouseleave="wrapper = false"
                        :src="booksData.data.imgSrc === '' ? defaultCover : booksData.data.imgSrc"
                        @click="replaceCover"
                        title="建议长宽比例4:3"
                    />
                    <div v-show="wrapper" class="wrapper">点击修改封面</div>
                </div>
                <div class="middle">
                    <div class="title">
                        <span>{{ booksData.data.title }}</span>
                        <a-button
                            @click="isModify = true"
                            type="primary"
                            size="mini"
                            title="修改作品信息"
                        >
                            <template #icon>
                                <icon-edit class="edit" />
                            </template>
                        </a-button>
                        <span>◉ {{ booksData.data.author }}</span>
                    </div>
                    <a-space class="tag">
                        <div v-if="(booksData.data.tag || []).length > 0">
                            <a-tag
                                v-for="item in booksData.data.tag"
                                :key="item"
                                color="cyan"
                                style="margin: 2px 4px;"
                            >
                                <icon-tag />
                                {{ item }}
                            </a-tag>
                        </div>
                        <div v-else>
                            <a-tag color="gray">
                                <icon-tag />&nbsp;暂无标签
                            </a-tag>
                        </div>
                        <div v-if="(booksData.data.categories || []).length > 0">
                            <a-tag color="magenta" title="修改分类与标签">
                                <icon-star />
                                {{ (booksData.data.categories || []).join('/') }}
                            </a-tag>
                        </div>
                        <div v-else>
                            <a-tag color="lime">
                                <icon-star />&nbsp;暂未分类
                            </a-tag>
                        </div>
                    </a-space>
                    <div
                        class="desc"
                        v-html="booksData.data.desc === '' ? '请填写作品简介......' : booksData.data.desc"
                    ></div>
                    <div class="info">
                        <span>作品字数: {{ totalWords }}字</span>
                        <span>创建时间: {{ standTime(booksData.data.createTime, true) }}</span>
                        <span>最近修改: {{ showTimePipe(booksData.data.updateTime) }}</span>
                    </div>
                    <div class="control">
                        <a-popconfirm @ok="deleteOpus" content="确定将该作品移入回收站?" type="warning">
                            <button>删除</button>
                        </a-popconfirm>
                        <button @click="showWastepaperBasket">废纸篓</button>
                        <button @click="continueWriting">继续写作</button>
                    </div>
                </div>
                <div
                    class="right"
                    @mouseenter.stop="rightExpansion(true)"
                    @mouseleave.stop="rightExpansion(false)"
                    :class="isspread === null ? '' : isspread ? 'spread' : '-spread'"
                >
                    <div class="right-inside">
                        <div class="right-inside-item">
                            <a-button
                                @click="toSpecialEditor('plot')"
                                type="primary"
                                style="width: 120px;text-align: left;border-radius: 8px 0 0 8px;"
                            >
                                <img :src="svg_plot" style="vertical-align:bottom" />&nbsp;&nbsp;&nbsp;剧&nbsp;情
                            </a-button>
                        </div>
                        <div class="right-inside-item">
                            <a-button
                                @click="toSpecialEditor('keyword')"
                                type="primary"
                                style="width: 120px;text-align: left;border-radius: 8px 0 0 8px;"
                            >
                                <img :src="svg_keyword" style="vertical-align:bottom" />&nbsp;&nbsp;&nbsp;关键词
                            </a-button>
                        </div>
                        <div class="right-inside-item">
                            <a-button
                                @click="toSpecialEditor('diagram')"
                                type="primary"
                                style="width: 120px;text-align: left;border-radius: 8px 0 0 8px;"
                            >
                                <img :src="svg_diagram" style="vertical-align:bottom" />&nbsp;&nbsp;&nbsp;关系图
                            </a-button>
                        </div>
                        <div class="right-inside-item">
                            <a-button
                                @click="toSpecialEditor('timeline')"
                                type="primary"
                                style="width: 120px;text-align: left;border-radius: 8px 0 0 8px;"
                            >
                                <img :src="svg_timeline" style="vertical-align:bottom" />&nbsp;&nbsp;&nbsp;时间线
                            </a-button>
                        </div>
                        <div class="right-inside-item">
                            <a-button
                                @click="toSpecialEditor('map')"
                                type="primary"
                                style="width: 120px;text-align: left;border-radius: 8px 0 0 8px;"
                            >
                                <img :src="svg_map" style="vertical-align:bottom" />&nbsp;&nbsp;&nbsp;地&nbsp;图
                            </a-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cata">
                <h2>
                    目录
                    <span
                        style="font-size: 18px;"
                    >(共{{ (booksData.data.data || []).length }}卷&nbsp;{{ totalNumber }}章)</span>
                    <button @click="isNewVolume = true" class="btn">
                        <icon-plus-circle :style="{ fontSize: '22px', marginBottom: '-3px' }" />&nbsp;新增卷
                    </button>
                </h2>
                <a-empty
                    v-if="isEmpty"
                    description="点击右上角添加卷"
                    class="emptyCata"
                    style="margin-top: 100px;"
                />
                <div v-else v-for="(volume, index) in booksData.data.data" :key="volume.vid">
                    <div @click="rotateIcon(index)" class="volume">
                        <icon-caret-right :class="rotated[index] ? 'rotate' : '-rotate'" />
                        {{ volume.volumeName }}
                        <span
                            style="font-size: 15px;"
                        >(共{{ volume.volume.length }}章)</span>
                        <button
                            @click.stop="deleteVolume(volume.vid, volume.volumeName)"
                            class="btn2"
                        >
                            &nbsp;删除卷
                            <icon-close-circle :style="{ fontSize: '22px', marginBottom: '-3px' }" />
                        </button>
                        <button @click.stop="newChapter(volume.vid)" class="btn2">
                            &nbsp;新增章
                            <icon-plus-circle :style="{ fontSize: '22px', marginBottom: '-3px' }" />
                        </button>
                        <button
                            @click.stop="showReName('v', volume.vid, volume.volumeName)"
                            class="btn2"
                        >
                            &nbsp;重命名
                            <icon-minus-circle :style="{ fontSize: '22px', marginBottom: '-3px' }" />
                        </button>
                    </div>
                    <div :style="rotated[index] ? 'display:flex' : ''" class="chapter">
                        <span
                            v-for="chapter in volume.volume"
                            :key="chapter.cid"
                            @click="routerLink(booksData.data.id as number, volume.vid, chapter.cid)"
                            class="_chapter"
                        >
                            <p
                                style="height: 18px;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;"
                            >{{ chapter.chapterName }}</p>
                            <p>{{ standTime(chapter.updateTime) + '\u3000' + (chapter.chapterNum || 0) + '字' }}</p>
                            <button
                                @click.stop="deleteChapter(volume.vid, chapter.cid, chapter.chapterName)"
                                class="btn"
                            >
                                &nbsp;删除章
                                <icon-close-circle
                                    :style="{ fontSize: '18px', marginBottom: '-3px' }"
                                />
                            </button>
                            <button
                                @click.stop="showReName('c', chapter.cid, chapter.chapterName)"
                                class="btn btn2"
                            >
                                &nbsp;重命名
                                <icon-minus-circle
                                    :style="{ fontSize: '18px', marginBottom: '-3px' }"
                                />
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import {
    IconClose, IconPlus, IconEdit, IconTag, IconCheckCircleFill,
    IconStar, IconDown, IconCaretRight, IconPlusCircle, IconCloseCircle,
    IconCheck, IconMinusCircle
} from '@arco-design/web-vue/es/icon';
import Toolbar from './widget/Toolbar.vue';
import PopupMenu from './widget/PopupMenu.vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '../db/db';
import timeFormat from '../utils/timeFormat';
import showTimePipe from '../utils/showTimePipe';
import randomNum from '../utils/randomNum';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import useCurrentInstance from '../utils/useCurrentInstance';
import { v4 } from 'uuid';
import defaultCover from '../../public/static/img/default-cover.jpg';
import svg_plot from '../assets/svg/plot2.svg';
import svg_keyword from '../assets/svg/keyword2.svg';
import svg_diagram from '../assets/svg/diagram2.svg';
import svg_timeline from '../assets/svg/timeline2.svg';
import svg_map from '../assets/svg/map2.svg';
import category from '../assets/json/book_category.json';

const { proxy } = useCurrentInstance();
const $modal = proxy.$modal;
const $message = proxy.$message;

interface Form {
    name: string;
    opus: string;
    category: Array<string>;
    briefintro: string;
}

// 标签调试数据（模拟后端数据
const tagData = {
    'qidian': ['豪门', '孤儿', '盗贼', '特工', '黑客', '明星', '特种兵', '杀手', '老师', '学生', '胖子', '宠物', '蜀山', '魔王附体', 'LOL', '废材流', '护短', '卡片', '手游', '法师', '医生', '感情', '鉴宝', '亡灵', '职场', '吸血鬼', '龙', '西游', '鬼怪', '阵法', '魔兽', '勇猛', '玄学', '群穿', '丹药', '练功流', '召唤流', '恶搞', '爆笑', '轻松', '冷酷', '腹黑', '阳光', '狡猾', '机智', '猥琐', '嚣张', '淡定', '僵尸', '丧尸', '盗墓', '随身流', '软饭流', '无敌文', '异兽流', '系统流', '洪荒流', '学院流', '位面', '铁血', '励志', '坚毅', '变身', '强者回归', '赚钱', '争霸流', '种田文', '宅男', '无限流', '技术流', '凡人流', '热血', '重生', '穿越'],
    'honxiu': [],
    'jinjiang': []
};

/*----点击修改封面----*/
const wrapper = ref(false);

/*----获取路由参数确定详情页显示的目标----*/
const route = useRoute();
const query_id = parseInt(<string>route.query.id);
const router = useRouter();
const routerLink = (id: number, vid: string, cid: string) => {
    router.push({
        path: '/writer',
        query: {
            id: id,
            vid: vid,
            cid: cid
        }
    })
}

const toSpecialEditor = (type: string) => {
    router.push({
        path: '/specialEditor',
        query: {
            type: type,
            id: query_id
        }
    })
}

// 继续写作按键
const continueWriting = () => {
    const vid = booksData.data.historRecord.vid,
        cid = booksData.data.historRecord.cid;
    if (vid !== '' && cid !== '') {
        router.push({
            path: '/writer',
            query: {
                id: query_id,
                vid: vid,
                cid: cid
            }
        })
    }
}

/*----数据库取值----*/
const booksData: { data: Userdb } = reactive({
    data: {
        id: 0,
        author: '',
        title: '',
        createTime: 0,
        updateTime: 0,
        categories: [],
        tag: [],
        desc: '',
        imgSrc: '',
        data: [],
        discard: '',
        discardTime: 0,
        historRecord: { vid: '', cid: '' },
        theKeyWord: [],
        checked: false,
        thePlot: [],
        theTimeLine: [],
        opusNumber: 0
    }
});
const totalNumber = ref(0);
loadData();

const rightExpansion = (spread: boolean) => {
    isspread.value = spread;
}

/*----旋转动画----*/
const rotated = ref([false, false, false, false]);
const tagRotated = ref(false);
const rotateIcon = (i: number | string) => {
    if (i === 'tag') tagRotated.value = !tagRotated.value
    else rotated.value[<number>i] = !rotated.value[<number>i];
}

/*----时间格式化计算属性----*/
const standTime = computed(() => (ts: number, mode?: boolean) => {
    // 选择格式,是否裁切后半部分的准确时间
    mode = mode || false;
    if (mode) return timeFormat(ts).split(' ')[0];
    else return timeFormat(ts);
});

/*----修改作品信息的弹窗----*/
const isModify = ref(false);
const inputTag = ref('');
const form: Form = reactive({
    name: '',
    opus: '',
    category: [],
    briefintro: ''
})

// 随机生成tag的颜色
const tagColor = computed(() => {
    const color = [
        'red', 'orangered', 'orange', 'gold', 'lime', 'green',
        'cyan', 'blue', 'arcoblue', 'purple', 'pinkpurple', 'magenta'];
    const temp = [];
    for (let i = 0; i < tagData['qidian'].length; i++) {
        temp.push(color[randomNum(0, 11)]);
    }
    return temp;
})
// 提示文本
const promptText = computed(() => {
    return '已选择 ' + selectedArr.length + '/4';
})
// 标签墙控制
// 用户选择的标签保存在数组中
const selectedArr: Array<string> = reactive([]), deCheckedArr: Array<string> = reactive([]);
// 点击添加
const addTag = () => {
    let i = tagData['qidian'].indexOf(inputTag.value);
    if (i !== -1) deCheckedArr[i] = '#165dff';
    selectedArr.push(inputTag.value);
    inputTag.value = '';
}
// 关闭标签
const closeTag = (tname: string) => {
    const index = tagData['qidian'].indexOf(tname), i = selectedArr.indexOf(tname);
    selectedArr.splice(i, 1);
    delete deCheckedArr[index];
}
const modify = () => {
    isModify.value = false;
    isNewVolume.value = false;
    isNewChapter.value = false;
    isRename.value = false;
    isWastepaperBasket.value = false;
}
const checkTag = (tname: string) => {
    const i = selectedArr.indexOf(tname);
    // 判断tempArr是否有tname, 没有就push, 有就删除
    if (selectedArr.length < 4) {
        i === -1 ? selectedArr.push(tname) : selectedArr.splice(i, 1);
    } else {
        if (i !== -1) selectedArr.splice(i, 1);
    }
    deCheckedArr.splice(0, deCheckedArr.length); // 清空数组 
    selectedArr.forEach(item => {
        deCheckedArr[tagData['qidian'].indexOf(item)] = '#165dff';
    })
}
// 修改确定, 添加修改至数据库
const determine = () => {
    const categoryArr: Array<string> = [], tagArr: Array<string> = [];
    form.category.forEach(item => {
        categoryArr.push(item);
    })
    selectedArr.forEach(item => {
        tagArr.push(item);
    })
    db.opus.update(query_id, {
        author: form.name,
        title: form.opus,
        updateTime: new Date().getTime(),
        categories: categoryArr,
        tag: tagArr,
        desc: form.briefintro.replaceAll('\n', '<br/>')
    });
    booksData.data.author = form.name;
    booksData.data.title = form.opus;
    booksData.data.tag = selectedArr;
    booksData.data.categories = form.category;
    booksData.data.desc = form.briefintro.replaceAll('\n', '<br/>');
    modify();
}

/*----控制鼠标事件-右侧栏展开关闭----*/
const isspread: any = ref(null);

/*----删除作品----*/
const deleteOpus = () => {
    db.opus.update(query_id, { discard: 't', discardTime: new Date().getTime() })
        .then(() => {
            router.push({
                path: '/',
                query: {
                    Message: `《${booksData.data.title}》已移入回收站`
                }
            });
        });
}

// 点击添加卷
const isNewVolume = ref(false), volumeName = ref('未命名卷');
const addNewVolume = () => {
    db.opus.where(':id').equals(query_id).modify(item => {
        item.data.push({
            vid: v4(),
            volumeName: volumeName.value,
            updateTime: new Date().getTime(),
            volume: [{
                cid: v4(),
                chapterName: '未命名章',
                updateTime: new Date().getTime(),
                chapter: ['\u3000\u3000']
            }]
        });
    }).then(() => {
        isNewVolume.value = false;
        loadData();
        $message.success('添加成功!');
    })
}
// 点击添加章
const isNewChapter = ref(false), chapterName = ref('未命名章');
let volumeId = ''; // 找到目标卷才能向里面push章
const newChapter = (vid: string) => {
    volumeId = vid;
    isNewChapter.value = true;
}
const addNewChapter = () => {
    db.opus.where(':id').equals(query_id).modify(item => {
        for (let i = 0; i < item.data.length; i++) {
            if (item.data[i].vid === volumeId) {
                item.data[i].volume.push({
                    cid: v4(),
                    chapterName: chapterName.value,
                    chapterNum: 0,
                    scrollTop: 0,
                    updateTime: new Date().getTime(),
                    chapter: ['\u3000\u3000']
                });
                break;
            }
        }
    }).then(() => {
        isNewChapter.value = false;
        loadData();
        $message.success('添加成功!');
    })
}

// 删除卷（移至废纸篓）
const deleteVolume = (vid: string, vname: string) => {
    $modal.warning({
        title: "删除卷",
        content: `目标卷【${vname}】将放入废纸篓, 并保留30天`,
        simple: true,
        onOk: () => {
            db.opus.where(':id').equals(query_id).modify(item => {
                for (let i = 0; i < item.data.length; i++) {
                    if (item.data[i].vid === vid) {
                        item.data[i].discard = true;
                        item.data[i].discardTime = new Date().getTime();
                        break;
                    }
                }
            }).then(() => {
                loadData();
                $message.success('删除成功!');
            })
        }
    })
}
// 删除章（移至废纸篓）
const deleteChapter = (vid: string, cid: string, cname: string) => {
    $modal.warning({
        title: "删除章",
        content: `目标章《${cname}》将放入废纸篓, 并保留30天`,
        simple: true,
        onOk: () => {
            db.opus.where(':id').equals(query_id).modify(item => {
                for (let i = 0; i < item.data.length; i++) {
                    if (item.data[i].vid === vid) {
                        for (let j = 0; j < item.data[i].volume.length; j++) {
                            if (item.data[i].volume[j].cid === cid) {
                                item.data[i].volume[j].discard = true;
                                item.data[i].volume[j].discardTime = new Date().getTime();
                                break;
                            }
                        }
                        break;
                    }
                }
            }).then(() => {
                loadData();
                $message.success('删除成功!');
            })
        }
    })
}
// 重命名
const isRename = ref(false), showName = ref('');
let temp_id: string, reType: string = '';
const showReName = (type: string, id: string, vname: string) => {
    isRename.value = true;
    reType = type; // 重命名类型
    temp_id = id;
    showName.value = vname;
}
const reName = () => {
    // 修改卷
    if (reType === 'v') {
        db.opus.where(':id').equals(query_id).modify(item => {
            for (let i = 0; i < item.data.length; i++) {
                if (item.data[i].vid === temp_id) {
                    item.data[i].volumeName = showName.value;
                    break;
                }
            }
        }).then(() => {
            isRename.value = false;
            loadData();
        })
    }
    // 修改章
    else if (reType === 'c') {
        db.opus.where(':id').equals(query_id).modify(item => {
            for (let i = 0; i < item.data.length; i++) {
                for (let j = 0; j < item.data[i].volume.length; j++) {
                    if (item.data[i].volume[j].cid === temp_id) {
                        item.data[i].volume[j].chapterName = showName.value;
                        break;
                    }
                }
            }
        }).then(() => {
            isRename.value = false;
            loadData();
        })
    }
}

// 显示废纸篓面板
const isWastepaperBasket = ref(false);
const showWastepaperBasket = () => {
    isWastepaperBasket.value = true;
    loadWastepaperBasketData();
}
interface BasketData {
    id: string;
    name: string;
    discardTime: string;
    reTime: number;
    checked: boolean;
}
// 废纸篓中的数据
let wastepaperBasketData: Array<any> = [];
const basketData: { data: Array<BasketData> } = reactive({ data: [] });
function loadWastepaperBasketData() {
    basketData.data = wastepaperBasketData.map(item => {
        return {
            id: item.vid || item.cid,
            name: item.volumeName || item.chapterName,
            discardTime: timeFormat(item.discardTime),
            reTime: 30 - Math.floor((new Date().getTime() - item.discardTime) / 86400000),
            checked: false
        }
    })
}
// 点击全选键
const selectAll = () => {
    let temp = 0, len = basketData.data.length;
    for (let i = 0; i < len; i++) {
        temp += basketData.data[i].checked ? 1 : 0;
        if (!basketData.data[i].checked) {
            basketData.data.forEach(item => {
                item.checked = true;
            });
            break;
        }
    }
    if (temp === len) {
        basketData.data.forEach(item => {
            item.checked = false;
        });
    }
}
// 点击还原选中键
const restoreSelect = () => {
    const targetId: Array<string> = [];
    basketData.data.forEach(item => {
        if (item.checked) targetId.push(item.id);
    });
    if (targetId.length > 0) {
        db.opus.where(':id').equals(query_id).modify(item => {
            for (let i = 0; i < targetId.length; i++) {
                for (let j = 0; j < item.data.length; j++) {
                    if (item.data[j].vid === targetId[i]) {
                        item.data[j].discard = false;
                        break;
                    } else {
                        for (let m = 0; m < item.data[j].volume.length; m++) {
                            if (item.data[j].volume[m].cid === targetId[i]) {
                                item.data[j].volume[m].discard = false;
                                break;
                            }
                        }
                    }
                }
            }
        }).then(() => {
            isWastepaperBasket.value = false;
            loadData();
            $message.success('还原成功!');
        })
    }
}
// 点击删除选中键
const deleteSelect = () => {
    const targetId: Array<string> = [];
    basketData.data.forEach(item => {
        if (item.checked) targetId.push(item.id);
    });
    if (targetId.length > 0) {
        db.opus.where(':id').equals(query_id).modify(item => {
            for (let i = 0; i < targetId.length; i++) {
                for (let j = 0; j < item.data.length; j++) {
                    if (item.data[j].vid === targetId[i]) {
                        item.data.splice(j, 1);
                        break;
                    } else {
                        for (let m = 0; m < item.data[j].volume.length; m++) {
                            if (item.data[j].volume[m].cid === targetId[i]) {
                                item.data[j].volume.splice(m, 1);
                                break;
                            }
                        }
                    }
                }
            }
        }).then(() => {
            isWastepaperBasket.value = false;
            loadData();
            $message.success('删除成功!');
        })
    }
}

// 更换封面图片
const isReplaceCover = ref(false), isShowReplaceCover = ref(false), imgUrl = ref(''),
    coverImg = ref(), fileInput = ref();
const replaceCover = () => {
    fileInput.value.click();
}
let cropper: Cropper;
const _replaceCover = () => {
    if (fileInput.value.value !== '') {
        // 渲染DOM但不显示
        isReplaceCover.value = true;
        isShowReplaceCover.value = false;
        //使用 FileReader() 构造器获得图片的base64
        const reader = new FileReader();
        reader.readAsDataURL(fileInput.value.files[0]);
        reader.onload = function (evt) {
            imgUrl.value = <string>evt.target!.result;
            // 等待目标图片加载完成调用cropper按要求裁剪封面
            coverImg.value.onload = function () {
                if (imgUrl.value.length > 20000000) { //20MB
                    isReplaceCover.value = false; //删除dom
                    $modal.warning({
                        title: '图片太大',
                        content: '图片太大,请适度压缩'
                    });
                } else {
                    isShowReplaceCover.value = true; // 显示
                    cropper = new Cropper(coverImg.value, {
                        aspectRatio: 3 / 4, // 封面这里采用宽3高四的固定比例
                        viewMode: 1,
                        // 设置图片是否可以拖拽功能
                        dragMode: 'move',
                        // 是否显示图片后面的网格背景,一般默认为true
                        background: true,
                        // 进行图片预览的效果
                        preview: '.before',
                        // 设置裁剪区域占图片的大小 值为 0-1 默认 0.8 表示 80%的区域
                        autoCropArea: 1,
                        // 设置图片是否可以进行收缩功能
                        zoomOnWheel: true,
                        // 是否显示 + 箭头
                        center: true
                    })
                }
            }
        }
    }
}
// 取消更换封面
const cancelReplace = () => {
    isReplaceCover.value = false;
    // 清空表单值避免在连续选择同一张图时onchange不触发
    fileInput.value.value = '';
    // 避免连续选择同一张图时图片onload事件不触发
    imgUrl.value = '';
}
let base64Img: string;
const saveImgData = () => {
    cancelReplace();
    // 拿到裁剪后的图片
    const cropperData = cropper.getCroppedCanvas({ imageSmoothingQuality: 'high' })
    // 如果图片大小大于100kb
    let quality = 0.92;
    base64Img = cropperData.toDataURL('image/jpeg', quality); // 设置图片格式
    if (base64Img.length > 100000) {
        let i = 50; //最多执行50次以免死循环
        while (i > 0) {
            quality = quality / 2;
            base64Img = cropperData.toDataURL('image/jpeg', quality);
            if (base64Img.length < 100000) break;
            i--;
        }
    }

    // 设置图片本地保存的路径
    const path = 'workspace/opus/' + booksData.data.id;
    window.$API.ipcSend('saveBase64-toImg', { b64: base64Img, path: path, fname: 'cover.jpeg' });
    window.$API.ipcOnce('saveBase64-toImg-successful', () => {
        db.opus.update(query_id, { imgSrc: base64Img }).then(() => {
            isReplaceCover.value = false;
            $message.success('设置成功!');
            loadData();
        })
    });
}

// 加载数据
const isEmpty = ref(false);
const totalWords = ref(0);
function loadData() {
    db.opus.get(query_id)
        .then(value => {
            if (value) {
                booksData.data = value;
                totalWords.value = value.opusNumber;
                // 表单值预先初始化
                form.name = booksData.data.author;
                form.opus = booksData.data.title;
                form.category = booksData.data.categories;
                form.briefintro = booksData.data.desc.replaceAll('<br/>', '\n');
                booksData.data.tag.forEach(item => {
                    selectedArr.push(item);
                });
                // 计算作品总章数
                wastepaperBasketData = [];// 清空临时废纸篓列表
                booksData.data.data = booksData.data.data.filter(item => {
                    // 判断目标卷是否有删除标记
                    if (item.discard) wastepaperBasketData.push(item);
                    return !item.discard;
                });
                let num = 0;
                booksData.data.data.forEach(item => {
                    item.volume = item.volume.filter(it => {
                        // 判断目标章是否有删除标记
                        if (it.discard) wastepaperBasketData.push(it);
                        else num++;
                        return !it.discard;
                    })
                });
                booksData.data.data.length > 0 ? isEmpty.value = false : isEmpty.value = true;
                totalNumber.value = num; // 作品总章数
            }
        });
}

</script>

<style lang="scss" src="../style/bookdetail.scss" scoped>
</style>