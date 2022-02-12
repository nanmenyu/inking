<!-- 右内容栏 -->
<template>
    <!-- 修改作品信息弹窗 -->
    <div v-if="isModify" id="modify-box">
        <div class="box">
            <div class="box-header">
                <div class="header-title">修改作品信息</div>
                <div class="header-close" @click="modify">
                    <icon-close />
                </div>
            </div>
            <div class="box-body">
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
            </div>
            <div class="box-footer">
                <a-space size="large">
                    <a-button @click="modify">取消</a-button>
                    <a-button
                        type="primary"
                        @click="determine"
                        :disabled="form.name.length === 0 || form.opus.length === 0"
                    >确定</a-button>
                </a-space>
            </div>
        </div>
    </div>
    <div v-if="isNewVolume" id="modify-box">
        <div class="box">
            <div class="box-header">
                <div class="header-title">新增卷</div>
                <div class="header-close" @click="modify">
                    <icon-close />
                </div>
            </div>
            <div class="box-body">
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
            </div>
            <div class="box-footer">
                <a-space size="large">
                    <a-button @click="modify">取消</a-button>
                    <a-button
                        type="primary"
                        @click="addNewVolume"
                        :disabled="volumeName.length === 0"
                    >确定</a-button>
                </a-space>
            </div>
        </div>
    </div>
    <div v-if="isNewChapter" id="modify-box">
        <div class="box">
            <div class="box-header">
                <div class="header-title">新增章</div>
                <div class="header-close" @click="modify">
                    <icon-close />
                </div>
            </div>
            <div class="box-body">
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
            </div>
            <div class="box-footer">
                <a-space size="large">
                    <a-button @click="modify">取消</a-button>
                    <a-button
                        type="primary"
                        @click="addNewChapter"
                        :disabled="chapterName.length === 0"
                    >确定</a-button>
                </a-space>
            </div>
        </div>
    </div>
    <div v-if="isRename" id="modify-box">
        <div class="box">
            <div class="box-header">
                <div class="header-title">重命名</div>
                <div class="header-close" @click="modify">
                    <icon-close />
                </div>
            </div>
            <div class="box-body">
                <a-space>
                    <a-form-item field="name" label="名称">
                        <a-input
                            v-model.trim="showName"
                            style="width: 370px"
                            :max-length="25"
                            :error="showName.length === 0"
                            show-word-limit
                            allow-clear
                            placeholder="请输入章名..."
                        />
                    </a-form-item>
                </a-space>
            </div>
            <div class="box-footer">
                <a-space size="large">
                    <a-button @click="modify">取消</a-button>
                    <a-button type="primary" @click="reName" :disabled="showName.length === 0">确定</a-button>
                </a-space>
            </div>
        </div>
    </div>
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
    <div v-if="isReplaceCover" id="modify-box">
        <div class="box-replace">
            <div class="box-header">
                <div class="header-title">更换封面(4:3)</div>
                <div class="header-close" @click="cancelReplace">
                    <icon-close />
                </div>
            </div>
            <div class="box-body" style="max-height: 400px;padding: 0;overflow: hidden;">
                <img :src="imgUrl" ref="coverImg" />
            </div>
            <div class="box-footer">
                <a-space size="large">
                    <a-button @click="cancelReplace">取消</a-button>
                    <a-button @click="saveImgData" type="primary">确定</a-button>
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
                        <button @click="ContinueWriting">继续写作</button>
                    </div>
                </div>
                <div
                    class="right"
                    @mouseenter="isspread = true"
                    @mouseleave="isspread = false"
                    :class="isspread === null ? '' : isspread ? 'spread' : '-spread'"
                >
                    <div class="right-inside">
                        <div class="right-inside-item">
                            <a-button
                                @click="toSpecialEditor('plot')"
                                type="primary"
                                style="width: 120px;text-align: left;border-radius: 8px 0 0 8px;"
                            >
                                <svg
                                    t="1640962283440"
                                    class="icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="3169"
                                    width="20"
                                    height="20"
                                    style="vertical-align:bottom"
                                >
                                    <path
                                        d="M844.8 921.6H469.3504a51.2 51.2 0 0 1-50.688-43.8784 8.4992 8.4992 0 0 0-8.448-7.3216H264.5504a68.2496 68.2496 0 0 1-68.3008-68.2496v-665.6a34.1504 34.1504 0 0 1 68.3008 0V307.2c0 9.4208 7.6288 17.0496 17.0496 17.0496h128.6144c4.2496 0 7.8336-3.072 8.448-7.2704a51.2 51.2 0 0 1 50.688-43.9296H844.8a51.2 51.2 0 0 1 51.2 51.2v68.3008a51.2 51.2 0 0 1-51.2 51.2H469.3504a51.2 51.2 0 0 1-50.688-43.9296 8.4992 8.4992 0 0 0-8.448-7.2704H281.6A17.0496 17.0496 0 0 0 264.5504 409.6v136.5504c0 9.4208 7.6288 17.0496 17.0496 17.0496h128.6144c4.2496 0 7.8336-3.072 8.448-7.3216a51.2 51.2 0 0 1 50.688-43.8784H844.8a51.2 51.2 0 0 1 51.2 51.2v68.2496a51.2 51.2 0 0 1-51.2 51.2H469.3504a51.2 51.2 0 0 1-50.688-43.8784 8.4992 8.4992 0 0 0-8.448-7.3216H281.6a17.0496 17.0496 0 0 0-17.0496 17.1008v136.4992c0 9.4208 7.6288 17.1008 17.0496 17.1008h128.6144c4.2496 0 7.8336-3.1232 8.448-7.3216a51.2 51.2 0 0 1 50.688-43.8784H844.8a51.2 51.2 0 0 1 51.2 51.2V870.4a51.2 51.2 0 0 1-51.2 51.2z"
                                        p-id="3170"
                                        fill="#ffffff"
                                    />
                                </svg>&nbsp;&nbsp;&nbsp;剧&nbsp;情
                            </a-button>
                        </div>
                        <div class="right-inside-item">
                            <a-button
                                @click="toSpecialEditor('keyword')"
                                type="primary"
                                style="width: 120px;text-align: left;border-radius: 8px 0 0 8px;"
                            >
                                <svg
                                    t="1640962129230"
                                    class="icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="2925"
                                    width="20"
                                    height="20"
                                    style="vertical-align:bottom"
                                >
                                    <path
                                        d="M525.312 247.936h-1.92a129.664 129.664 0 0 1-12.096 39.04l-57.92 142.4h137.728l-55.872-142.4c-6.72-16.896-9.92-29.888-9.92-39.04z"
                                        fill="#ffffff"
                                        p-id="2926"
                                    />
                                    <path
                                        d="M849.152 98.432a37.376 37.376 0 0 0-37.248-37.248H211.712a37.376 37.376 0 0 0-37.248 37.248v561.92c0 20.48 12.864 47.872 28.672 60.992l280 231.68a47.424 47.424 0 0 0 57.536 0.32l279.936-227.072c15.936-12.864 28.864-40.192 28.864-60.672l-0.32-567.168z m-193.28 491.712l-40-100.032H429.76l-41.984 100.032H315.776L489.792 174.08h66.048l174.016 416.064h-73.984z"
                                        fill="#ffffff"
                                        p-id="2927"
                                    />
                                </svg>&nbsp;&nbsp;&nbsp;关键词
                            </a-button>
                        </div>
                        <div class="right-inside-item">
                            <a-button
                                @click="toSpecialEditor('diagram')"
                                type="primary"
                                style="width: 120px;text-align: left;border-radius: 8px 0 0 8px;"
                            >
                                <svg
                                    t="1640962598750"
                                    class="icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="3963"
                                    width="20"
                                    height="20"
                                    style="vertical-align:bottom"
                                >
                                    <path
                                        d="M824.888889 682.666667c-28.444444 0-56.888889 11.377778-79.644445 22.755555l-45.511111-45.511111c22.755556-34.133333 39.822222-73.955556 39.822223-119.466667 0-62.577778-28.444444-119.466667-73.955556-153.6l22.755556-45.511111h22.755555C790.755556 341.333333 853.333333 278.755556 853.333333 199.111111S790.755556 56.888889 711.111111 56.888889 568.888889 119.466667 568.888889 199.111111c0 51.2 28.444444 91.022222 62.577778 119.466667l-17.066667 39.822222c-22.755556-11.377778-45.511111-17.066667-73.955556-17.066667C432.355556 341.333333 341.333333 432.355556 341.333333 540.444444c0 28.444444 5.688889 51.2 17.066667 73.955556l-39.822222 17.066667c-28.444444-34.133333-68.266667-62.577778-119.466667-62.577778C119.466667 568.888889 56.888889 631.466667 56.888889 711.111111S119.466667 853.333333 199.111111 853.333333 341.333333 790.755556 341.333333 711.111111v-22.755555l45.511111-22.755556c34.133333 45.511111 91.022222 73.955556 153.6 73.955556 45.511111 0 85.333333-17.066667 119.466667-39.822223l45.511111 45.511111c-11.377778 22.755556-22.755556 51.2-22.755555 79.644445 0 79.644444 62.577778 142.222222 142.222222 142.222222s142.222222-62.577778 142.222222-142.222222-62.577778-142.222222-142.222222-142.222222z m-113.777778-568.888889c45.511111 0 85.333333 39.822222 85.333333 85.333333S756.622222 284.444444 711.111111 284.444444 625.777778 244.622222 625.777778 199.111111 665.6 113.777778 711.111111 113.777778z m-512 682.666666c-45.511111 0-85.333333-39.822222-85.333333-85.333333S153.6 625.777778 199.111111 625.777778s85.333333 39.822222 85.333333 85.333333S244.622222 796.444444 199.111111 796.444444zM398.222222 540.444444C398.222222 460.8 460.8 398.222222 540.444444 398.222222S682.666667 460.8 682.666667 540.444444 620.088889 682.666667 540.444444 682.666667 398.222222 620.088889 398.222222 540.444444z m426.666667 369.777778c-45.511111 0-85.333333-39.822222-85.333333-85.333333s39.822222-85.333333 85.333333-85.333333 85.333333 39.822222 85.333333 85.333333-39.822222 85.333333-85.333333 85.333333z"
                                        fill="#ffffff"
                                        p-id="3964"
                                    />
                                </svg>&nbsp;&nbsp;&nbsp;关系图
                            </a-button>
                        </div>
                        <div class="right-inside-item">
                            <a-button
                                @click="toSpecialEditor('timeline')"
                                type="primary"
                                style="width: 120px;text-align: left;border-radius: 8px 0 0 8px;"
                            >
                                <svg
                                    t="1640962826160"
                                    class="icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="5740"
                                    width="20"
                                    height="20"
                                    style="vertical-align:bottom"
                                >
                                    <path
                                        d="M172.76 924.37V816.8c0-19.8 16.05-35.86 35.86-35.86 19.8 0 35.86 16.05 35.86 35.86v107.57c0 19.8-16.05 35.86-35.86 35.86-19.81-0.01-35.86-16.06-35.86-35.86zM172.76 601.67V494.1c0-19.8 16.05-35.86 35.86-35.86 19.8 0 35.86 16.05 35.86 35.86v107.57c0 19.8-16.05 35.86-35.86 35.86-19.81-0.01-35.86-16.06-35.86-35.86zM172.76 207.26V99.69c0-19.8 16.05-35.86 35.86-35.86 19.8 0 35.86 16.05 35.86 35.86v107.57c0 19.8-16.05 35.86-35.86 35.86-19.81-0.01-35.86-16.06-35.86-35.86z"
                                        p-id="5741"
                                        fill="#ffffff"
                                    />
                                    <path
                                        d="M352.04 350.68c0 79.21-64.21 143.42-143.42 143.42S65.19 429.89 65.19 350.68s64.21-143.42 143.42-143.42 143.43 64.21 143.43 143.42z m-143.42-71.71c-39.6 0-71.71 32.11-71.71 71.71s32.11 71.71 71.71 71.71 71.71-32.11 71.71-71.71-32.11-71.71-71.71-71.71zM352.04 709.23c0 79.21-64.21 143.42-143.42 143.42S65.19 788.44 65.19 709.23s64.21-143.42 143.42-143.42 143.43 64.21 143.43 143.42z m-143.42-71.71c-39.6 0-71.71 32.11-71.71 71.71 0 39.61 32.11 71.71 71.71 71.71s71.71-32.11 71.71-71.71c0-39.6-32.11-71.71-71.71-71.71zM925.73 350.68H423.75c-19.8 0-35.86-16.05-35.86-35.86 0-19.8 16.05-35.86 35.86-35.86h501.98c19.8 0 35.86 16.05 35.86 35.86-0.01 19.81-16.06 35.86-35.86 35.86zM640.93 458.24H421.7c-18.67 0-33.8-15.13-33.8-33.8v-4.1c0-18.67 15.14-33.8 33.8-33.8h219.23c18.67 0 33.8 15.13 33.8 33.8v4.1c0.01 18.67-15.13 33.8-33.8 33.8zM925.73 709.23H423.75c-19.8 0-35.86-16.05-35.86-35.86 0-19.8 16.05-35.86 35.86-35.86h501.98c19.8 0 35.86 16.05 35.86 35.86-0.01 19.81-16.06 35.86-35.86 35.86zM640.93 816.8H421.7c-18.67 0-33.8-15.13-33.8-33.8v-4.1c0-18.67 15.14-33.8 33.8-33.8h219.23c18.67 0 33.8 15.14 33.8 33.8v4.1c0.01 18.67-15.13 33.8-33.8 33.8z"
                                        p-id="5742"
                                        fill="#ffffff"
                                    />
                                </svg>&nbsp;&nbsp;&nbsp;时间线
                            </a-button>
                        </div>
                        <div class="right-inside-item">
                            <a-button
                                @click="toSpecialEditor('map')"
                                type="primary"
                                style="width: 120px;text-align: left;border-radius: 8px 0 0 8px;"
                            >
                                <svg
                                    t="1640962912750"
                                    class="icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="7526"
                                    width="20"
                                    height="20"
                                    style="vertical-align:bottom"
                                >
                                    <path
                                        d="M625.777778 85.333333h56.888889v682.666667h-56.888889v-682.666667zM341.333333 227.555556h56.888889v711.111111H341.333333V227.555556z"
                                        fill="#ffffff"
                                        p-id="7527"
                                    />
                                    <path
                                        d="M56.888889 56.888889l301.511111 170.666667 301.511111-170.666667L967.111111 227.555556v739.555555l-301.511111-170.666667-301.511111 170.666667L56.888889 796.444444V56.888889z m56.888889 96.711111v608.711111l244.622222 136.533333 301.511111-170.666666 244.622222 136.533333V261.688889l-244.622222-136.533333-301.511111 170.666666L113.777778 153.6z"
                                        fill="#ffffff"
                                        p-id="7528"
                                    />
                                </svg>&nbsp;&nbsp;&nbsp;地&nbsp;图
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
                            <p>{{ standTime(chapter.updateTime) + '\u3000' + chapter.chapterNum + '字' }}</p>
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
    IconClose,
    IconPlus,
    IconEdit,
    IconTag,
    IconCheckCircleFill,
    IconStar,
    IconDown,
    IconCaretRight,
    IconPlusCircle,
    IconCloseCircle,
    IconCheck,
    IconMinusCircle
} from '@arco-design/web-vue/es/icon';
import Toolbar from './widget/Toolbar.vue';
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
            type: 'opus',
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
            category: 'opus',
            id: query_id
        }
    })
}

