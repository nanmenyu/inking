<!-- 地图内部模块 -->
<template>
    <div class="map-container" ref="container_ref">
        <img class="map" @click="clickTheImg" @load="imgLoaded" :src="props.mapImg" ref="img_ref" />
        <div class="anchor" v-show="showAnchor" ref="anchor_ref">
            <div class="dot"></div>
            <div class="pulse"></div>
        </div>
        <div
            v-for="item in locationData.data "
            :key="item.id"
            :style="`left:${item.coordX}px;top:${item.coordY}px`"
            class="place"
        >
            <a-popover :title="item.name">
                <svg
                    @focus="locationFocus(item.id, item.kid, 'focus')"
                    @blur="locationFocus(item.id, item.kid, 'blur')"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                >
                    <path
                        p-id="4283"
                        :fill="focusedKid === item.kid ? 'rgb(var(--primary-6))' : 'rgb(var(--my-secondary-6))'"
                    />
                </svg>
                <template #content>
                    <div style="max-width: 300px;">
                        <p>{{ item.desc }}sfdc反对sfdc反对大师傅广泛广泛和被告返还不规范sfdc反对大师傅广泛广泛和被告返还不规范大师傅广泛广泛和被告返还不规范</p>
                    </div>
                </template>
            </a-popover>
        </div>
    </div>
    <div class="log" ref="log_ref"></div>
</template>

<script setup lang='ts'>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useMainStore } from '../store';

const props = defineProps<{
    mapImg: string;
}>();
const emit = defineEmits(['clickMap']);
const mainStore = useMainStore();
const container_ref = ref(), canvas_ref = ref(), img_ref = ref(), log_ref = ref();
const anchor_ref = ref();
const posInfor: { data: Array<PosInfor> } = reactive({ data: [] });
const locationData: { data: Array<PosInfor> } = reactive({ data: [] });
const canvasSize = reactive({ width: 0, height: 0 });
// 全局变量
let result = { width: 0, height: 0 }, x = 0, y = 0,
    scale = 1, minScale = 0.5, maxScale = 4,
    isPointerdown = false, // 按下标识
    diff = { x: 0, y: 0 }, // 相对于上一次pointermove移动差值
    lastPointermove = { x: 0, y: 0 }; // 用于计算diff
let mapWidth: number, mapHeight: number, mapLeft: number, mapTop: number;
// 图片加载完毕后
const imgLoaded = () => {
    // 初始化
    result.width = img_ref.value.clientWidth;
    result.height = img_ref.value.clientHeight;
    img_ref.value.style.width = img_ref.value.clientWidth + 'px';
    img_ref.value.style.height = img_ref.value.clientHeight + 'px';
    img_ref.value.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(1)';
    // 初始位置垂直水平居中
    img_ref.value.style.margin = `-${result.height / 2}px 0 0 -${result.width / 2}px`;
    // 获取初次数据
    getMapData();
    // 拖拽查看
    drag();
    // 滚轮缩放
    wheelZoom();
    // 初始化锚点位置
    setELementPos();
    mapDataSorting();
    emit('clickMap', anchorPos);
}

// 点击移动定位点
const showAnchor = ref(true);
const anchorPos = { coordScaleX: 0.5, coordScaleY: 0.5 };
const clickTheImg = (e: MouseEvent) => {
    // if (!showAnchor.value)
    showAnchor.value = true;
    // 图片内坐标的比例（图片内的绝对位置）
    anchorPos.coordScaleX = e.offsetX / img_ref.value.clientWidth;
    anchorPos.coordScaleY = e.offsetY / img_ref.value.clientHeight;
    emit('clickMap', anchorPos);
    setELementPos();
}

// 点击某个地点
const focusedKid = ref('');
const locationFocus = (id: string, kid: string, state: 'focus' | 'blur') => {
    if (state === 'focus') {
        focusedKid.value = kid;
        mainStore.focusedPlaceId = id;
    } else if (state === 'blur') {
        focusedKid.value = ''
        mainStore.focusedPlaceId = '';
    };
}

