<!-- 地图编辑模块 -->
<template>
    <PopupMenu
        v-if="isMapEdit"
        :title="mapEditTitle"
        determine="确定"
        @toModify="modify"
        @toDetermine="confirmMap"
        :determineDisabled="mapEditDisabled"
    >
        <a-button @click="importMapImg" :status="buttonStatus" type="primary">
            <template #icon>
                <icon-plus v-if="!mapImgLoaded" />
                <icon-sync v-else />
            </template>
            {{ loadImgTitle }}
        </a-button>
        <a-form :model="form" style="margin-top: 20px;">
            <a-form-item field="地图名称" label="地图名称">
                <a-input
                    v-model.trim="form.title"
                    :max-length="15"
                    show-word-limit
                    placeholder="请填写地图名称..."
                />
            </a-form-item>
            <a-form-item field="描述" label="描述">
                <a-input
                    v-model.trim="form.desc"
                    :max-length="25"
                    show-word-limit
                    placeholder="请填写地图描述..."
                />
            </a-form-item>
        </a-form>
    </PopupMenu>
    <FloatBox
        v-if="showFloatBox"
        title="坐标面板"
        determine="添加"
        @toModify="modify"
        @toDetermine="panelDetermine"
        :determineDisabled="selectID === ''"
    >
        <a-space :size="10">
            <a-typography-text type="primary">相对坐标X: {{ anchorPos.coordScaleX.toFixed(5) }}</a-typography-text>
            <a-divider direction="vertical" />
            <a-typography-text type="primary">相对坐标Y: {{ anchorPos.coordScaleY.toFixed(5) }}</a-typography-text>
        </a-space>
        <a-cascader
            @change="selectLocation"
            :options="keyWordOption.data"
            allow-search
            placeholder="从关键词中选择地点"
            :style="{ width: '320px', marginTop: '20px' }"
        />
    </FloatBox>
    <div class="map-content">
        <div v-if="!showContainer" class="cards">
            <div @click="choiceEdit('', true)" class="card add-card" title="添加地图">
                <img :src="addKeyWord" />
            </div>
            <div
                v-for="item in theMaps.data"
                :key="item.id"
                @click="choiceCard(item.id)"
                class="card"
            >
                <icon-edit
                    @click.stop="choiceEdit(item.id)"
                    class="card-edit"
                    :style="{ fontSize: '30px' }"
                />
                <icon-close-circle
                    @click.stop="choiceDetele(item.mapName, item.id)"
                    class="card-delete"
                    :style="{ fontSize: '32px' }"
                />
                <img :src="fileToURL(item.mapImg)" class="card__image" style="object-fit:cover;" />
                <div class="card__overlay">
                    <div class="card__header">
                        <h2 class="card__title">{{ item.mapName }}</h2>
                    </div>
                    <p class="card__description">{{ item.mapDesc }}</p>
                </div>
            </div>
        </div>
        <div v-if="showContainer" class="top-bar">
            <div class="bar-inner">
                <div @click="closeMap" class="close" title="关闭地图">
                    <icon-close :style="{ fontSize: '20px', marginTop: '10px' }" :stroke-width="2" />
                </div>
            </div>
        </div>
        <MapEditor
            v-if="showContainer"
            @clickMap="clickMap"
            @sitecontrol="siteControl"
            :mapImg="mapImg"
            ref="mapeditor_ref"
        ></MapEditor>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { IconPlus, IconSync, IconEdit, IconClose } from '@arco-design/web-vue/es/icon';
import useCurrentInstance from '../utils/useCurrentInstance';
import { useRoute } from 'vue-router';
import { db } from '../db/db';
import { v4 } from 'uuid';
import MapEditor from './MapEditor.vue';
import PopupMenu from './widget/PopupMenu.vue';
import FloatBox from './widget/FloatBox.vue';
import addKeyWord from '../assets/svg/addKeyWord.svg';

const { proxy } = useCurrentInstance();
const route = useRoute();
const query_id = parseInt(<string>route.query.id);
const $modal = proxy.$modal;
const $message = proxy.$message;

const showContainer = ref(false);
const mapeditor_ref = ref();
loadMapsData();
loadKeyWordData();