// 继续写作按键
const ContinueWriting = () => {
    const vid = booksData.data.historRecord.vid,
        cid = booksData.data.historRecord.cid;
    if (vid !== '' && cid !== '') {
        router.push({
            path: '/writer',
            query: {
                type: 'opus',
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
        checked: false
    }
});
const totalNumber = ref(0);
loadData();

/*----旋转动画----*/
const rotated = ref([false, false, false, false]);
const tagRotated = ref(false);
const rotateIcon = (i: number | string) => {
    i === 'tag' ?
        tagRotated.value = !tagRotated.value :
        rotated.value[<number>i] = !rotated.value[<number>i];
}

/*----时间格式化计算属性----*/
const standTime = computed(() => (ts: number, mode?: boolean) => {
    // 选择格式,是否裁切后半部分的准确时间
    mode = mode || false;
    if (mode) {
        return timeFormat(ts).split(' ')[0];
    } else {
        return timeFormat(ts);
    }
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
const category = [{
    value: '男生',
    label: '男生',
    children: [
        {
            value: '玄幻',
            label: '玄幻',
            children: [{
                value: '东方玄幻',
                label: '东方玄幻'
            }, {
                value: '异世大陆',
                label: '异世大陆'
            }, {
                value: '王朝争霸',
                label: '王朝争霸'
            }, {
                value: '高武世界',
                label: '高武世界'
            }]
        }, {
            value: '奇幻',
            label: '奇幻',
            children: [{
                value: '现代魔法',
                label: '现代魔法'
            }, {
                value: '剑与魔法',
                label: '剑与魔法'
            }, {
                value: '史诗奇幻',
                label: '史诗奇幻'
            }, {
                value: '神秘幻想',
                label: '神秘幻想'
            }, {
                value: '历史神话',
                label: '历史神话'
            }, {
                value: '另类幻想',
                label: '另类幻想'
            }]
        }, {
            value: '武侠',
            label: '武侠',
            children: [{
                value: '传统武侠',
                label: '传统武侠'
            }, {
                value: '武侠幻想',
                label: '武侠幻想'
            }, {
                value: '国术无双',
                label: '国术无双'
            }, {
                value: '古武未来',
                label: '古武未来'
            }, {
                value: '武侠同人',
                label: '武侠同人'
            }]
        }, {
            value: '仙侠',
            label: '仙侠',
            children: [{
                value: '修真文明',
                label: '修真文明'
            }, {
                value: '幻想修仙',
                label: '幻想修仙'
            }, {
                value: '现代修真',
                label: '现代修真'
            }, {
                value: '神话修真',
                label: '神话修真'
            }, {
                value: '古典仙侠',
                label: '古典仙侠'
            }]
        }, {
            value: '都市',
            label: '都市',
            children: [{
                value: '都市生活',
                label: '都市生活'
            }, {
                value: '都市异能',
                label: '都市异能'
            }, {
                value: '异术超能',
                label: '异术超能'
            }, {
                value: '青春校园',
                label: '青春校园'
            }, {
                value: '娱乐明星',
                label: '娱乐明星'
            }, {
                value: '商战职场',
                label: '商战职场'
            }]
        }, {
            value: '现实',
            label: '现实',
            children: [{
                value: '社会乡土',
                label: '社会乡土'
            }, {
                value: '生活时尚',
                label: '生活时尚'
            }, {
                value: '文学艺术',
                label: '文学艺术'
            }, {
                value: '成功励志',
                label: '成功励志'
            }, {
                value: '青春文学',
                label: '青春文学'
            }, {
                value: '爱情婚姻',
                label: '爱情婚姻'
            }, {
                value: '现实百态',
                label: '现实百态'
            }]
        }, {
            value: '军事',
            label: '军事',
            children: [{
                value: '军旅生涯',
                label: '军旅生涯'
            }, {
                value: '军事战争',
                label: '军事战争'
            }, {
                value: '战争幻想',
                label: '战争幻想'
            }, {
                value: '抗战烽火',
                label: '抗战烽火'
            }, {
                value: '谍战特工',
                label: '谍战特工'
            }]
        }, {
            value: '历史',
            label: '历史',
            children: [{
                value: '架空历史',
                label: '架空历史'
            }, {
                value: '秦汉三国',
                label: '秦汉三国'
            }, {
                value: '上古先秦',
                label: '上古先秦'
            }, {
                value: '历史传记',
                label: '历史传记'
            }, {
                value: '两晋隋唐',
                label: '两晋隋唐'
            }, {
                value: '五代十国',
                label: '五代十国'
            }, {
                value: '两宋元明',
                label: '两宋元明'
            }, {
                value: '清史民国',
                label: '清史民国'
            }, {
                value: '外国历史',
                label: '外国历史'
            }, {
                value: '民间传说',
                label: '民间传说'
            }]
        }, {
            value: '游戏',
            label: '游戏',
            children: [{
                value: '电子竞技',
                label: '电子竞技'
            }, {
                value: '虚拟网游',
                label: '虚拟网游'
            }, {
                value: '游戏异界',
                label: '游戏异界'
            }, {
                value: '游戏系统',
                label: '游戏系统'
            }, {
                value: '游戏主播',
                label: '游戏主播'
            }]
        }, {
            value: '体育',
            label: '体育',
            children: [{
                value: '篮球运动',
                label: '篮球运动'
            }, {
                value: '体育赛事',
                label: '体育赛事'
            }, {
                value: '足球运动',
                label: '足球运动'
            }]
        }, {
            value: '科幻',
            label: '科幻',
            children: [{
                value: '古武机甲',
                label: '古武机甲'
            }, {
                value: '未来世界',
                label: '未来世界'
            }, {
                value: '星际文明',
                label: '星际文明'
            }, {
                value: '超级科技',
                label: '超级科技'
            }, {
                value: '时空穿梭',
                label: '时空穿梭'
            }, {
                value: '进化变异',
                label: '进化变异'
            }, {
                value: '末世危机',
                label: '末世危机'
            }]
        }, {
            value: '悬疑',
            label: '悬疑',
            children: [{
                value: '诡秘悬疑',
                label: '诡秘悬疑'
            }, {
                value: '奇妙世界',
                label: '奇妙世界'
            }, {
                value: '侦探推理',
                label: '侦探推理'
            }, {
                value: '探险生存',
                label: '探险生存'
            }, {
                value: '古今传奇',
                label: '古今传奇'
            }]
        }, {
            value: '轻小说',
            label: '轻小说',
            children: [{
                value: '原生幻想',
                label: '原生幻想'
            }, {
                value: '恋爱日常',
                label: '恋爱日常'
            }, {
                value: '衍生同人',
                label: '衍生同人'
            }, {
                value: '搞笑吐槽',
                label: '搞笑吐槽'
            }]
        }, {
            value: '短篇',
            label: '短篇',
            children: [{
                value: '诗歌散文',
                label: '诗歌散文'
            }, {
                value: '人物传记',
                label: '人物传记'
            }, {
                value: '影视剧本',
                label: '影视剧本'
            }, {
                value: '评论文集',
                label: '评论文集'
            }, {
                value: '生活随笔',
                label: '生活随笔'
            }, {
                value: '美文游记',
                label: '美文游记'
            }, {
                value: '短篇小说',
                label: '短篇小说'
            }]
        }
    ],
}, {
    value: '女生',
    label: '女生',
    children: [{
        value: '古代言情',
        label: '古代言情',
        children: [{
            value: '古代情缘',
            label: '古代情缘',
        }, {
            value: '宫闱宅斗',
            label: '宫闱宅斗',
        }, {
            value: '经商种田',
            label: '经商种田',
        }, {
            value: '古典架空',
            label: '古典架空',
        }, {
            value: '女尊王朝',
            label: '女尊王朝',
        }, {
            value: '穿越奇情',
            label: '穿越奇情',
        }, {
            value: '西方时空',
            label: '西方时空',
        }, {
            value: '清穿民国',
            label: '清穿民国',
        }, {
            value: '上古蛮荒',
            label: '上古蛮荒',
        }, {
            value: '热血江湖',
            label: '热血江湖',
        }]
    }, {
        value: '仙侠奇缘',
        label: '仙侠奇缘',
        children: [{
            value: '武侠情缘',
            label: '武侠情缘',
        }, {
            value: '古典仙侠',
            label: '古典仙侠',
        }, {
            value: '现代修真',
            label: '现代修真',
        }, {
            value: '远古洪荒',
            label: '远古洪荒',
        }, {
            value: '仙侣奇缘',
            label: '仙侣奇缘',
        }]
    }, {
        value: '现代言情',
        label: '现代言情',
        children: [{
            value: '商战职场',
            label: '商战职场',
        }, {
            value: '豪门世家',
            label: '豪门世家',
        }, {
            value: '都市生活',
            label: '都市生活',
        }, {
            value: '婚恋情缘',
            label: '婚恋情缘',
        }, {
            value: '娱乐明星',
            label: '娱乐明星',
        }, {
            value: '都市异能',
            label: '都市异能',
        }, {
            value: '极道江湖',
            label: '极道江湖',
        }, {
            value: '民国情缘',
            label: '民国情缘',
        }, {
            value: '异国情缘',
            label: '异国情缘',
        }]
    }, {
        value: '浪漫青春',
        label: '浪漫青春',
        children: [{
            value: '青春校园',
            label: '青春校园',
        }, {
            value: '青春疼痛',
            label: '青春疼痛',
        }, {
            value: '叛逆成长',
            label: '叛逆成长',
        }, {
            value: '青春纯爱',
            label: '青春纯爱',
        }]
    }, {
        value: '玄幻言情',
        label: '玄幻言情',
        children: [{
            value: '东方玄幻',
            label: '东方玄幻',
        }, {
            value: '异世大陆',
            label: '异世大陆',
        }, {
            value: '西方奇幻',
            label: '西方奇幻',
        }, {
            value: '远古神话',
            label: '远古神话',
        }, {
            value: '异族恋情',
            label: '异族恋情',
        }, {
            value: '魔法幻情',
            label: '魔法幻情',
        }, {
            value: '异能超术',
            label: '异能超术',
        }]
    }, {
        value: '悬疑推理',
        label: '悬疑推理',
        children: [{
            value: '推理侦探',
            label: '推理侦探',
        }, {
            value: '诡秘惊险',
            label: '诡秘惊险',
        }, {
            value: '悬疑探险',
            label: '悬疑探险',
        }, {
            value: '奇妙世界',
            label: '奇妙世界',
        }, {
            value: '神秘文化',
            label: '神秘文化',
        }, {
            value: '幽情奇缘',
            label: '幽情奇缘',
        }]
    }, {
        value: '科幻空间',
        label: '科幻空间',
        children: [{
            value: '星际恋歌',
            label: '星际恋歌',
        }, {
            value: '时空穿梭',
            label: '时空穿梭',
        }, {
            value: '未来世界',
            label: '未来世界',
        }, {
            value: '古武机甲',
            label: '古武机甲',
        }, {
            value: '超级科技',
            label: '超级科技',
        }, {
            value: '进化变异',
            label: '进化变异',
        }, {
            value: '末世危机',
            label: '末世危机',
        }]
    }, {
        value: '游戏竞技',
        label: '游戏竞技',
        children: [{
            value: '电子竞技',
            label: '电子竞技',
        }, {
            value: '网游情缘',
            label: '网游情缘',
        }, {
            value: '游戏异界',
            label: '游戏异界',
        }, {
            value: '体育竞技',
            label: '体育竞技',
        }]
    }, {
        value: '轻小说',
        label: '轻小说',
        children: [{
            value: '同人衍生',
            label: '同人衍生',
        }, {
            value: '唯美幻想',
            label: '唯美幻想',
        }, {
            value: '萌系变身',
            label: '萌系变身',
        }, {
            value: '恋爱日常',
            label: '恋爱日常',
        }, {
            value: '搞笑吐槽',
            label: '搞笑吐槽',
        }, {
            value: '古典衍生',
            label: '古典衍生',
        }, {
            value: '影视衍生',
            label: '影视衍生',
        }, {
            value: '动漫衍生',
            label: '动漫衍生',
        }, {
            value: '其他衍生',
            label: '其他衍生',
        }]
    }, {
        value: '现实生活',
        label: '现实生活',
        children: [{
            value: '家与情感',
            label: '家与情感',
        }, {
            value: '行业人生',
            label: '行业人生',
        }, {
            value: '探索科幻',
            label: '探索科幻',
        }, {
            value: '人文博览',
            label: '人文博览',
        }]
    }, {
        value: '短篇小说',
        label: '短篇小说',
    }]
}, {
    value: '其它',
    label: '其它'
}];
// 随机生成tag的颜色
const tagColor = computed(() => {
    let color = [
        'red',
        'orangered',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'arcoblue',
        'purple',
        'pinkpurple',
        'magenta'], temp = [];
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
const selectedArr: Array<string> = reactive([]);
const deCheckedArr: Array<string> = reactive([]);
// 点击添加
const addTag = () => {
    let i = tagData['qidian'].indexOf(inputTag.value);
    if (i !== -1) {
        deCheckedArr[i] = '#165dff';
    }
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
    if (selectedArr.length < 4) {
        // 判断tempArr是否有tname, 没有就push, 有就删除
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
    db.opus
        .update(query_id, { discard: 't', discardTime: new Date().getTime() })
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
    db.opus
        .where(':id')
        .equals(query_id)
        .modify(item => {
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
        })
        .then(() => {
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
    db.opus
        .where(':id')
        .equals(query_id)
        .modify(item => {
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
        })
        .then(() => {
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
            db.opus
                .where(':id')
                .equals(query_id)
                .modify(item => {
                    for (let i = 0; i < item.data.length; i++) {
                        if (item.data[i].vid === vid) {
                            item.data[i].discard = true;
                            item.data[i].discardTime = new Date().getTime();
                            break;
                        }
                    }
                })
                .then(() => {
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
            db.opus
                .where(':id')
                .equals(query_id)
                .modify(item => {
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
        db.opus
            .where(':id')
            .equals(query_id)
            .modify(item => {
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
        db.opus
            .where(':id')
            .equals(query_id)
            .modify(item => {
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
        db.opus
            .where(':id')
            .equals(query_id)
            .modify(item => {
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
            })
            .then(() => {
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
        db.opus
            .where(':id')
            .equals(query_id)
            .modify(item => {
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
            })
            .then(() => {
                isWastepaperBasket.value = false;
                loadData();
                $message.success('删除成功!');
            })
    }
}

// 更换封面图片
const isReplaceCover = ref(false), imgUrl = ref(''),
    coverImg = ref(), fileInput = ref();
const replaceCover = () => {
    fileInput.value.click();
}
let cropper: Cropper;
const _replaceCover = () => {
    if (fileInput.value.value !== '') {
        isReplaceCover.value = true;
        //使用 FileReader() 构造器获得图片的base64
        const reader = new FileReader();
        reader.readAsDataURL(fileInput.value.files[0]);
        reader.onload = function (evt) {
            imgUrl.value = <string>evt.target!.result;
            // 等待目标图片加载完成调用cropper按要求裁剪封面
            coverImg.value.onload = function () {
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
    base64Img = cropper.getCroppedCanvas({
        imageSmoothingQuality: 'high'
    }).toDataURL('image/jpeg'); // 设置图片格式
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
    if (route.query.type === 'opus') {
        db.opus.get(query_id)
            .then(value => {
                if (value) {
                    booksData.data = value;
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
                    let num = 0, wordNum = 0;
                    booksData.data.data.forEach(item => {
                        item.volume = item.volume.filter(it => {
                            // 判断目标章是否有删除标记
                            if (it.discard) {
                                wastepaperBasketData.push(it);
                            } else {
                                wordNum += it.chapterNum || 0;
                                num++;
                            }
                            return !it.discard;
                        })
                    });
                    booksData.data.data.length > 0 ? isEmpty.value = false : isEmpty.value = true;
                    totalNumber.value = num; // 作品总章数
                    totalWords.value = wordNum; // 作品总字数
                }
            });
    }
}

</script>

<style src="../style/bookdetail.css" scoped>
</style>