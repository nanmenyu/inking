<template>
    <TitleBlock></TitleBlock>
    <div class="pdf-container">
        <canvas id="pdf-canvas"></canvas>
    </div>
</template>

<script setup lang='ts'>
import { nextTick } from 'vue';
import TitleBlock from '../components/TitleBlock.vue';
import * as PdfJs from 'pdfjs-dist/legacy/build/pdf.js';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
import Pdf from '../assets/test.pdf';

let pdfDoc: any, pdfPages = 1, pdfScale = 1;
laodFile(Pdf);

function laodFile(url: string) {
    PdfJs.GlobalWorkerOptions.workerSrc = pdfWorker;
    const loadingTask = PdfJs.getDocument(url);

    loadingTask.promise.then((pdf) => {
        pdfDoc = pdf // 保存加载的pdf文件流
        pdfPages = pdfDoc.numPages // 获取pdf文件的总页数
        nextTick(() => {
            renderPage(1) // 将pdf文件内容渲染到canvas，
        })
    })
}

function renderPage(num: any) {
    pdfDoc.getPage(num).then((page: any) => {
        const canvas: any = document.getElementById('pdf-canvas')
        const ctx: any = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1
        const bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio ||
            1
        const ratio = dpr / bsr
        const viewport = page.getViewport({ scale: pdfScale })
        canvas.width = viewport.width * ratio
        canvas.height = viewport.height * ratio
        canvas.style.width = viewport.width + 'px'
        canvas.style.height = viewport.height + 'px'
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        }
        page.render(renderContext);
    })
}

</script>

<style lang="scss" scoped>
.pdf-container {
    width: 100vw;
    height: calc(100vh - 40px);
}
#pdf-canvas {
    box-shadow: 1px 2px 4px rgb(0 0 0 / 20%);
}
</style>