// 地图模块增删改查
const isMapEdit = ref(false), mapEditTitle = ref('');
const form = reactive({
    title: '',
    desc: ''
})
// 新增/修改地图信息
const isNew = ref(false);
let curId = '';
const choiceEdit = (id?: string, isnew?: boolean) => {
    isnew = isnew || false;
    curId = id || '';
    isNew.value = isnew;
    isMapEdit.value = true;
    if (isnew) {
        mapEditTitle.value = '添加新地图';
    } else {
        mapEditTitle.value = '修改地图信息';
        theMaps.data.forEach(item => {
            if (item.id === id) [form.title, form.desc] = [item.mapName, item.mapDesc];
        })
    };
}
const mapEditDisabled = computed(() => {
    if (isNew.value) return !mapImgLoaded.value || !form.title || !form.desc;
    else return !form.title || !form.desc;

})
const loadImgTitle = computed(() => {
    if (isNew.value) return mapImgLoaded.value ? '重新选择' : '选择地图';
    else return mapImgLoaded.value ? '重新选择' : '更换地图';
})
const buttonStatus = computed(() => {
    if (isNew.value) return mapImgLoaded.value ? 'success' : 'normal';
    else return mapImgLoaded.value ? 'success' : 'danger';
})
// 导入地图图片 
let fileData: File | null = null; // 保存图片数据
const mapImgLoaded = ref(false);
const importMapImg = () => {
    if (isNew.value) {
        loadImg();
    } else {
        $modal.warning({
            title: "更换地图源",
            content: `更换地图后原坐标极有可能会混乱，是否继续?`,
            simple: true,
            onOk: () => {
                loadImg();
            }
        })
    }
    function loadImg() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = () => {
            if (input.files) {
                fileData = input.files![0];
                mapImgLoaded.value = true;
                $message.success('地图图片导入成功');
            }
        }
    }
}
// 确认导入
const confirmMap = () => {
    let flag = true;
    for (let i in theMaps.data) {
        if (theMaps.data[i].mapName === form.title && theMaps.data[i].id !== curId) {
            $message.warning('地图名称重复!');
            flag = false;
            break;
        }
    }
    if (flag) {
        // 是否是新增？
        if (isNew.value) {
            loadDB('地图导入成功', (item: Userdb) => {
                item.theMaps.push({
                    id: v4(),
                    mapName: form.title,
                    mapDesc: form.desc,
                    mapImg: fileData,
                    posInfor: []
                })
            })
        } else {
            loadDB('地图修改成功', (item: Userdb) => {
                item.theMaps.forEach(item => {
                    if (item.id === curId) {
                        item.mapName = form.title;
                        item.mapDesc = form.desc;
                        if (mapImgLoaded.value) item.mapImg = fileData;
                    }
                })
            })
        }
    }
    // 局部通用方法
    function loadDB(msg: string, cb: Function) {
        db.opus.where(':id').equals(query_id).modify(item => {
            cb(item);
        }).then(() => {
            isMapEdit.value = false;
            mapImgLoaded.value = false;
            fileData = null;
            $message.success(msg);
            loadMapsData();
        })
    }
}

// 点击卡片
const mapImg = ref('');
const curPosInfor: { data: Array<PosInfor> } = reactive({ data: [] });
const choiceCard = (id: string) => {
    curId = id; // 当前的地图的id
    showContainer.value = true;
    theMaps.data.forEach(item => {
        if (item.id === id) {
            mapImg.value = fileToURL(item.mapImg); // 渲染地图
            curPosInfor.data = item.posInfor; // 获得位置信息
        };
    })
    // 显示所有位置信息
    displayMapLocation();
}
// 删除地图
const choiceDetele = (name: string, id: string) => {
    $modal.warning({
        title: "删除地图",
        content: `是否删除所选地图【${name}】? 该操作不可逆!`,
        simple: true,
        onOk: () => {
            db.opus.where(':id').equals(query_id).modify(item => {
                item.theMaps.forEach((it, i) => {
                    if (it.id === id) item.theMaps.splice(i, 1);
                })
            }).then(() => {
                loadMapsData();
            })
        }
    })
}

// 关闭地图编辑页
const closeMap = () => {
    showContainer.value = false;
    showFloatBox.value = false
}
// 点击地图时获取坐标
const anchorPos = reactive({ coordScaleX: 0, coordScaleY: 0 });
const clickMap = (pos: { coordScaleX: number, coordScaleY: number }) => {
    anchorPos.coordScaleX = pos.coordScaleX;
    anchorPos.coordScaleY = pos.coordScaleY;
}

