<!-- 右侧大世界页面 -->
<template>
    <div class="bigworld-content">
        <Toolbar></Toolbar>
        <div class="content">
            <div class="book-cover">
                <a-dropdown trigger="contextMenu" alignPoint :style="{ display: 'block' }">
                    <div class="book">
                        <img
                            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/945546/3433202-d2a1bea8a58cd447.png"
                        />
                        <div class="title">兰亭集序</div>
                    </div>
                    <template #content>
                        <a-doption>继续写作</a-doption>
                        <a-doption>重命名</a-doption>
                        <a-doption>置入回收站</a-doption>
                        <a-doption>导出</a-doption>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Toolbar from "./widget/Toolbar.vue";

</script>

<style lang="scss" src="../style/bigworldcontent.scss" scoped></style>