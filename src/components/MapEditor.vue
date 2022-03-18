<!-- 地图编辑模块 -->
<template>
    <div class="map-content" ref="chart_ref">
        <div class="map-container">
            <img id="image" :src="Map_of_Iceland" ref="img_ref" />
        </div>
        <div class="log"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Map_of_Iceland from '../../public/static/img/Map_of_Iceland.svg';

onMounted(() => {
    // 获取dom
    const container = document.querySelector('.map-container');
    const image = document.getElementById('image');
    const log = document.querySelector('.log');

    // 全局变量
    let result, x, y, scale = 1, minScale = 0.5, maxScale = 4,
        isPointerdown = false, // 按下标识
        diff = { x: 0, y: 0 }, // 相对于上一次pointermove移动差值
        lastPointermove = { x: 0, y: 0 }; // 用于计算diff

    // 图片加载完成后再绑定事件
    image.addEventListener('load', function () {
        result = getImgSize(image.naturalWidth, image.naturalHeight, window.innerWidth, window.innerHeight);
        image.style.width = result.width + 'px';
        image.style.height = result.height + 'px';
        x = (window.innerWidth - result.width) * 0.5;
        y = (window.innerHeight - result.height) * 0.5;
        image.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(1)';
        // 拖拽查看
        drag();
        // 滚轮缩放
        wheelZoom();
    });
    // image.src = '../images/liya.jpg';
    /**
     * 获取图片缩放尺寸
     * @param {number} naturalWidth 
     * @param {number} naturalHeight 
     * @param {number} maxWidth 
     * @param {number} maxHeight 
     * @returns 
     */
    function getImgSize(naturalWidth, naturalHeight, maxWidth, maxHeight) {
        const imgRatio = naturalWidth / naturalHeight;
        const maxRatio = maxWidth / maxHeight;
        let width, height;
        // 如果图片实际宽高比例 >= 显示宽高比例
        if (imgRatio >= maxRatio) {
            if (naturalWidth > maxWidth) {
                width = maxWidth;
                height = maxWidth / naturalWidth * naturalHeight;
            } else {
                width = naturalWidth;
                height = naturalHeight;
            }
        } else {
            if (naturalHeight > maxHeight) {
                width = maxHeight / naturalHeight * naturalWidth;
                height = maxHeight;
            } else {
                width = naturalWidth;
                height = naturalHeight;
            }
        }
        return { width: width, height: height }
    }
    // 拖拽查看
    function drag() {
        // 绑定 pointerdown
        image.addEventListener('pointerdown', function (e) {
            isPointerdown = true;
            image.setPointerCapture(e.pointerId);
            lastPointermove = { x: e.clientX, y: e.clientY };
        });
        // 绑定 pointermove
        image.addEventListener('pointermove', function (e) {
            if (isPointerdown) {
                const current = { x: e.clientX, y: e.clientY };
                diff.x = current.x - lastPointermove.x;
                diff.y = current.y - lastPointermove.y;
                lastPointermove = { x: current.x, y: current.y };
                x += diff.x;
                y += diff.y;
                image.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')';
                log.innerHTML = `x = ${x.toFixed(0)}<br>y = ${y.toFixed(0)}<br>scale = ${scale.toFixed(5)}`;
            }
            e.preventDefault();
        });
        // 绑定 pointerup
        image.addEventListener('pointerup', function (e) {
            if (isPointerdown) {
                isPointerdown = false;
            }
        });
        // 绑定 pointercancel
        image.addEventListener('pointercancel', function (e) {
            if (isPointerdown) {
                isPointerdown = false;
            }
        });
    }
    // 滚轮缩放
    function wheelZoom() {
        container.addEventListener('wheel', function (e) {
            let ratio = 1.1;
            // 缩小
            if (e.deltaY > 0) {
                ratio = 1 / 1.1;
            }
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
            if (e.target.tagName === 'IMG') {
                const origin = {
                    x: (ratio - 1) * result.width * 0.5,
                    y: (ratio - 1) * result.height * 0.5
                };
                // 计算偏移量
                x -= (ratio - 1) * (e.clientX - x) - origin.x;
                y -= (ratio - 1) * (e.clientY - y) - origin.y;
            }
            image.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')';
            log.innerHTML = `x = ${x.toFixed(0)}<br>y = ${y.toFixed(0)}<br>scale = ${scale.toFixed(5)}`;
            e.preventDefault();
        });
    }
})

</script>

<style lang="scss" src="../style/mapcontent.scss" scoped>
</style>