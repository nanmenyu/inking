<!-- 关键字编辑模块 -->
<template>
    <PopupMenu
        v-if="isCardEdit"
        title="关键词组编辑"
        determine="确定"
        @toModify="modify"
        @toDetermine="confirmKeywordGroup"
        :boxClass="['box', 'card-detail']"
        :bodyClass="['box-body', 'detail-body']"
        :determineDisabled="!form.keyword.title || !form.keyword.desc"
    >
        <div class="detail-left">
            <input
                type="file"
                accept="image/*"
                ref="fileInput"
                @change="_replaceCover(5 / 7)"
                style="display: none;"
            />
            <img
                @click="replaceCover(1)"
                :src="form.keyword.cardImg === '' ? defaultImg : form.keyword.cardImg"
            />
            <h3>点击更换主题图片</h3>
        </div>
        <div class="detail-right">
            <a-form :model="form.keyword" style="margin-top: 20px;">
                <a-form-item field="关键组" label="关键组">
                    <a-input
                        v-model.trim="form.keyword.title"
                        :max-length="15"
                        placeholder="请填写关键词组..."
                    />
                </a-form-item>
                <a-form-item field="描述" label="描述">
                    <a-textarea
                        show-word-limit
                        v-model.trim="form.keyword.desc"
                        :max-length="25"
                        :auto-size="{
                            minRows: 5
                        }"
                        placeholder="请填写关键词组描述..."
                    />
                </a-form-item>
            </a-form>
        </div>
    </PopupMenu>
    <div v-if="isCardContent" id="modify-box" @mousedown="modifyAllItem">
        <div class="box">
            <div class="box-header">
                <div class="header-title">关键词面板({{ currentGroupName }})</div>
                <div class="header-close" @click="modify">
                    <icon-close />
                </div>
            </div>
            <div class="box-body">
                <div class="body-left">
                    <div class="left-top">
                        <a-space style="height: 35px;">
                            <a-button @click="addNewKeyWord" type="text" size="small">
                                <template #icon>
                                    <icon-plus />
                                </template>
                                <template #default>添加新项目</template>
                            </a-button>
                            <a-button @click="setTemplate" size="small" title="模板">
                                <template #icon>
                                    <img :src="templateicon" />
                                </template>
                            </a-button>
                        </a-space>
                    </div>
                    <a-empty v-if="currentListName.data.length === 0" style="margin-top: 150px;"></a-empty>
                    <ul v-else class="left">
                        <li
                            v-for="(item, index) in currentListName.data"
                            :key="item.iid"
                            :class="item.iid === checkedItem ? 'li-checked' : ''"
                            @click="choiceCardItem(item.kid as string, item.iid as string)"
                        >
                            <div>{{ index + 1 < 10 ? '00' + (index + 1) : index + 1 < 100 ? '0' + (index + 1) : index + 1 }}&nbsp;{{ item.itemName }}</div>
                            <button
                                @click="deleteItem(item.itemName as string, item.kid as string, item.iid as string)"
                                title="删除"
                            >
                                <icon-delete />
                            </button>
                        </li>
                    </ul>
                </div>
                <div v-if="currentListData.data.length === 0" class="body-right"></div>
                <div v-else class="body-right">
                    <div class="right-top">
                        <input
                            type="file"
                            accept="image/*"
                            ref="fileInput"
                            @change="_replaceCover(1 / 1)"
                            style="display: none;"
                        />
                        <img
                            @click="replaceCover(2)"
                            :src="currentListData.data.itemImg === '' ? defaultImg : currentListData.data.itemImg"
                            title="点击修改"
                        />
                        <div class="right-top-right">
                            <h3 v-show="!modifyItemName">
                                <a-button
                                    @mousedown.stop="modifyItem('itemName', true)"
                                    size="mini"
                                    shape="circle"
                                    title="修改"
                                >
                                    <icon-pen :style="{ fontSize: '16px', marginTop: '2px' }" />
                                </a-button>&nbsp;
                                <a-popover style="max-width: 500px;">
                                    <span>{{ currentListData.data.itemName }}</span>
                                    <template #content>
                                        <span>别名:&nbsp;{{ currentListData.data.otherName.join('/') }}</span>
                                    </template>
                                </a-popover>
                            </h3>
                            <h3 v-show="modifyItemName">
                                <a-input
                                    @mousedown.stop
                                    v-model="itemNameFormat"
                                    :style="{ width: '300px' }"
                                    :max-length="100"
                                    show-word-limit
                                    size="small"
                                    placeholder="修改关键词"
                                />
                            </h3>
                            <div v-show="!modifyItemDesc" style="padding-right: 10px;">
                                <a-button
                                    @mousedown.stop="modifyItem('itemDesc', true)"
                                    size="mini"
                                    shape="circle"
                                    title="修改"
                                >
                                    <icon-pen :style="{ fontSize: '16px', marginTop: '2px' }" />
                                </a-button>
                                &nbsp;{{ currentListData.data.itemDesc }}
                            </div>
                            <div v-show="modifyItemDesc">
                                <a-textarea
                                    @mousedown.stop
                                    v-model="currentListData.data.itemDesc"
                                    placeholder="修改关键字介绍"
                                    :max-length="250"
                                    show-word-limit
                                    :style="{ width: '500px' }"
                                    :auto-size="{
                                        minRows: 5,
                                        maxRows: 5
                                    }"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="right-middle">
                        <a-button @click="isAssociated = !isAssociated" type="text">
                            {{ isAssociated ? '返回原样' : '添加关联项' }}
                            <icon-caret-right />
                        </a-button>
                        <a-space
                            v-if="!isAssociated"
                            style="height:100%;margin: 0 15px;padding-top: 8px;"
                            wrap
                        >
                            <a-tag
                                v-for="item in currentAssociated.data"
                                :key="item.key"
                                :color="getIntensityColor(item.value)"
                            >
                                {{ item.key }}
                                <span
                                    @click="deleteTag(item)"
                                    class="tag-close"
                                    title="删除"
                                >
                                    <icon-close />
                                </span>
                            </a-tag>
                        </a-space>
                        <a-space v-else>
                            <a-cascader
                                :options="associatedOptions"
                                style="width: 250px;margin: 4px 0 4px 15px"
                                placeholder="选择关联目标(可直接搜索)"
                                allow-search
                                path-mode
                                @change="getCascaderValue"
                            />
                            <a-rate
                                :default-value="1"
                                @change="getCascaderIntensity"
                                title="选择关联强度(1-5)"
                            >
                                <template #character="index">
                                    <icon-fire v-if="index >= 0" />
                                </template>
                            </a-rate>
                            <a-button
                                @click="addNewAssociated"
                                :disabled="!isallowAddAssociated"
                                type="primary"
                                size="small"
                            >添加</a-button>
                        </a-space>
                    </div>
                    <div class="right-bottom">
                        <a-space direction="vertical" style="float: left;">
                            <a-button @click="addCustomizeItem(1)" type="text" size="small">
                                {{ custString ? '返回面板' : '自添加字符项' }}
                                <icon-plus v-if="!custString" />
                                <icon-reply v-else />
                            </a-button>
                            <a-button @click="addCustomizeItem(2)" type="text" size="small">
                                {{ custNumber ? '返回面板' : '自添加数值项' }}
                                <icon-plus v-if="!custNumber" />
                                <icon-reply v-else />
                            </a-button>
                            <a-select
                                :style="{ width: '120px' }"
                                v-model="showType_right"
                                size="small"
                                placeholder="选择显示"
                                :trigger-props="{ autoFitPopupMinWidth: true }"
                                @change="showChart"
                            >
                                <a-option>字符项</a-option>
                                <a-option>数值项</a-option>
                                <a-option>数值项可视化</a-option>
                            </a-select>
                        </a-space>
                        <div
                            v-if="showType_right === '字符项' && !custString && !custNumber"
                            class="right-bottom-right"
                        >
                            <!-- 字符项 -->
                            <div
                                v-for="(item, index) in currentListData.data.itemString"
                                :key="item.key"
                                class="right-item"
                            >
                                <span
                                    @click="modifyCustomizeItem(1, item, index)"
                                    class="item-key"
                                    title="点击编辑"
                                >
                                    <span
                                        @click.stop="deleteCustomizeItem(1, item.key)"
                                        class="item-close"
                                        title="删除"
                                    >
                                        <icon-close />
                                    </span>
                                    {{ item.key }}
                                </span>
                                <a-popover style="max-width: 500px;">
                                    <span class="item-value">{{ item.value }}</span>
                                    <template #content>
                                        <span>{{ item.value }}</span>
                                    </template>
                                </a-popover>
                            </div>
                        </div>
                        <div
                            v-if="showType_right === '数值项' && !custString && !custNumber"
                            class="right-bottom-right"
                        >
                            <!-- 数值项 -->
                            <div
                                v-for="(item, index) in currentListData.data.itemNumber"
                                :key="item.key"
                                class="right-item"
                            >
                                <span
                                    @click="modifyCustomizeItem(2, item, index)"
                                    class="item-key"
                                    title="点击编辑"
                                >
                                    <span
                                        @click.stop="deleteCustomizeItem(2, item.key)"
                                        class="item-close"
                                        title="删除"
                                    >
                                        <icon-close />
                                    </span>
                                    {{ item.key }}
                                </span>
                                <span class="item-value">{{ item.value }}&nbsp;{{ item.unit }}</span>
                            </div>
                        </div>
                        <div
                            v-if="showType_right === '数值项可视化' && !custString && !custNumber"
                            class="right-bottom-right"
                        >
                            <div class="chart-left" ref="numberChart"></div>
                            <div class="chart-right">
                                <ul>
                                    <li style="text-indent: 0;" title="雷达图量程(默认是同组同单位中出现的最大值)">
                                        <a-input-number
                                            v-model="maxValue"
                                            placeholder="MAX"
                                            size="mini"
                                            :min="0"
                                            @change="inputMaxValue"
                                            mode="button"
                                        />
                                    </li>
                                    <li
                                        v-for="(item, i) in rightListData.value"
                                        :key="i"
                                        @click="checkChartItem(item)"
                                        :class="nowUnit === item ? 'li-checked' : ''"
                                    >单位:“{{ item }}”</li>
                                </ul>
                            </div>
                        </div>
                        <div v-if="custString" class="right-bottom-right">
                            <a-space
                                direction="vertical"
                                size="large"
                                style="width: 95%;margin-top: 20px;"
                            >
                                <a-form :model="form_custString.data">
                                    <a-form-item field="字符项-键" label="字符项-键">
                                        <a-input
                                            v-model.trim="form_custString.data.key"
                                            :max-length="15"
                                            placeholder="自定义的项目名称"
                                            show-word-limit
                                        />
                                    </a-form-item>
                                    <a-form-item field="字符项-值" label="字符项-值">
                                        <a-textarea
                                            v-model.trim="form_custString.data.value"
                                            placeholder="对应项目的内容"
                                            show-word-limit
                                            :max-length="250"
                                            :auto-size="{
                                                minRows: 3
                                            }"
                                        />
                                    </a-form-item>
                                    <a-form-item>
                                        <a-button
                                            @click="confirmAdd(1)"
                                            :disabled="form_custString.data.key.length == 0"
                                            type="primary"
                                        >{{ isModifyCustomize ? '确认修改' : '确认添加' }}</a-button>
                                    </a-form-item>
                                </a-form>
                            </a-space>
                        </div>
                        <div v-if="custNumber" class="right-bottom-right">
                            <a-space
                                direction="vertical"
                                size="large"
                                style="width: 95%;margin-top: 20px;"
                            >
                                <a-form :model="form_custNumber.data">
                                    <a-form-item field="数值项-键" label="数值项-键">
                                        <a-input
                                            v-model.trim="form_custNumber.data.key"
                                            :max-length="15"
                                            placeholder="自定义的项目名称"
                                            show-word-limit
                                        />
                                    </a-form-item>
                                    <a-form-item field="数值项-值" label="数值项-值">
                                        <a-input-number
                                            placeholder="选择数值"
                                            v-model="form_custNumber.data.value"
                                            mode="button"
                                            :min="0"
                                        />
                                    </a-form-item>
                                    <a-form-item field="自定义单位" label="自定义单位*">
                                        <a-input
                                            v-model.trim="form_custNumber.data.unit"
                                            :max-length="10"
                                            placeholder="自定义单位"
                                            show-word-limit
                                            style="width: 260px;"
                                        />
                                    </a-form-item>
                                    <a-form-item>
                                        <a-button
                                            @click="confirmAdd(2)"
                                            :disabled="form_custNumber.data.key.length == 0"
                                            type="primary"
                                        >{{ isModifyCustomize ? '确认修改' : '确认添加' }}</a-button>
                                    </a-form-item>
                                </a-form>
                            </a-space>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box-footer">
                <a-space size="large">
                    <a-button @click="modify" type="primary">确定</a-button>
                </a-space>
            </div>
        </div>
    </div>
    <PopupMenu
        v-if="isReplaceCover"
        :title="replaceCoverTitle"
        determine="确定"
        @toModify="cancelReplace"
        @toDetermine="saveImgData"
        bodyStyle="max-height: 400px;padding: 0;overflow: hidden;"
    >
        <img :src="imgUrl" ref="coverImg" />
    </PopupMenu>
    <div v-if="isSetTemplate" id="modify-box">
        <div class="box card-detail">
            <div class="box-header">
                <div class="header-title">设置模板</div>
                <div class="header-close" @click="saveTemplateData">
                    <icon-close />
                </div>
            </div>
            <div class="box-body detail-body">
                <div class="detail-left">
                    <ul class="left" style="border-right:1px dotted #ccc;">
                        <strong @click="addTemplateData">
                            添加模板
                            <icon-plus />
                        </strong>
                        <li
                            v-for="(item, index) in templateData.value"
                            :key="item.title"
                            :class="item.checked ? 'li-checked' : ''"
                            @click="checkTemplateData(item.title)"
                        >
                            <div>{{ item.title }}</div>
                            <button @click.stop="deleteTemplateData(item.title, index)" title="删除">
                                <icon-delete />
                            </button>
                        </li>
                    </ul>
                </div>
                <div class="detail-right" style="border: none;">
                    <a-form :model="form.template" style="margin-top: 20px;">
                        <a-form-item field="模板名" label="模板名">
                            <a-input v-model.trim="form.template.title" placeholder="自定义模板名" />
                        </a-form-item>
                        <a-form-item field="字符键" label="字符键">
                            <a-input
                                v-model.trim="form.template.stringKey"
                                placeholder="键名按顺序以'/'号隔开"
                            />
                        </a-form-item>
                        <a-form-item field="数字键" label="数字键">
                            <a-input
                                v-model.trim="form.template.numberKey"
                                placeholder="键名按顺序以'/'号隔开"
                            />
                        </a-form-item>
                    </a-form>
                </div>
            </div>
            <div class="box-footer">
                <a-space size="large">
                    <a-button
                        @click="saveTemplateData"
                        :disabled="form.template.title.length === 0"
                        type="primary"
                    >保存</a-button>
                </a-space>
            </div>
        </div>
    </div>
    <div class="cards">
        <div @click="choiceEdit('', true)" class="card add-card" title="添加关键词组">
            <img :src="addKeyWord" />
        </div>
        <div
            v-for="item in theKeyWord.data"
            :key="item.kid"
            @click="choiceCard(item.kid)"
            class="card"
        >
            <icon-edit
                @click.stop="choiceEdit(item.kid)"
                class="card-edit"
                :style="{ fontSize: '30px' }"
            />
            <icon-close-circle
                @click.stop="choiceDetele(item.kGroupName, item.kid)"
                class="card-delete"
                :style="{ fontSize: '32px' }"
            />
            <img :src="item.cardImg === '' ? defaultImg : item.cardImg" class="card__image" />
            <div class="card__overlay">
                <div class="card__header">
                    <svg class="card__arc" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 40 80 c 22 0 40 -22 40 -40 v 40 Z" fill="#fff" />
                    </svg>
                    <h3 class="card__title">{{ item.kGroupName }}</h3>
                </div>
                <p class="card__description">{{ item.kGroupDesc }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue';
import {
    IconClose, IconEdit, IconCloseCircle, IconPlus,
    IconDelete, IconPen, IconCaretRight, IconReply, IconFire
} from '@arco-design/web-vue/es/icon';
import PopupMenu from './widget/PopupMenu.vue';
import { useRoute } from 'vue-router';
import { db } from '../db/db';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import * as echarts from 'echarts';
import useCurrentInstance from '../utils/useCurrentInstance';
import { v4 } from 'uuid';
import defaultImg from '../../public/static/img/default.png';
import templateicon from '../assets/svg/templateicon.svg';
import addKeyWord from '../assets/svg/addKeyWord.svg';

const { proxy } = useCurrentInstance();
const route = useRoute();
const query_id = parseInt(<string>route.query.id);
const $modal = proxy.$modal;
const $message = proxy.$message;
interface AssociatedOption {
    kid: string,
    value: string,
    label: string,
    children: Array<AssociatedChildren>
};
interface AssociatedChildren {
    iid: string,
    value: string,
    label: string
};

interface ListName {
    kid?: string;
    iid?: string;
    itemName?: string;
};

loadKeyWodData();

// 表单数据
const form = reactive({
    keyword: {
        title: '',
        desc: '',
        cardImg: ''
    },
    template: {
        title: '',
        stringKey: '',
        numberKey: ''
    }
});

// 关键词组编辑
let isNew = false, curKid = '', curIid = '';
const choiceEdit = (id?: string, isnew?: boolean) => {
    isnew = isnew || false;
    isNew = isnew;
    curKid = id || '';
    if (isnew) {
        form.keyword = {
            title: '',
            desc: '',
            cardImg: ''
        };
        isCardEdit.value = true;
    } else {
        const tempData = theKeyWord.data.filter(item => {
            return item.kid === id;
        })[0];
        form.keyword.title = tempData.kGroupName;
        form.keyword.desc = tempData.kGroupDesc;
        form.keyword.cardImg = tempData.cardImg;
        isCardEdit.value = true;
    }

}
// 更换封面图片
const isReplaceCover = ref(false), imgUrl = ref(),
    coverImg = ref(), fileInput = ref(),
    replaceCoverTitle = ref('');
const replaceCover = (type: number) => {
    replaceType = type;
    if (type === 1) {
        replaceCoverTitle.value = '更换封面(5:7)';
    } else if (type === 2) {
        replaceCoverTitle.value = '更换头图(1:1)';
    }
    fileInput.value.click();
}
let cropper: Cropper;
const _replaceCover = (ratio: number) => {
    if (fileInput.value.value !== '') {
        isReplaceCover.value = true;
        //使用 FileReader() 构造器获得图片的base64
        const reader = new FileReader();
        reader.readAsDataURL(fileInput.value.files[0]);
        reader.onload = function (evt) {
            imgUrl.value = evt.target!.result;
            // 等待目标图片加载完成调用cropper按要求裁剪封面
            coverImg.value.onload = function () {
                cropper = new Cropper(coverImg.value, {
                    aspectRatio: ratio,
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
// 取消更换封面
const cancelReplace = () => {
    isReplaceCover.value = false;
    // 清空表单值避免在连续选择同一张图时onchange不触发
    fileInput.value.value = '';
    // 避免连续选择同一张图时图片onload事件不触发
    imgUrl.value = '';
}

let base64Img: string, replaceType: number;
const saveImgData = () => {
    cancelReplace();
    // 拿到裁剪后的图片
    base64Img = cropper.getCroppedCanvas({
        imageSmoothingQuality: 'high'
    }).toDataURL('image/jpeg'); // 设置图片格式
    if (replaceType === 1) {
        // 5/7的关键组封面
        form.keyword.cardImg = base64Img;
    } else if (replaceType === 2) {
        // 1/1的关键字头图
        currentListData.data.itemImg = base64Img;
        modifyDbforItem(curKid, curIid,
            (it: KeyWord) => {
                it.itemImg = base64Img;
            },
            () => {
                loadKeyWodData();
            })
    }
}

// 确认新建/修改关键词组
const confirmKeywordGroup = () => {
    let flag = true;
    for (let i = 0; i < theKeyWord.data.length; i++) {
        // 排除选择元素后再查看是否有重名
        if (theKeyWord.data[i].kGroupName === form.keyword.title && theKeyWord.data[i].kid !== curKid) {
            $message.warning('关键组名称重复!');
            flag = false;
            break;
        }
    }
    if (flag) {
        // 是否是新增？
        if (isNew) {
            //新添加关键组
            let path: string;
            db.opus
                .where(':id')
                .equals(query_id)
                .modify(item => {
                    const kid = v4();
                    item.theKeyWord.push(
                        {
                            kid: kid,
                            kGroupName: form.keyword.title,
                            kGroupDesc: form.keyword.desc,
                            cardImg: form.keyword.cardImg,
                            data: [],
                            template: []
                        }
                    );
                    // 获得保存图片的路径
                    path = 'workspace/opus/' + item.id + '/keyword/' + kid;
                })
                .then(() => {
                    window.$API.ipcSend('saveBase64-toImg', { b64: form.keyword.cardImg, path: path, fname: 'kcover.jpeg' });
                    window.$API.ipcOnce('saveBase64-toImg-successful', () => {
                        $message.success('设置成功!');
                        loadKeyWodData();
                        isCardEdit.value = false;
                    })
                })
        } else {
            //修改原有关键组
            let path: string;
            db.opus
                .where(':id')
                .equals(query_id)
                .modify(item => {
                    item.theKeyWord.forEach(it => {
                        if (curKid === it.kid) {
                            it.kGroupName = form.keyword.title;
                            it.kGroupDesc = form.keyword.desc;
                            it.cardImg = form.keyword.cardImg;
                        }
                    });
                    // 获得保存图片的路径
                    path = 'workspace/opus/' + item.id + '/keyword/' + curKid;
                }).then(() => {
                    window.$API.ipcSend('saveBase64-toImg', { b64: form.keyword.cardImg, path: path, fname: 'kcover.jpeg' });
                    window.$API.ipcOnce('saveBase64-toImg-successful', () => {
                        $message.success('设置成功!');
                        loadKeyWodData();
                        isCardEdit.value = false;
                    })
                })
        }
    }
}
//删除关键组
const choiceDetele = (name: string, kid: string) => {
    $modal.warning({
        title: "删除关键组",
        content: `是否删除所选关键组【${name}】? 该操作不可逆!`,
        simple: true,
        onOk: () => {
            db.opus
                .where(':id')
                .equals(query_id)
                .modify(item => {
                    item.theKeyWord.forEach((it, i) => {
                        if (it.kid === kid) {
                            item.theKeyWord.splice(i, 1);
                        }
                    })
                })
                .then(() => {
                    loadKeyWodData();
                })
        }
    })
}

// 每个卡片的数据
const isCardContent = ref(false), isCardEdit = ref(false), checkedItem = ref('');
// 左边列表数据+顶部组名
const currentListName: { data: Array<ListName> } = reactive({ data: [] }),
    currentGroupName = ref('');
// 模板数据
const templateData: { value: Array<Template> } = reactive({ value: [] });
let itemValueObj: Array<{ [key: string]: Array<number> }> = [];
const choiceCard = (id: string, targetIid?: string) => {
    tempKid.value = curKid = id;
    itemValueObj = [];
    const tempArr = theKeyWord.data.filter(item => {
        return item.kid === id;
    })[0];
    templateData.value = tempArr.template;    // 提取当前的模板数据
    if (templateData.value.length == 0) {
        form.template = {
            title: '',
            stringKey: '',
            numberKey: ''
        }
    } else {
        templateData.value.forEach(item => {
            if (item.checked) {
                form.template = item;
            }
        })
    }
    // 获取左侧列表值
    currentGroupName.value = tempArr.kGroupName;
    maxValueObj = {}; // 清空
    currentListName.data = tempArr.data.map(item => {
        // 筛选出该组内同单位下的value值数组
        const tempItemArr: { [key: string]: Array<number> } = {};
        item.itemNumber.forEach(it => {
            if (!maxValueObj[it.unit]) maxValueObj[it.unit] = [];
            maxValueObj[it.unit].push(it.value);
            if (!tempItemArr[it.unit]) tempItemArr[it.unit] = [];
            tempItemArr[it.unit].push(it.value);
        })
        itemValueObj.push(tempItemArr);
        // 返回左侧列表所需内容
        return {
            kid: id,
            iid: item.iid,
            itemName: item.itemName
        }
    });
    checkedItem.value = currentListName.data[0] ? <string>currentListName.data[0].iid : '';
    targetIid = targetIid || checkedItem.value;
    isCardContent.value = true;
    // 选择选项
    currentListName.data.length !== 0 ? choiceCardItem(id, targetIid) : currentListData.data = [];
}
// 点击具体关键字项
const currentListData: { data: any } = reactive({ data: [] });
const itemNameFormat = ref(''); // 所有名称字符串
const currentAssociated: { data: Array<{ iid: string, key: string, kid: string, value: number }> } = reactive({ data: [] });
const choiceCardItem = (kid: string, iid: string) => {
    curIid = iid;
    isAssociated.value = false; // 收回关联项添加框
    const tempData = theKeyWord.data.filter(item => {
        return item.kid === kid;
    })[0].data.filter(item => {
        return item.iid === iid;
    })[0];
    currentListData.data = deepClone_JSON(tempData);
    checkedItem.value = iid;
    itemNameFormat.value = currentListData.data.itemName + '/' + currentListData.data.otherName.join('/');
    // 关联标签排序
    const tempArr: Array<Array<Associated>> = [[], [], [], [], []];
    currentListData.data.associated.forEach((item: { iid: string, key: string, kid: string, value: number }) => {
        tempArr[5 - item.value].push(item);
    })
    currentAssociated.data = [].concat.apply([], <never>tempArr); // 数组降维
    // 点击卡片进入绘制雷达图
    if (showType_right.value === '数值项可视化') {
        showChart(showType_right.value);
    }
    // 关联项目列表去除当前元素和已经关联的元素
    getAssociatedOptions();
    // 去除当前元素
    for (let i in associatedOptions.value) {
        if (associatedOptions.value[i].kid === curKid) {
            for (let j in associatedOptions.value[i].children) {
                //去除当前元素
                if (associatedOptions.value[i].children[j].iid === curIid) {
                    associatedOptions.value[i].children.splice(parseInt(j), 1);
                    break;
                }
            }
            break;
        }
    }
    // 去除已经关联的元素
    associatedOptions.value.forEach(item => {
        item.children.forEach((it, i) => {
            currentAssociated.data.forEach(associated => {
                if (associated.iid === it.iid) {
                    item.children.splice(i, 1);
                }
            })
        })
    })
}
watch(itemNameFormat, value => {
    const tempArr = value.split('/');
    currentListData.data.itemName = tempArr[0];
    currentListData.data.otherName = tempArr.slice(1);
})
// 修改关键词item名和item描述
const modifyItemName = ref(false), modifyItemDesc = ref(false);
const modifyItem = (type: string, value: boolean) => {
    switch (type) {
        case 'itemName':
            modifyAllItem();
            modifyItemName.value = value;
            break;
        case 'itemDesc':
            modifyAllItem();
            modifyItemDesc.value = value;
            break;
    }
}
const modifyAllItem = () => {
    modifyItemName.value = modifyItemDesc.value = false;
}
// 修改数据库中item的名称
watch(modifyItemName, value => {
    if (!value) {
        // 避免名称重复
        let flag = true;
        currentListName.data.forEach((item) => {
            if (item.itemName === currentListData.data.itemName && checkedItem.value !== item.iid) flag = false;
        })
        if (flag) {
            modifyDbforItem(curKid, curIid,
                (it: KeyWord) => {
                    it.itemName = currentListData.data.itemName;
                    const tempArr: Array<string> = [];
                    currentListData.data.otherName.forEach((oName: string) => {
                        tempArr.push(oName);
                    })
                    it.otherName = tempArr;
                },
                () => {
                    loadKeyWodData(() => {
                        choiceCard(curKid, curIid);
                    })
                })
        } else {
            $message.warning('主名称不能相同')
        }
    }
});
// 修改数据库中item的描述
watch(modifyItemDesc, value => {
    if (!value) {
        modifyDbforItem(curKid, curIid,
            (it: KeyWord) => {
                it.itemDesc = currentListData.data.itemDesc;
            },
            () => {
                loadKeyWodData();
            })
    }
});

// 打开模板编辑器
const isSetTemplate = ref(false);
const setTemplate = () => {
    isSetTemplate.value = true;
    loadKeyWodData(() => {
        choiceCard(curKid, curIid);
        templateData.value.forEach(item => {
            if (item.checked) {
                form.template = item;
            }
        })
    })
}
// 添加模板项目
const addTemplateData = () => {
    db.opus
        .where(':id')
        .equals(query_id)
        .modify(item => {
            for (let i in item.theKeyWord) {
                if (item.theKeyWord[i].kid === curKid) {
                    if (!item.theKeyWord[i].template) item.theKeyWord[i].template = [];
                    item.theKeyWord[i].maxTempLen = (item.theKeyWord[i].maxTempLen || 0) + 1;
                    item.theKeyWord[i].template.forEach(item => {
                        item.checked = false;
                    })
                    item.theKeyWord[i].template.push({
                        title: '模板--' + item.theKeyWord[i].maxTempLen,
                        stringKey: '',
                        numberKey: '',
                        checked: true
                    });
                    break;
                }
            }

        })
        .then(() => {
            loadKeyWodData(() => {
                choiceCard(curKid, curIid);
                templateData.value.forEach(item => {
                    if (item.checked) {
                        form.template = item;
                    }
                })
            })
        })
}
// 删除模板项目
const deleteTemplateData = (name: string, index: number) => {
    $modal.warning({
        title: "删除模板",
        content: `是否删除所选模板【${name}】? 该操作不可逆!`,
        simple: true,
        onOk: () => {
            db.opus
                .where(':id')
                .equals(query_id)
                .modify(item => {
                    for (let i in item.theKeyWord) {
                        if (item.theKeyWord[i].kid === curKid) {
                            item.theKeyWord[i].template.splice(index, 1);
                            break;
                        }
                    }
                })
                .then(() => {
                    loadKeyWodData(() => {
                        choiceCard(curKid, curIid);
                        // 删除的目标是选中的目标
                        let temp = true;
                        templateData.value.forEach(item => {
                            if (item.checked) temp = false;
                        })
                        if (temp) {
                            form.template = {
                                title: '',
                                stringKey: '',
                                numberKey: ''
                            }
                        }
                    })
                })
        }
    })
}
// 点击选择模板
const checkTemplateData = (name: string) => {
    db.opus
        .where(':id')
        .equals(query_id)
        .modify(item => {
            for (let i in item.theKeyWord) {
                if (item.theKeyWord[i].kid === curKid) {
                    item.theKeyWord[i].template.forEach(it => {
                        if (it.title === name) {
                            it.checked = true;
                        } else {
                            it.checked = false;
                        }
                    })
                    break;
                }
            }
        })
        .then(() => {
            loadKeyWodData(() => {
                choiceCard(curKid, curIid);
                templateData.value.forEach(item => {
                    if (item.title === name) {
                        form.template = item;
                        item.checked = true;
                    } else {
                        item.checked = false;
                    }
                })
            })
        })
}
// 保存选中模板
const saveTemplateData = () => {
    let flag = false;
    templateData.value.forEach(item => {
        if (item.title === form.template.title && !item.checked) {
            $message.warning('模板名不能重复!');
        } else {
            flag = true;
        }
    })
    if (form.template.title.length === 0) flag = false;
    if (flag) {
        db.opus
            .where(':id')
            .equals(query_id)
            .modify(item => {
                for (let i in item.theKeyWord) {
                    if (item.theKeyWord[i].kid === curKid) {
                        item.theKeyWord[i].template.forEach(it => {
                            if (it.checked) {
                                it.title = form.template.title;
                                // 去重
                                it.stringKey = [...new Set(form.template.stringKey.split('/'))].join('/');
                                it.numberKey = [...new Set(form.template.numberKey.split('/'))].join('/');
                            }
                        })
                    }
                }
            }).then(() => {
                isSetTemplate.value = false;
                loadKeyWodData(() => {
                    choiceCard(curKid, curIid);
                })
            })
    } else {
        isSetTemplate.value = false;
        loadKeyWodData(() => {
            choiceCard(curKid, curIid);
        })
    }
}

// 删除左侧关键字
const deleteItem = (name: string, kid: string, iid: string) => {
    $modal.warning({
        title: "删除关键组",
        content: `是否删除所选关键字"${name}"? 该操作不可逆!`,
        simple: true,
        onOk: () => {
            db.opus
                .where(':id')
                .equals(query_id)
                .modify(item => {
                    for (let index in item.theKeyWord) {
                        if (item.theKeyWord[index].kid === kid) {
                            for (let i in item.theKeyWord[index].data) {
                                if (item.theKeyWord[index].data[i].iid === iid) {
                                    item.theKeyWord[index].data.splice(parseInt(i), 1);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                })
                .then(() => {
                    loadKeyWodData(() => {
                        curIid === iid ? choiceCard(curKid) : choiceCard(curKid, curIid);
                    });
                })
        }
    })
}
// 添加左侧新关键词
const addNewKeyWord = () => {
    // 载入模板
    let targetItemString: KeyWord['itemString'], targetItemNumber: KeyWord['itemNumber'];
    if (form.template.title === '') {
        targetItemNumber = targetItemString = [];
    } else {
        targetItemString = form.template.stringKey.split('/').map(item => {
            return {
                key: item,
                value: ''
            }
        })
        targetItemNumber = form.template.numberKey.split('/').map(item => {
            return {
                key: item,
                value: 0,
                unit: ''
            }
        })
        if (targetItemString[0].key === '') targetItemString = [];
        if (targetItemNumber[0].key === '') targetItemNumber = [];
    }
    db.opus
        .where(':id')
        .equals(query_id)
        .modify(item => {
            item.theKeyWord.forEach(item => {
                if (item.kid === curKid) {
                    item.maxNamLen = (item.maxNamLen || 0) + 1;
                    item.data.push({
                        iid: v4(),
                        itemImg: '/static/img/default.png',
                        itemName: '主名' + item.maxNamLen,
                        otherName: ['别名', '别名'],
                        itemDesc: '点击左侧修改介绍',
                        associated: [],
                        itemString: targetItemString,
                        itemNumber: targetItemNumber
                    });
                }
            })
        })
        .then(() => {
            loadKeyWodData(() => {
                // 是否是从0开始新建
                if (currentListName.data.length === 0) {
                    choiceCard(curKid);
                } else {
                    choiceCard(curKid, curIid);
                }
            })
        })
}

// 添加新关联项
const isAssociated = ref(false);
const associatedOptions: { value: Array<AssociatedOption> } = reactive({ value: [] });
// 选择关联项时触发
let associatedValue = '', associatedIntensity = 1,
    associatedKid = '', associatedIid = '';
const isallowAddAssociated = ref(false);
const getCascaderValue = (value: Array<string>) => {
    isallowAddAssociated.value = true;
    associatedValue = value.join('🞂');
    for (let index in associatedOptions.value) {
        if (associatedOptions.value[index].value === value[0]) {
            associatedKid = associatedOptions.value[index].kid;
            for (let i in associatedOptions.value[index].children) {
                if (associatedOptions.value[index].children[i].value === value[1]) {
                    associatedIid = associatedOptions.value[index].children[i].iid;
                    break;
                }
            }
            break;
        }
    }
}
const getCascaderIntensity = (intensity: number) => {
    associatedIntensity = intensity;
}
const addNewAssociated = () => {
    isallowAddAssociated.value = false;
    modifyDbforItem(curKid, curIid,
        (it: KeyWord) => {
            it.associated.push({
                key: associatedValue,
                value: associatedIntensity,
                kid: associatedKid,
                iid: associatedIid
            })
        },
        () => {
            modifyDbforItem(associatedKid, associatedIid, (it: KeyWord) => {
                it.associated.push({
                    key: currentGroupName.value + '🞂' + currentListData.data.itemName,
                    value: associatedIntensity,
                    kid: curKid,
                    iid: curIid
                })
            }, () => {
                loadKeyWodData(() => {
                    choiceCard(curKid, curIid);
                });
            })
        })
    isAssociated.value = false;
}
// 获得5种强度对应的颜色值
const getIntensityColor = (intensity: number) => {
    switch (intensity) {
        case 1:
            return '#eba4d5';
        case 2:
            return '#eb8ccd';
        case 3:
            return '#eb6cc3';
        case 4:
            return '#eb42b6';
        case 5:
            return '#eb0aa4';
    }
}
// 点击删除关联项
const deleteTag = (associatedItem: { iid: string, key: string, kid: string, value: number }) => {
    $modal.warning({
        title: "删除关联项",
        content: `是否删除所选关联项"${associatedItem.key}"? 该操作不可逆!`,
        simple: true,
        onOk: () => {
            let tempKid: string, tempIid: string;
            modifyDbforItem(curKid, curIid,
                (it: KeyWord) => {
                    it.associated.forEach((item, i) => {
                        if (item.iid === associatedItem.iid) {
                            tempKid = item.kid;
                            tempIid = item.iid;
                            it.associated.splice(i, 1);
                        }
                    })
                },
                () => {
                    modifyDbforItem(tempKid, tempIid, (it: KeyWord) => {
                        it.associated.forEach((item, i) => {
                            if (item.iid === curIid) {
                                it.associated.splice(i, 1);
                            }
                        })
                    }, () => {
                        loadKeyWodData(() => {
                            choiceCard(curKid, curIid);
                        })
                    })

                })
        }
    })
}
// 添加自定义项目（字符/数值项目）
const custString = ref(false), custNumber = ref(false);
const form_custString = reactive({
    data: {
        key: '',
        value: ''
    }
}), form_custNumber = reactive({
    data: {
        key: '',
        value: 0,
        unit: ''
    }
})
const addCustomizeItem = (type: number) => {
    if (type === 1) {
        // 自定义字符项目
        custString.value = !custString.value;
        custNumber.value = false;
        isModifyCustomize.value = false;
    } else if (type === 2) {
        // 自定义数值项目
        custString.value = false;
        custNumber.value = !custNumber.value;
        isModifyCustomize.value = false;
    }
}
// 确认添加自定义项
const confirmAdd = (type: number) => {
    if (isModifyCustomize.value) {
        // 修改模式
        if (type == 1) {
            let flag = true;
            modifyDbforItem(curKid, curIid,
                (it: KeyWord) => {
                    for (let i in it.itemString) {
                        if (it.itemString[i].key === form_custString.data.key) {
                            flag = parseInt(i) == customizeIndex ? true : false;
                            break;
                        }
                    }
                    if (flag) {
                        it.itemString[customizeIndex].key = form_custString.data.key;
                        it.itemString[customizeIndex].value = form_custString.data.value;
                    } else {
                        $message.warning('名称不能重复!');
                    }
                },
                () => {
                    if (flag) {
                        loadKeyWodData(() => {
                            choiceCard(curKid, curIid);
                            custString.value = custNumber.value = false;
                        });
                    }
                });
        } else if (type === 2) {
            let flag = true;
            modifyDbforItem(curKid, curIid,
                (it: KeyWord) => {
                    for (let i in it.itemNumber) {
                        if (it.itemNumber[i].key === form_custNumber.data.key) {
                            flag = parseInt(i) == customizeIndex ? true : false;
                            break;
                        }
                    }
                    if (flag) {
                        it.itemNumber[customizeIndex].key = form_custNumber.data.key;
                        it.itemNumber[customizeIndex].value = form_custNumber.data.value;
                        it.itemNumber[customizeIndex].unit = form_custNumber.data.unit;
                    } else {
                        $message.warning('名称不能重复!');
                    }
                },
                () => {
                    if (flag) {
                        loadKeyWodData(() => {
                            choiceCard(curKid, curIid);
                            custString.value = custNumber.value = false;
                        });
                    }
                });
        }
    } else {
        // 添加模式
        if (type === 1) {
            // 自定义字符项目
            let flag = true;
            modifyDbforItem(curKid, curIid,
                (it: KeyWord) => {
                    for (let i in it.itemString) {
                        if (it.itemString[i].key === form_custString.data.key) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        it.itemString.push({
                            key: form_custString.data.key,
                            value: form_custString.data.value
                        });
                    } else {
                        $message.warning('名称不能重复!');
                    }
                },
                () => {
                    if (flag) {
                        loadKeyWodData(() => {
                            choiceCard(curKid, curIid);
                            custString.value = custNumber.value = false;
                        });
                    }
                });
        } else if (type === 2) {
            // 自定义数值项目
            let flag = true;
            modifyDbforItem(curKid, curIid,
                (it: KeyWord) => {
                    for (let i in it.itemNumber) {
                        if (it.itemNumber[i].key === form_custNumber.data.key) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        let tempNum;
                        if (form_custNumber.data.value === Infinity) {
                            tempNum = '+Infinity';
                        } else if (form_custNumber.data.value === -Infinity) {
                            tempNum = '-Infinity';
                        } else {
                            tempNum = form_custNumber.data.value;
                        }
                        it.itemNumber.push({
                            key: form_custNumber.data.key,
                            value: <number>tempNum,
                            unit: form_custNumber.data.unit
                        });
                    } else {
                        $message.warning('名称不能重复!');
                    }
                },
                () => {
                    if (flag) {
                        loadKeyWodData(() => {
                            choiceCard(curKid, curIid);
                            custString.value = custNumber.value = false;
                        });
                    }
                });
        }
    }
}
// 修改自定义项
const isModifyCustomize = ref(false);
let customizeIndex: number; // 要修改的目标索引
const modifyCustomizeItem = (type: number, itemData: { key: string, value: string | number, unit?: string }, index: number) => {
    if (type === 1) {
        customizeIndex = index;
        form_custString.data.key = itemData.key;
        form_custString.data.value = itemData.value as string;
        // 唤出字符面板并调为修改模式
        custString.value = isModifyCustomize.value = true;
        custNumber.value = false;
    } else if (type === 2) {
        customizeIndex = index;
        form_custNumber.data.key = itemData.key;
        form_custNumber.data.value = itemData.value as number;
        form_custNumber.data.unit = itemData.unit as string;
        // 唤出数字面板并调为修改模式
        custNumber.value = isModifyCustomize.value = true;
        custString.value = false;
    }
}
// 删除自定义项
const deleteCustomizeItem = (type: number, t_key: string) => {
    if (type === 1) {
        $modal.warning({
            title: "删除自定义字符项",
            content: `是否删除所选字符项"${t_key}"? 该操作不可逆!`,
            simple: true,
            onOk: () => {
                modifyDbforItem(curKid, curIid,
                    (it: KeyWord) => {
                        it.itemString.forEach((item, i) => {
                            if (item.key === t_key) {
                                it.itemString.splice(i, 1);
                            }
                        });
                    },
                    () => {
                        loadKeyWodData(() => {
                            choiceCard(curKid, curIid);
                        })
                    }
                );
            }
        })
    } else if (type === 2) {
        $modal.warning({
            title: "删除自定义数字项",
            content: `是否删除所选数字项"${t_key}"? 该操作不可逆!`,
            simple: true,
            onOk: () => {
                modifyDbforItem(curKid, curIid,
                    (it: KeyWord) => {
                        it.itemNumber.forEach((item, i) => {
                            if (item.key === t_key) {
                                it.itemNumber.splice(i, 1);
                            }
                        });
                    },
                    () => {
                        loadKeyWodData(() => {
                            choiceCard(curKid, curIid);
                        })
                    }
                );
            }
        })
    }
}

const modify = () => {
    isCardContent.value = false;
    isCardEdit.value = false;
    isAssociated.value = false;
}

// 选择显示 字符项 数值项  数值项可视化
const showType_right = ref('字符项'),
    targetChartObj:
        { data: { [key: string]: Array<{ key: string, value: number }> } } = reactive({ data: {} }),
    rightListData:
        { value: Array<string> } = reactive({ value: [] }),
    nowUnit = ref(''), maxValue = ref(0);
let maxValueObj: { [key: string]: Array<number> } = {};
const tempKid = ref('');
const manualModify: { [key: string]: boolean } = {};
const showChart = (value: string) => {
    if (value === '数值项可视化') {
        // 将自定义数值项通过‘单位’来进行分组
        targetChartObj.data = {};
        currentListData.data.itemNumber.forEach((item: { key: string, unit: string, value: number }) => {
            if (Object.prototype.hasOwnProperty.call(targetChartObj.data, item.unit)) {
                targetChartObj.data[item.unit].push({
                    key: item.key,
                    value: item.value
                })
            } else {
                targetChartObj.data[item.unit] = [];
                targetChartObj.data[item.unit].push({
                    key: item.key,
                    value: item.value
                })
            }
        })
        rightListData.value = Object.keys(targetChartObj.data);// 获得所有key
        // 目标关键字不存在当前的单位时
        if (rightListData.value.indexOf(nowUnit.value) === -1) {
            nowUnit.value = rightListData.value[0]; // 选择当前的单位组
            maxValue.value = Math.max(...(maxValueObj[nowUnit.value] || [1]));
        }
        // 切换组的情况下,另一组不存在前一组的单位时,将max置为1
        if (!manualModify[nowUnit.value]) maxValue.value = Math.max(...(maxValueObj[nowUnit.value] || [1]));
        nextTick(() => {
            // 传递默认项
            if (targetChartObj.data[nowUnit.value]) {
                // 有数据就绘图
                setNumberChart(targetChartObj.data[nowUnit.value], nowUnit.value, maxValue.value);
            } else {
                // 无数据清除图
                if (echarts.getInstanceByDom(numberChart.value)) echarts.getInstanceByDom(numberChart.value)!.dispose();
            }
        })
    }
}
// 右侧选择单位分组
const checkChartItem = (unit: string) => {
    if (!(unit === nowUnit.value)) {
        nowUnit.value = unit;
        maxValue.value = Math.max(...maxValueObj[unit]);
        setNumberChart(targetChartObj.data[unit], unit, maxValue.value);
    }
}
// 调整雷达图最大值
const inputMaxValue = (value: number) => {
    manualModify[nowUnit.value] = true;
    maxValue.value = value;
    setNumberChart(targetChartObj.data[nowUnit.value], nowUnit.value, maxValue.value);
}
// 监视Kid是否改变,判断是否有更换组的操作
watch(tempKid, () => {
    // 切换组就重置maxValue
    maxValue.value = Math.max(...(maxValueObj[nowUnit.value] || [1]));
})

// 获取的全部数据
const theKeyWord: { data: Array<KeyWordGroup> } = reactive({ data: [] })
function loadKeyWodData(cb?: Function) {
    if (route.query.category === 'opus') {
        db.opus.get(query_id)
            .then(value => {
                theKeyWord.data = value!.theKeyWord;
                getAssociatedOptions();
                if (typeof cb === 'function') cb();
            })
    }
}

function getAssociatedOptions() {
    // 获得关联项目数据
    associatedOptions.value = [];
    theKeyWord.data.forEach(item => {
        if (item.data.length !== 0) {
            const tempArr: Array<AssociatedChildren> = [];
            item.data.forEach(it => {
                tempArr.push({
                    iid: it.iid,
                    value: it.itemName,
                    label: it.itemName
                })
            });
            associatedOptions.value.push({
                kid: item.kid,
                value: item.kGroupName,
                label: item.kGroupName,
                children: tempArr
            })
        }
    })
}

// 修改特定组下特定关键字的数据
function modifyDbforItem(t_kid: string, t_iid: string, hd: Function, cb: Function) {
    db.opus
        .where(':id')
        .equals(query_id)
        .modify(item => {
            item.theKeyWord.forEach(item => {
                if (item.kid === t_kid) {
                    item.data.forEach(it => {
                        if (it.iid === t_iid) {
                            hd(it);
                        }
                    })
                }
            })
        })
        .then(() => {
            cb();
        })
}

//  无法实现对象中方法的深拷贝
function deepClone_JSON(obj: object) {
    let _obj = JSON.stringify(obj);
    return JSON.parse(_obj);
}

//准备echarts的容器
const numberChart = ref();
function setNumberChart(targetData: Array<{ key: string, value: number }>, unit: string, curMax: number) {
    let n_chart = echarts.getInstanceByDom(numberChart.value);
    if (n_chart == null) {
        n_chart = echarts.init(numberChart.value);
    }
    const indicatorData: Array<{ name: string, max: number }> = [],
        data_value: Array<number> = [];
    targetData.forEach(item => {
        data_value.push(item.value);
        indicatorData.push({
            name: item.key,
            max: curMax
        })
    });
    // 获得目标单位的每个关键字的数字总量
    const itemTotal: Array<number> = [];
    itemValueObj.forEach(item => {
        if (item[unit] !== undefined) {
            let num = 0;
            item[unit].forEach(it => {
                num += it;
            })
            itemTotal.push(num);
        }
    })
    // 大——>小排序
    itemTotal.sort(function (a, b) { return b - a });
    n_chart.setOption({
        color: ['#ff9883'],
        tooltip: {
            trigger: 'axis'
        },
        radar: {
            indicator: indicatorData,
            axisName: {
                formatter: function (params: string) {
                    // 限制name的长度,多余部分用省略号代替
                    return params.length > 10 ? params.slice(1, 10) + '...' : params;
                },
                color: '#165dff'
            },
        },
        series: [
            {
                type: 'radar',
                tooltip: {
                    trigger: 'item',
                    formatter: function (params: any) {
                        let sum = 0
                        for (let i = 0; i < params.value.length; i++) {
                            sum = sum + params.value[i];
                        }
                        const ranking = itemTotal.indexOf(sum) + 1;
                        return '总量: ' + sum + '<br />' + '排名: ' + ranking + '/' + itemTotal.length;
                    },
                    textStyle: {
                        align: 'left'
                    }
                },
                data: [
                    {
                        value: data_value,
                        name: '数据可视化',
                        symbol: 'rect',
                        symbolSize: 4,
                        areaStyle: {
                            color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                                {
                                    color: 'rgba(255, 145, 124, 0.1)',
                                    offset: 0
                                },
                                {
                                    color: 'rgba(255, 145, 124, 0.9)',
                                    offset: 1
                                }
                            ])
                        },
                        emphasis: {
                            areaStyle: {
                                color: 'rgb(255, 145, 124)'
                            }
                        },
                        label: {
                            show: true,
                            color: '#666',
                            formatter: function (params: any) {
                                return params.value + unit;
                            }
                        }
                    }
                ]
            }
        ]
    });
}

</script>

<style lang="scss" src="../style/KeywordEditor.scss" scoped>
</style> 