// 拖拽查看
function drag() {
    // 绑定 pointerdown
    img_ref.value.addEventListener('pointerdown', (e: PointerEvent) => {
        isPointerdown = true;
        img_ref.value.setPointerCapture(e.pointerId);
        lastPointermove = { x: e.clientX, y: e.clientY };
    });
    // 绑定 pointermove
    img_ref.value.addEventListener('pointermove', (e: PointerEvent) => {
        if (isPointerdown) {
            const current = { x: e.clientX, y: e.clientY };
            diff.x = current.x - lastPointermove.x;
            diff.y = current.y - lastPointermove.y;
            lastPointermove = { x: current.x, y: current.y };
            x += diff.x;
            y += diff.y;
            img_ref.value.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')';
            log_ref.value.innerHTML = `Δx = ${x.toFixed(0)}<br>Δy = ${y.toFixed(0)}<br>scale = ${scale.toFixed(5)}`;
            getMapData();
            setELementPos();
            mapDataSorting();
        }
        e.preventDefault();
    });
    // 绑定 pointerup
    img_ref.value.addEventListener('pointerup', function (e: PointerEvent) {
        if (isPointerdown) {
            isPointerdown = false;
        }
    });
    // 绑定 pointercancel
    img_ref.value.addEventListener('pointercancel', function (e: PointerEvent) {
        if (isPointerdown) {
            isPointerdown = false;
        }
    });
}
// 滚轮缩放
function wheelZoom() {
    container_ref.value.addEventListener('wheel', (e: WheelEvent) => {
        let ratio = 1.1;
        if (e.deltaY > 0) ratio = 1 / 1.1;// 缩小

        const _scale = scale * ratio;
        if (_scale > maxScale) {
            ratio = maxScale / scale;
            scale = maxScale;
        } else if (_scale < minScale) {
            ratio = minScale / scale;
            scale = minScale;
        } else {
            scale = _scale;
        }
        // 目标元素是img说明鼠标在img上，以鼠标位置为缩放中心，否则默认以图片中心点为缩放中心
        if ((<HTMLElement>e.target).tagName === 'IMG') {
            const origin = {
                x: (ratio - 1) * result.width * 0.5,
                y: (ratio - 1) * result.height * 0.5
            };
            // 计算偏移量
            x -= (ratio - 1) * (e.clientX - x) - origin.x;
            y -= (ratio - 1) * (e.clientY - y) - origin.y;
        }
        img_ref.value.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')';
        log_ref.value.innerHTML = `Δx = ${x.toFixed(0)}<br>Δy = ${y.toFixed(0)}<br>scale = ${scale.toFixed(5)}`;
        getMapData();
        setELementPos();
        mapDataSorting();
        e.preventDefault();
    });
}
// 获得背景图片相关信息
function getMapData() {
    // 地图的显示宽高
    mapWidth = img_ref.value.clientWidth * scale;
    mapHeight = img_ref.value.clientHeight * scale;
    // 容器的大小
    const containerWidth = container_ref.value.clientWidth;
    const containerHeight = container_ref.value.clientHeight;
    // 图片距离容器的左、上边距
    mapLeft = x + (containerWidth - mapWidth) / 2;
    mapTop = y + (containerHeight - mapHeight) / 2;
    // canvas的大小和容器一样
    canvasSize.width = containerWidth;
    canvasSize.height = containerHeight;
}
// 设置锚点在地图上的位置
function setELementPos() {
    anchor_ref.value.style.left = mapLeft + mapWidth * anchorPos.coordScaleX - 15 + 'px';
    anchor_ref.value.style.top = mapTop + mapHeight * anchorPos.coordScaleY - 15 + 'px';
}

// 获得地图元素定位数据
function setMapLocation(data: Array<PosInfor>, refresh: boolean) {
    posInfor.data = data;
    if (refresh) mapDataSorting();
}
// 将指定数据群渲染到地图上
function mapDataSorting() {
    locationData.data = posInfor.data.map(item => {
        const newCoord = coordTransfor(item.coordX, item.coordY);
        return {
            id: item.id,
            name: item.name,
            desc: item.desc,
            kid: item.kid,
            iid: item.iid,
            coordX: newCoord.left,
            coordY: newCoord.top
        }
    })
}
// 坐标变换
function coordTransfor(x: number, y: number): { left: number, top: number } {
    return {
        left: mapLeft + mapWidth * x - 2,
        top: mapTop + mapHeight * y - 2
    }
}

function windowResize() {
    showAnchor.value = false;
    getMapData();
    mapDataSorting();
}
onMounted(() => {
    window.addEventListener('resize', windowResize);
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', windowResize);
})

defineExpose({
    setMapLocation
})
</script>

<style lang="scss" src="../style/mapeditor.scss" scoped>
</style>