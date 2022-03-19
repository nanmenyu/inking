<template>
    <div id="modify-box" ref="floatBox">
        <div :class="props.boxClass ? [...props.boxClass] : 'box'">
            <div class="box-header">
                <div class="header-title">{{ props.title }}</div>
                <div class="header-close" @click="modify">
                    <icon-close />
                </div>
            </div>
            <div
                :class="props.bodyClass ? [...props.bodyClass] : 'box-body'"
                :style="props.bodyStyle"
            >
                <slot></slot>
            </div>
            <div class="box-footer">
                <a-space size="large">
                    <a-button @click="modify">取消</a-button>
                    <a-button
                        :disabled="determineDisabled"
                        @click="determine"
                        type="primary"
                    >{{ props.determine }}</a-button>
                </a-space>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { IconClose } from '@arco-design/web-vue/es/icon';
const props = defineProps<{
    title: string,
    determine: string,
    boxClass?: Array<string>,
    bodyClass?: Array<string>,
    bodyStyle?: string,
    determineDisabled?: boolean
}>();
const emit = defineEmits(['toModify', 'toDetermine']);

// 关闭、取消键
const modify = () => { emit('toModify') }
// 确认、添加键
const determine = () => { emit('toDetermine') }


</script>

<style lang="scss" scoped>
#modify-box {
    @include popupBase;
    .card-detail {
        width: 550px;
        animation: spredModify2 0.3s ease-out;
    }
    .detail-body {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px 10px;
    }
    .box-replace {
        width: 550px;
    }
}
</style>