// 坐标控制
const showFloatBox = ref(false);
const siteControl = (type: 'add') => {
    console.log(type);
    if (type === 'add') {
        showFloatBox.value = true;
    }
}

// 从关键词中选择地点
const selectID = ref('');
const selectLocation = (id: string) => {
    selectID.value = id;
}
// 点击确认添加按钮
const panelDetermine = () => {
    let flag = true;
    // 查看坐标是否重复
    curPosInfor.data.forEach(item => {
        if (item.coordX === anchorPos.coordScaleX &&
            item.coordY === anchorPos.coordScaleY) {
            flag = false;
        }
    });
    if (flag) {
        theKeyWords.data.forEach(item => {
            if (item.kid === selectID.value) {
                loadDB((map: Maps) => {
                    map.posInfor.push({
                        kid: item.kid,
                        iid: '',
                        name: item.kGroupName,
                        desc: item.kGroupDesc,
                        coordX: anchorPos.coordScaleX,
                        coordY: anchorPos.coordScaleY,
                    });
                })
            } else {
                item.data.forEach(it => {
                    if (it.iid === selectID.value) {
                        loadDB((map: Maps) => {
                            map.posInfor.push({
                                kid: item.kid,
                                iid: it.iid,
                                name: it.itemName,
                                desc: it.itemDesc,
                                coordX: anchorPos.coordScaleX,
                                coordY: anchorPos.coordScaleY,
                            });
                        })
                    }
                })
            }
        })
    } else {
        $message.warning('与已有坐标位置重复!');
    }
    // 局部方法
    function loadDB(cb: Function) {
        db.opus.where(':id').equals(query_id).modify(value => {
            value.theMaps.forEach(map => {
                if (map.id === curId) cb(map);
            })
        }).then(() => {
            showFloatBox.value = false;
            selectID.value = '';
            loadMapsData();
            $message.success('添加地点成功！');
        })
    }
}

// 子组件渲染位置节点
function displayMapLocation() {
    mapeditor_ref.value.setMapLocation(curPosInfor.data);
}

const modify = () => {
    isMapEdit.value = false;
    mapImgLoaded.value = false;
    fileData = null;
    showFloatBox.value = false;
    selectID.value = '';
}

// 加载地图数据
const theMaps: { data: Array<Maps> } = reactive({ data: [] });
function loadMapsData(cb?: Function) {
    db.opus.get(query_id).then(value => {
        theMaps.data = value!.theMaps;
        if (typeof cb === 'function') cb();
    })
}
// 加载关键字数据
const theKeyWords: { data: Array<KeyWordGroup> } = reactive({ data: [] });
const keyWordOption: {
    data: Array<{
        value: string,
        label: string,
        children?: Array<{ value: string, label: string }>
    }>
} = reactive({ data: [] });
function loadKeyWordData(cb?: Function) {
    db.opus.get(query_id).then(value => {
        theKeyWords.data = value!.theKeyWord;
        keyWordOption.data = theKeyWords.data.map(item => {
            const children = item.data.map(it => {
                return {
                    value: it.iid,
                    label: it.itemName
                }
            })
            if (children.length == 0) {
                return {
                    value: item.kid,
                    label: item.kGroupName,
                }
            } else {
                return {
                    value: item.kid,
                    label: item.kGroupName,
                    children
                }
            }
        })
        if (typeof cb === 'function') cb();
    })
}
// 将file对象转换为指向文件的URL
function fileToURL(file: File | null): string {
    if (file === null) return '';
    else return window.URL.createObjectURL(file);
}

</script>

<style lang="scss" scoped>
.map-content {
    position: relative;
    width: 100%;
    height: calc(100vh - 85px);
    padding: 0;

    @include cards;

    .top-bar {
        position: absolute;
        z-index: 9;
        top: 0;
        left: 50%;
        width: 100px;
        height: 40px;
        transition: top 0.3s ease-in-out;
        overflow: hidden;
        .bar-inner {
            position: absolute;
            top: -20px;
            left: 0;
            width: 100px;
            height: 40px;
            transition: top 0.2s ease-in-out;
            .close {
                width: 40px;
                height: 40px;
                border-radius: 100%;
                background-color: var(--color-bg-popup);
                cursor: pointer;
                color: rgb(var(--primary-6));
                &:hover {
                    background-color: var(--color-fill-2);
                }
                &:active {
                    background-color: var(--color-bg-popup);
                }
            }
            &:hover {
                top: 0;
            }
        }
    }
}
</style>