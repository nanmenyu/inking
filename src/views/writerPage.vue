<!-- 作品(纯文本)编写页 -->
<template>
    <TitleBlock></TitleBlock>
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
    <div class="layout-write">
        <a-layout>
            <a-layout-header>
                <div class="head-item">
                    <!-- 全屏洁净模式 -->
                    <a-tooltip background-color="#3491FA" mini content="全屏洁净模式(F1)">
                        <a-button class="headerBtn">
                            <icon-fullscreen />&nbsp;全屏
                        </a-button>
                    </a-tooltip>
                    <!-- 文字设置 -->
                    <a-dropdown trigger="hover">
                        <a-button class="headerBtn" style="padding-right: 0;">
                            <svg
                                t="1641214796315"
                                class="icon"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="22430"
                                width="14"
                                height="14"
                                style="line-height:14px;"
                            >
                                <path
                                    d="M830 99H194c-53.02 0-96 42.98-96 96v634c0 53.02 42.98 96 96 96h636c53.02 0 96-42.98 96-96V195c0-53.02-42.98-96-96-96z m-636 64h636c17.673 0 32 14.327 32 32v634c0 17.673-14.327 32-32 32H194c-17.673 0-32-14.327-32-32V195c0-17.673 14.327-32 32-32z"
                                    fill="#4e5969"
                                    p-id="22431"
                                />
                                <path
                                    d="M671.783 328c26.861 0 48.775 21.497 49.21 48.287l0.007 0.813V417h-64v-25H544.5v272.756l49.95 0.156-0.199 64-164.35-0.512 0.199-64 50.4 0.157V392H369v25h-64v-39.9c0-26.895 21.645-48.66 48.405-49.093l0.812-0.007h317.566z"
                                    fill="#4e5969"
                                    p-id="22432"
                                />
                            </svg>&nbsp;&nbsp;文字
                            <icon-down />
                        </a-button>
                        <template #content>
                            <a-trigger position="right" :popup-translate="[5, 16]">
                                <a-doption>
                                    <svg
                                        t="1641215822075"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="26984"
                                        width="14"
                                        height="14"
                                        style="vertical-align: middle"
                                    >
                                        <path
                                            d="M24.380952 560.761905h97.52381v-58.514286h112.152381v438.857143h97.523809v-438.857143H438.857143v58.514286h97.523809V404.72381H24.380952z"
                                            p-id="26985"
                                            fill="#1d2129"
                                        />
                                        <path
                                            d="M273.066667 78.019048v175.542857h97.523809V175.542857H585.142857v770.438095h97.52381V175.542857h219.428571v82.895238h97.52381V78.019048z"
                                            p-id="26986"
                                            fill="#1d2129"
                                        />
                                    </svg>&nbsp;&nbsp;字体大小
                                </a-doption>
                                <template #content>
                                    <a-space class="trigger" style="padding:0 10px;">
                                        <a-input-number
                                            v-model="fontSize"
                                            :min="1"
                                            :max="50"
                                            mode="button"
                                            style="width:108px"
                                            @change="changeFontSize()"
                                        />
                                        <a-slider
                                            v-model="fontSize"
                                            :step="1"
                                            :min="1"
                                            :max="50"
                                            :marks="{ 1: '1px', 22: '22px', 50: '50px' }"
                                            :format-tooltip="(value: number) => {
                                                return `${value}px`;
                                            }"
                                            :style="{ width: '280px', transform: 'translateY(4px)' }"
                                            @change="changeFontSize()"
                                        />
                                    </a-space>
                                </template>
                            </a-trigger>
                            <a-trigger position="right" :popup-translate="[5, 0]">
                                <a-doption>
                                    <svg
                                        t="1641216666125"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="31930"
                                        width="14"
                                        height="14"
                                        style="vertical-align: middle"
                                    >
                                        <path
                                            d="M648 160H104c-4.4 0-8 3.6-8 8v128c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-64h168v560h-92c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h264c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-92V232h168v64c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V168c0-4.4-3.6-8-8-8z m272.8 546H856V318h64.8c6 0 9.4-7 5.7-11.7L825.7 178.7c-2.9-3.7-8.5-3.7-11.3 0L713.6 306.3c-3.7 4.7-0.4 11.7 5.7 11.7H784v388h-64.8c-6 0-9.4 7-5.7 11.7l100.8 127.5c2.9 3.7 8.5 3.7 11.3 0l100.8-127.5c3.8-4.7 0.4-11.7-5.6-11.7z"
                                            p-id="31931"
                                            fill="#1d2129"
                                        />
                                    </svg>&nbsp;&nbsp;字符行高
                                </a-doption>
                                <template #content>
                                    <a-space class="trigger" style="padding:0 10px;">
                                        <a-input-number
                                            v-model="lineHeight"
                                            :step="0.05"
                                            :min="0"
                                            :max="5"
                                            mode="button"
                                            :style="{ width: '108px' }"
                                            @change="changeLineHeight()"
                                        />
                                        <a-slider
                                            v-model="lineHeight"
                                            :step="0.05"
                                            :min="0"
                                            :max="5"
                                            :marks="{ 0: '0em', 1.5: '1.5em', 5: '5em' }"
                                            :format-tooltip="(value: number) => {
                                                return `${value}em`;
                                            }"
                                            :style="{ width: '280px', transform: 'translateY(4px)' }"
                                            @change="changeLineHeight()"
                                        />
                                    </a-space>
                                </template>
                            </a-trigger>
                            <a-trigger position="right" :popup-translate="[5, 0]">
                                <a-doption>
                                    <svg
                                        t="1641216600416"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="31614"
                                        width="14"
                                        height="14"
                                        style="vertical-align: middle"
                                    >
                                        <path
                                            d="M853.1 916.4H167.6c-34.9 0-63.3-28.4-63.3-63.3V167.6c0-34.9 28.4-63.3 63.3-63.3h685.5c34.9 0 63.3 28.4 63.3 63.3v685.5c0 34.9-28.4 63.3-63.3 63.3z m-685.5-772c-12.8 0-23.3 10.4-23.3 23.3v685.5c0 12.8 10.4 23.3 23.3 23.3h685.5c12.8 0 23.3-10.4 23.3-23.3V167.6c0-12.8-10.4-23.3-23.3-23.3H167.6z"
                                            fill="#1d2129"
                                            p-id="31615"
                                        />
                                        <path
                                            d="M545.4 265.6H222.6v70.8H261v-31.7h102.1v432.7h-13.8v38.4h66.8v-38.4h-11.3V304.7h102.4v31.7h38.5v-70.8zM723.3 694.2V355.3l31.9 30.8 27.8-28.7-80-77.5-77 77.8 28.4 28.2 28.9-29.3v336.5l-29-29.3-28.4 28.1 77.2 78.1 79.1-77.5-28.1-28.6z"
                                            fill="#1d2129"
                                            p-id="31616"
                                        />
                                    </svg>&nbsp;&nbsp;文字粗细
                                </a-doption>
                                <template #content>
                                    <a-space class="trigger" style="padding: 10px 20px;">
                                        <a-radio-group
                                            v-model="fontWeight"
                                            @change="changeFontWeight"
                                            direction="vertical"
                                        >
                                            <a-radio value="lighter">lighter</a-radio>
                                            <a-radio value="normal">normal</a-radio>
                                            <a-radio value="bold">bold</a-radio>
                                        </a-radio-group>
                                    </a-space>
                                </template>
                            </a-trigger>
                            <a-trigger position="right" :popup-translate="[5, 0]">
                                <a-doption>
                                    <svg
                                        t="1641216496281"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="30655"
                                        width="14"
                                        height="14"
                                        style="vertical-align: middle"
                                    >
                                        <path
                                            d="M940.6208 870.254933a21.367467 21.367467 0 0 0-28.219733 3.0976c-1.390933 0.964267-8.712533 5.367467-27.818667 7.2192 3.336533-41.642667 24.968533-153.9584 47.428267-254.429866a21.316267 21.316267 0 0 0-16.170667-25.472 21.256533 21.256533 0 0 0-24.942933 14.574933c-13.704533-8.046933-48.093867-24.8832-86.6048-17.792-29.226667 5.4016-53.930667 22.920533-73.429334 52.087467-13.610667 20.352-29.738667 48.213333-43.6736 78.583466-27.1104-18.346667-57.250133-37.589333-89.685333-55.714133l-58.052267-561.314133a21.333333 21.333333 0 0 0-23.415466-19.0208c-0.0512 0-0.093867 0.0256-0.136534 0.0256a21.265067 21.265067 0 0 0-21.666133 14.208L326.7584 589.841067c-42.820267 0.0256-86.621867 6.775467-130.304 23.492266-76.6464 29.329067-113.979733 108.663467-123.3664 173.141334-8.567467 58.88 4.9408 109.917867 35.259733 133.179733 20.625067 15.8208 39.9616 20.7104 55.970134 20.7104 8.251733 0 15.616-1.297067 21.819733-3.054933 66.628267-18.952533 106.24-118.9632 110.754133-130.884267l59.758934-172.526933c61.533867 5.623467 127.889067 27.383467 200.772266 65.621333l22.801067 220.424533a21.333333 21.333333 0 1 0 42.427733-4.386133l-19.703466-190.498133a1248.913067 1248.913067 0 0 1 60.8256 38.7328c2.346667 1.595733 4.906667 2.628267 7.5264 3.182933-18.824533 52.846933-25.9072 106.9312 1.1008 138.9056 14.421333 17.083733 35.6096 25.634133 63.880533 25.634133 28.433067 0 64.136533-8.763733 107.264-26.077866 1.1776 5.6576 2.9952 7.9872 4.514133 9.8816a23.04 23.04 0 0 0 18.030934 8.7296c56.3456 0 74.3936-16.827733 79.530666-24.055467a21.2992 21.2992 0 0 0-5.000533-29.738667z m-683.8272-78.3872c-9.6256 25.275733-43.195733 93.312-82.3552 104.405334-8.302933 2.3552-21.4784 3.822933-40.106667-10.4704-17.527467-13.448533-25.173333-50.901333-19.012266-93.192534 7.287467-50.0992 36.906667-116.676267 96.392533-139.434666a311.876267 311.876267 0 0 1 100.224-20.5056l-55.1424 159.197866z m114.193067-199.3472l135.048533-389.896533 46.139733 446.122667c-55.995733-27.1616-117.316267-48.904533-181.188266-56.226134z m334.011733 285.841067c-24.942933-29.533867 12.305067-131.7888 61.3376-205.1072 12.791467-19.131733 28.0832-30.498133 45.44-33.792 30.882133-5.819733 60.5696 14.421333 60.859733 14.634667 2.705067 1.8944 5.7088 3.003733 8.772267 3.498666-22.596267 104.055467-32.989867 165.0432-36.974933 201.233067-102.493867 44.612267-131.677867 28.7232-139.434667 19.5328z"
                                            p-id="30656"
                                            fill="#1d2129"
                                        />
                                    </svg>&nbsp;&nbsp;选择字体
                                </a-doption>
                                <template #content>
                                    <ul
                                        class="trigger typeface"
                                        @scroll="fontlistScroll"
                                        ref="fontListNode"
                                    >
                                        <li
                                            class="typeface-head"
                                            title="点击恢复默认"
                                        >{{ uWritingOption.uFont }}</li>
                                        <li
                                            v-for="(item, i) in fontList"
                                            :key="i"
                                            :title="item"
                                            :style="{ fontFamily: item }"
                                            @click="selectFont(i)"
                                        >{{ item }}</li>
                                    </ul>
                                </template>
                            </a-trigger>
                            <a-trigger position="right" :popup-translate="[5, 0]">
                                <a-doption>
                                    <svg
                                        t="1641216429576"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="29680"
                                        width="14"
                                        height="14"
                                        style="vertical-align: middle"
                                    >
                                        <path
                                            d="M572.4 584.1m-159.4 0a159.4 159.4 0 1 0 318.8 0 159.4 159.4 0 1 0-318.8 0Z"
                                            fill="#FF4C4D"
                                            p-id="29681"
                                        />
                                        <path
                                            d="M223.3 743.5l54.5-145.4h199.7l51.9 145.4h61.9L408.6 231.8l-6.8-19.7-41.5-0.6-199.3 532h62.3zM380 325l76.6 214.8h-157L380 325zM869.1 474.2c17 19.2 25.4 45.2 25.4 78v183.6H853v-48.1c-11.4 15.9-26.2 28.8-44.2 38.7-21.8 11.4-45.4 17.1-70.8 17.1-28.8 0-51.6-7.4-68.6-22.1-17.7-15.1-26.6-35.2-26.6-60.3 0-36.5 14.6-63.1 43.7-79.6 23.6-14 55.3-21 95.1-21l68.6-0.6v-9.4c0-47.9-24.9-71.9-74.7-71.9-23.2 0-41.3 4.8-54.2 14.4-14.4 10-23.2 24.7-26.5 44.2h-43.7c4.4-32.8 18.4-57.1 42-73 20.6-14.7 49-22.1 85.2-22.1 40.7 0 70.9 10.7 90.8 32.1z m-18.8 120.5l-65.8 0.6c-64.1 0-96.2 21.8-96.2 65.3 0 14 5.2 25.4 15.5 34.3 10.7 8.5 25.2 12.7 43.7 12.7 28.8 0 53.3-8.9 73.6-26.6 19.5-17.7 29.3-38.2 29.3-61.4v-24.9z"
                                            p-id="29682"
                                        />
                                    </svg>&nbsp;&nbsp;文字颜色
                                </a-doption>
                                <template #content>
                                    <div class="trigger" style="margin-top: 24px;">
                                        <color-picker
                                            :isWidget="true"
                                            :format="'hex'"
                                            v-model:pureColor="fontColor"
                                            v-model:gradientColor="gradientColor"
                                            @pureColorChange="getColor"
                                        />
                                    </div>
                                </template>
                            </a-trigger>
                        </template>
                    </a-dropdown>
                    <!-- 段落设置 -->
                    <a-dropdown trigger="hover">
                        <a-button class="headerBtn" style="padding-right: 0;">
                            <svg
                                t="1641214607791"
                                class="icon"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="15544"
                                width="14"
                                height="14"
                                style="line-height:14px;"
                            >
                                <path
                                    d="M768 128H256A128 128 0 0 0 128 256v512A128 128 0 0 0 256 896h512a128 128 0 0 0 128-128V256A128 128 0 0 0 768 128zM844.8 768a76.8 76.8 0 0 1-76.8 76.8H256A76.8 76.8 0 0 1 179.2 768V256A76.8 76.8 0 0 1 256 179.2h512A76.8 76.8 0 0 1 844.8 256z"
                                    fill="#4e5969"
                                    p-id="15545"
                                />
                                <path
                                    d="M716.8 321.536H307.2a25.6 25.6 0 0 0 0 51.2h409.6a25.6 25.6 0 0 0 0-51.2zM307.2 541.184h204.8a25.6 25.6 0 0 0 0-51.2H307.2a25.6 25.6 0 0 0 0 51.2zM716.8 658.432H307.2a25.6 25.6 0 1 0 0 51.2h409.6a25.6 25.6 0 0 0 0-51.2z"
                                    fill="#4e5969"
                                    p-id="15546"
                                />
                            </svg>&nbsp;&nbsp;段落
                            <icon-down />
                        </a-button>
                        <template #content>
                            <a-trigger position="right" :popup-translate="[5, 16]">
                                <a-doption>
                                    <svg
                                        t="1641216863156"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="32442"
                                        width="14"
                                        height="14"
                                        style="vertical-align: middle"
                                    >
                                        <path
                                            d="M30.117647 963.764706h963.764706v60.235294H30.117647zM30.117647 662.588235h963.764706v60.235294H30.117647zM30.117647 361.411765h963.764706v60.235294H30.117647z"
                                            fill="#4D4D4D"
                                            p-id="32443"
                                        />
                                        <path
                                            d="M512 0L331.294118 180.705882h361.411764L512 0z"
                                            fill="#05AFC8"
                                            p-id="32444"
                                        />
                                        <path
                                            d="M451.764706 180.705882m2.409412 0l115.651764 0q2.409412 0 2.409412 2.409412l0 115.651765q0 2.409412-2.409412 2.409412l-115.651764 0q-2.409412 0-2.409412-2.409412l0-115.651765q0-2.409412 2.409412-2.409412Z"
                                            fill="#05AFC8"
                                            p-id="32445"
                                        />
                                    </svg>&nbsp;&nbsp;段落间距
                                </a-doption>
                                <template #content>
                                    <a-space class="trigger" style="padding: 0 10px;">
                                        <a-input-number
                                            v-model="segSpacing"
                                            :min="0"
                                            :max="100"
                                            mode="button"
                                            :style="{ width: '108px' }"
                                            @change="changeSegSpacing()"
                                        />
                                        <a-slider
                                            v-model="segSpacing"
                                            :min="0"
                                            :max="100"
                                            :marks="{ 0: '0px', 10: '10px', 100: '100px' }"
                                            :format-tooltip="(value: number) => {
                                                return `${value}px`;
                                            }"
                                            :style="{ width: '280px', transform: 'translateY(4px)' }"
                                            @change="changeSegSpacing()"
                                        />
                                    </a-space>
                                </template>
                            </a-trigger>
                            <a-trigger position="right" :popup-translate="[5, 30]">
                                <a-doption>
                                    <svg
                                        t="1641217358477"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="33301"
                                        width="14"
                                        height="14"
                                        style="vertical-align: middle"
                                    >
                                        <path
                                            d="M128 896h768v-85.333H128V896z m0-554.667v341.334L298.667 512 128 341.333z m341.333 384H896V640H469.333v85.333zM128 128v85.333h768V128H128z m341.333 256H896v-85.333H469.333V384z m0 170.667H896v-85.334H469.333v85.334z"
                                            p-id="33302"
                                            fill="#1d2129"
                                        />
                                    </svg>&nbsp;&nbsp;段前缩进
                                </a-doption>
                                <template #content>
                                    <a-space class="trigger" style="padding: 10px 20px;">
                                        <a-radio-group
                                            v-model="textIndent"
                                            @change="changeTextIndent"
                                            direction="vertical"
                                        >
                                            <a-radio value="0">0em</a-radio>
                                            <a-radio value="1">1em</a-radio>
                                            <a-radio value="2">2em</a-radio>
                                            <a-radio value="3">3em</a-radio>
                                            <a-radio value="4">4em</a-radio>
                                        </a-radio-group>
                                    </a-space>
                                </template>
                            </a-trigger>
                            <a-trigger position="right" :popup-translate="[5, 0]">
                                <a-doption>
                                    <svg
                                        t="1641217446031"
                                        class="icon"
                                        viewBox="0 0 1027 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="33789"
                                        width="14"
                                        height="14"
                                        style="vertical-align: middle"
                                    >
                                        <path
                                            d="M28.27 536.64c-13.3 0-24.8-11.23-24.8-24.8 0-13.25 11.5-24.19 24.8-24.19h124.5c5.8-90.55 45-172.43 105.24-232.96 60.83-60.56 142.73-99.76 233.23-105.51V24.63c0-13.25 10.67-24.51 24.21-24.51 13.28 0 24.8 11.26 24.8 24.51v124.55c90.55 5.75 172.4 44.95 232.96 105.51l1.73 2.02c59.07 60.54 98 141.56 103.78 230.94h124.56c13.25 0 24.19 10.94 24.19 24.19 0 13.57-10.94 24.8-24.19 24.8H878.73c-5.77 90.52-45.55 172.4-105.51 232.67-60.56 60.53-142.41 100.05-232.96 105.8v124.56c0 13.25-11.52 24.21-24.8 24.21-13.54 0-24.21-10.97-24.21-24.21V875.11c-90.5-5.75-172.4-45.27-233.23-105.8l-1.44-2.32c-59.69-60.24-98-140.98-103.8-230.36H28.27v0.01z m205.82-48.99h122.24c13.54 0 24.21 10.94 24.21 24.19 0 13.57-10.67 24.8-24.21 24.8H234.09c5.48 66.9 35.18 128.02 79.85 173.57l1.73 1.73c45.85 45.55 106.97 75.81 175.57 81.88V671.28c0-13.54 10.67-24.51 24.21-24.51 13.28 0 24.8 10.97 24.8 24.51v122.54c68.04-6.07 129.16-36.32 175.3-81.88 46.11-46.14 75.81-107.23 81.85-175.3H674.6c-13.25 0-24.21-11.23-24.21-24.8 0-13.25 10.96-24.19 24.21-24.19h122.8c-5.75-67.48-35.15-128.3-80.15-174.15l-1.7-1.41c-46.14-45.85-107.26-75.86-175.3-82.2v122.83c0 13.57-11.52 24.77-24.8 24.77-13.54 0-24.21-11.2-24.21-24.77V229.89c-68.6 6.33-129.72 36.35-175.57 82.2h-0.29c-45.55 45.79-75.8 106.94-81.29 175.56z"
                                            fill="#1d2129"
                                            p-id="33790"
                                        />
                                    </svg>&nbsp;&nbsp;段落聚焦
                                </a-doption>
                                <template #content>
                                    <a-space class="trigger" style="padding: 10px 20px;">
                                        <a-radio-group
                                            v-model="paraFocus"
                                            @change="changeParaFocus"
                                            direction="vertical"
                                        >
                                            <a-radio value="open">开启</a-radio>
                                            <a-radio value="close">关闭</a-radio>
                                        </a-radio-group>
                                    </a-space>
                                </template>
                            </a-trigger>
                        </template>
                    </a-dropdown>
                    <!-- 其它设置 -->
                    <a-dropdown trigger="hover">
                        <a-button class="headerBtn">
                            <svg
                                t="1641215577688"
                                class="icon"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="26592"
                                width="14"
                                height="14"
                                style="line-height:14px;"
                            >
                                <path
                                    d="M511.3 64.2c-247.4 0-448 200.6-448 448s200.6 448 448 448 448-200.6 448-448c0-247.5-200.5-448-448-448z m0 821.3C305.5 885.5 138 718 138 512.2s167.5-373.3 373.3-373.3 373.3 167.5 373.3 373.3-167.4 373.3-373.3 373.3z"
                                    p-id="26593"
                                    fill="#4e5969"
                                />
                                <path
                                    d="M306 456.2c-30.9 0-56 25.1-56 56s25.1 56 56 56 56-25.1 56-56c0-31-25.1-56-56-56zM716.7 456.2c-30.9 0-56 25.1-56 56s25.1 56 56 56 56-25.1 56-56c0-31-25.1-56-56-56zM511.3 456.2c-30.9 0-56 25.1-56 56s25.1 56 56 56 56-25.1 56-56c0-31-25-56-56-56z"
                                    p-id="26594"
                                    fill="#4e5969"
                                />
                            </svg>&nbsp;&nbsp;其它
                            <icon-down />
                        </a-button>
                        <template #content>
                            <a-trigger position="right" :popup-translate="[5, 0]">
                                <a-doption>
                                    <svg
                                        t="1641217638938"
                                        class="icon"
                                        viewBox="0 0 1044 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="36559"
                                        width="14"
                                        height="14"
                                        style="vertical-align: middle"
                                    >
                                        <path
                                            d="M172.19783 394.37681c-77.778397 92.035628-120.612275 221.627595-120.612275 364.900534a23.547854 23.547854 0 0 0 23.539562 23.539563h894.735547a23.547854 23.547854 0 0 0 23.539563-23.539563c0-140.192648-46.121457-269.904842-129.869733-365.240486-86.588113-98.569328-207.702024-152.857911-341.037603-152.857911-144.466915 0-265.597409 52.978526-350.295061 153.197863z"
                                            fill="#9771FF"
                                            p-id="36560"
                                        />
                                        <path
                                            d="M523.094024 759.277344L775.420891 320.897555s127.817587 71.746332 170.174704 208.025392l-422.501571 230.354397"
                                            fill="#B786FF"
                                            p-id="36561"
                                        />
                                        <path
                                            d="M523.094024 762.258138l-0.596988-513.940211s143.654348-20.413668 252.928 72.579628l-252.331012 441.360583z"
                                            fill="#FF7FED"
                                            p-id="36562"
                                        />
                                        <path
                                            d="M523.094024 762.258138l-0.596988-513.940211S404.086154 229.467206 263.375287 315.213733l259.718737 447.044405z"
                                            fill="#FF8282"
                                            p-id="36563"
                                        />
                                        <path
                                            d="M496.208842 777.87932L107.65681 514.450138s-56.431935 166.659109-56.071255 244.827206l444.623287 18.601976z"
                                            fill="#72E07C"
                                            p-id="36564"
                                        />
                                        <path
                                            d="M523.094024 759.277344L266.497036 320.172049S144.740534 380.20664 107.65681 514.450138l415.437214 244.827206"
                                            fill="#FFB300"
                                            p-id="36565"
                                        />
                                        <path
                                            d="M966.32434 494.504939c-25.027887-62.696162-65.523563-110.882202-101.367708-144.334251-32.830186-32.82604-69.565668-60.270899-109.348276-81.903417-41.610883-25.488065-84.875919-39.040518-122.74319-46.034397-35.578818-8.005441-72.505004-12.147045-110.372275-12.147044-153.906785 0-283.250008 56.784324-374.041911 164.217263-82.512842 97.64068-127.958543 234.35919-127.958543 384.970105 0 30.127158 24.509668 54.63268 54.63268 54.632681h894.735547c30.127158 0 54.63268-24.505522 54.63268-54.632681 0-94.92936-20.206381-185.406186-58.169004-264.768259z m-241.597668-172.148081a255.792713 255.792713 0 0 1 10.177814 6.600033l-180.8583 314.214607-0.427012-365.634332a355.580891 355.580891 0 0 1 65.618915 5.418494c37.108599 8.378559 72.492567 21.603498 105.488583 39.401198z m115.442526 92.201458c25.260049 28.750769 46.851109 60.892761 64.565895 95.642429l-173.669571 100.273231-124.049101 67.629603 178.83932-312.805053a424.682235 424.682235 0 0 1 40.039644 33.816875 425.337263 425.337263 0 0 1 14.273813 15.442915z m-348.305101 232.054154L306.030899 326.747206c79.979789-42.050332 149.052113-49.011045 185.406186-49.093959l0.427012 368.959223z m-236.432065-283.171239l178.457911 307.175125-288.93383-170.274202c26.661312-70.233134 79.295741-115.206219 110.475919-136.900923z m-141.270542 198.374089l333.484048 189.908469H82.72013c0.746235-67.733247 11.570785-131.950899 31.44136-189.908469z m487.739077 189.904324l329.325862-179.552389c19.596955 55.801781 30.247385 116.458235 31.030931 179.552389h-360.356793z"
                                            fill="#6E6E96"
                                            p-id="36566"
                                        />
                                    </svg>&nbsp;&nbsp;纸张颜色
                                </a-doption>
                                <template #content>
                                    <div class="trigger" style="margin-top: 76px;">
                                        <color-picker
                                            :isWidget="true"
                                            v-model:pureColor="bgcColor"
                                            v-model:gradientColor="gradientColor"
                                            @pureColorChange="getBgcColor"
                                        />
                                    </div>
                                </template>
                            </a-trigger>
                            <a-trigger position="right" :popup-translate="[5, 0]">
                                <a-doption>
                                    <svg
                                        t="1641217716975"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="37628"
                                        width="14"
                                        height="14"
                                        style="vertical-align: middle"
                                    >
                                        <path
                                            d="M0 0m192 0l640 0q192 0 192 192l0 640q0 192-192 192l-640 0q-192 0-192-192l0-640q0-192 192-192Z"
                                            fill="#FFFFFF"
                                            p-id="37629"
                                        />
                                        <path
                                            d="M192 128a64 64 0 0 0-64 64v640a64 64 0 0 0 64 64h640a64 64 0 0 0 64-64v-640a64 64 0 0 0-64-64h-640m0-128h640a192 192 0 0 1 192 192v640a192 192 0 0 1-192 192h-640a192 192 0 0 1-192-192v-640a192 192 0 0 1 192-192z"
                                            fill="#1693F6"
                                            p-id="37630"
                                        />
                                        <path
                                            d="M444.088446 217.866606m45.254834 45.254834l0 0q45.254834 45.254834 0 90.509668l-135.764502 135.764502q-45.254834 45.254834-90.509668 0l0 0q-45.254834-45.254834 0-90.509668l135.764502-135.764502q45.254834-45.254834 90.509668 0Z"
                                            fill="#1693F6"
                                            p-id="37631"
                                        />
                                        <path
                                            d="M715.652456 489.357091m45.254834 45.254834l0 0q45.254834 45.254834 0 90.509668l-135.764502 135.764502q-45.254834 45.254834-90.509668 0l0 0q-45.254834-45.254834 0-90.509668l135.764502-135.764502q45.254834-45.254834 90.509668 0Z"
                                            fill="#1693F6"
                                            p-id="37632"
                                        />
                                        <path
                                            d="M670.389371 263.143845m45.254834 45.254834l0 0q45.254834 45.254834 0 90.509668l-316.783838 316.783838q-45.254834 45.254834-90.509668 0l0 0q-45.254834-45.254834 0-90.509668l316.783838-316.783838q45.254834-45.254834 90.509668 0Z"
                                            fill="#1693F6"
                                            p-id="37633"
                                        />
                                    </svg>&nbsp;&nbsp;纸张大小
                                </a-doption>
                                <template #content>
                                    <ul class="trigger typeface paper-size">
                                        <li
                                            v-for="item in paperSize"
                                            :key="item.type"
                                            :style="item.now ? 'background-color: #3491fa;color: #fff;' : ''"
                                            @click="changePaperSize(item.type)"
                                        >
                                            <span>{{ item.type }}</span>
                                            <span>{{ item.size + 'px' }}</span>
                                        </li>
                                    </ul>
                                </template>
                            </a-trigger>
                            <a-trigger position="right" :popup-translate="[8, 0]">
                                <a-doption>
                                    <svg
                                        t="1641218119799"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="39333"
                                        width="14"
                                        height="14"
                                        style="vertical-align: middle"
                                    >
                                        <path
                                            d="M523.73504 319.29344h-204.8c-16.896 0-30.72-13.824-30.72-30.72s13.824-30.72 30.72-30.72h204.8c16.896 0 30.72 13.824 30.72 30.72s-13.824 30.72-30.72 30.72zM605.65504 452.41344h-286.72c-16.896 0-30.72-13.824-30.72-30.72s13.824-30.72 30.72-30.72h286.72c16.896 0 30.72 13.824 30.72 30.72s-13.824 30.72-30.72 30.72z"
                                            fill="#FFFFFF"
                                            p-id="39334"
                                        />
                                        <path
                                            d="M511.56992 176.73216c-244.61312 0-335.14496 214.02624-335.14496 334.04928s87.00928 336.2304 328.01792 336.2304c0 0 59.904 1.04448 59.904-52.992 0-54.04672-26.94144-36.78208-26.94144-75.66336a51.52768 51.52768 0 0 1 39.8848-56.2176c48.82432 4.0448 97.97632 0.01024 145.48992-11.93984a194.21184 194.21184 0 0 0 123.91424-176.03584C831.27296 301.9776 684.36992 171.61216 511.56992 176.73216zM307.26144 511.87712a58.40896 58.40896 0 1 1 58.18368-58.38848 58.28608 58.28608 0 0 1-58.18368 58.38848z m109.75232-144.4864a58.39872 58.39872 0 1 1 58.19392-58.38848 58.29632 58.29632 0 0 1-58.18368 58.43968v-0.0512z m186.63424 0a58.40896 58.40896 0 1 1 58.18368-58.38848 58.30656 58.30656 0 0 1-58.10176 58.43968l-0.08192-0.0512z m110.80704 144.4864a58.40896 58.40896 0 1 1 58.18368-58.38848 58.3168 58.3168 0 0 1-58.18368 58.38848z m0 0"
                                            fill="#3889FF"
                                            p-id="39335"
                                        />
                                    </svg>&nbsp;&nbsp;软件主题
                                </a-doption>
                                <template #content></template>
                            </a-trigger>
                        </template>
                    </a-dropdown>
                    <!-- 导出 -->
                    <a-dropdown trigger="hover">
                        <a-button class="headerBtn" style="padding-right: 0;">
                            <icon-export />&nbsp;&nbsp;导出
                            <icon-caret-down />
                        </a-button>
                        <template #content>
                            <a-doption @click="exp('txt')">
                                <svg
                                    t="1641211837870"
                                    class="icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="32037"
                                    width="20"
                                    height="20"
                                    style="vertical-align: text-top"
                                >
                                    <path
                                        d="M332.799002 686.081014m-332.799002 0a332.799002 332.799002 0 1 0 665.598003 0 332.799002 332.799002 0 1 0-665.598003 0Z"
                                        fill="#F4EFC9"
                                        p-id="32038"
                                    />
                                    <path
                                        d="M883.19735 1024h-639.99808A141.055577 141.055577 0 0 1 102.399693 883.200422v-742.397772A141.055577 141.055577 0 0 1 243.19927 0.003072h516.350451a89.087733 89.087733 0 0 1 63.231811 25.599923l189.695431 189.695431A38.399885 38.399885 0 0 1 1023.996928 243.202342v639.99808a141.055577 141.055577 0 0 1-140.799578 140.799578zM243.19927 76.802842A63.999808 63.999808 0 0 0 179.199462 140.80265v742.397772A63.999808 63.999808 0 0 0 243.19927 947.20023h639.99808a63.999808 63.999808 0 0 0 63.999808-63.999808V259.074295l-179.199462-179.199463a12.799962 12.799962 0 0 0-8.447975-3.07199z"
                                        fill="#434260"
                                        p-id="32039"
                                    />
                                    <path
                                        d="M366.846899 428.801786h-66.303801v-29.695911h168.447495v29.695911h-66.5598v196.095411h-35.583894zM541.182376 508.417547l-60.671818-109.311672h39.679881l27.391918 52.735841c5.631983 10.495969 10.495969 20.479939 17.151949 34.047898h1.535995c5.887982-13.567959 10.239969-23.551929 15.359954-34.047898l25.599923-52.735841h37.375888l-60.671818 111.103666 65.023805 114.943656h-38.655884l-29.695911-56.063832-18.687944-36.86389c-6.399981 13.823959-12.031964 25.599923-17.407948 36.86389l-28.927913 56.063832h-39.167882zM723.709829 428.801786h-66.303801v-29.695911h168.447494v29.695911h-66.5598v196.095411h-35.583893z"
                                        fill="#434260"
                                        p-id="32040"
                                    />
                                </svg>&nbsp;&nbsp;导出为&nbsp;&nbsp;TXT
                            </a-doption>
                            <a-doption @click="exp('docx')">
                                <svg
                                    t="1641213002307"
                                    class="icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="3711"
                                    width="20"
                                    height="20"
                                    style="vertical-align: text-top"
                                >
                                    <path
                                        d="M332.799002 686.081014m-332.799002 0a332.799002 332.799002 0 1 0 665.598003 0 332.799002 332.799002 0 1 0-665.598003 0Z"
                                        fill="#DFDFF2"
                                        p-id="3712"
                                    />
                                    <path
                                        d="M883.19735 1024h-639.99808A141.055577 141.055577 0 0 1 102.399693 883.200422v-742.397772A141.055577 141.055577 0 0 1 243.19927 0.003072h516.350451a89.087733 89.087733 0 0 1 63.231811 25.599923l189.695431 189.695431A38.399885 38.399885 0 0 1 1023.996928 243.202342v639.99808a141.055577 141.055577 0 0 1-140.799578 140.799578zM243.19927 76.802842A63.999808 63.999808 0 0 0 179.199462 140.80265v742.397772A63.999808 63.999808 0 0 0 243.19927 947.20023h639.99808a63.999808 63.999808 0 0 0 63.999808-63.999808V259.074295l-179.199462-179.199463a12.799962 12.799962 0 0 0-8.447975-3.07199z"
                                        fill="#434260"
                                        p-id="3713"
                                    />
                                    <path
                                        d="M209.407372 409.601843h53.759838c63.743809 0 100.0957 35.071895 100.0957 102.399693s-36.351891 104.447687-98.303705 104.447687H209.407372z m51.199846 180.479459c44.543866 0 68.351795-25.599923 68.351795-76.79977s-24.063928-76.79977-68.351795-76.799769h-18.687944v153.599539zM387.070839 512.001536c0-66.8158 36.863889-106.75168 90.111729-106.75168s90.367729 39.93588 90.367729 106.75168-37.119889 108.031676-90.367729 108.031676-90.11173-41.983874-90.111729-108.031676z m146.943559 0c0-48.639854-22.527932-78.335765-56.83183-78.335765s-56.57583 28.927913-56.57583 78.335765 22.271933 79.615761 56.57583 79.615761 57.087829-31.487906 57.087829-79.615761zM594.430217 512.001536c0-67.583797 41.215876-108.031676 93.439719-108.031676a79.87176 79.87176 0 0 1 58.879824 25.599923l-17.663947 20.735938a55.039835 55.039835 0 0 0-40.447879-18.687944c-35.839892 0-60.671818 29.95191-60.671818 78.591764s23.039931 79.359762 59.647821 79.359762a60.415819 60.415819 0 0 0 45.823863-22.015934l17.407947 20.479939a81.919754 81.919754 0 0 1-64.511806 29.95191c-51.967844 1.535995-91.903724-37.375888-91.903724-105.983682zM822.525532 508.673546L767.997696 409.601843h36.351891l25.599923 48.383855c5.119985 9.471972 9.471972 18.943943 15.871953 31.231906H844.797466c5.375984-12.287963 9.215972-21.759935 14.079957-31.231906l25.599924-48.383855h34.303897l-55.807833 102.399693L921.597235 615.681225h-35.839892l-27.391918-51.199846-17.151949-33.791899c-5.887982 12.543962-11.007967 23.29593-16.127951 33.791899l-25.599923 51.199846h-36.351891z"
                                        fill="#434260"
                                        p-id="3714"
                                    />
                                </svg>&nbsp;&nbsp;导出为&nbsp;&nbsp;DOCX
                            </a-doption>
                            <a-doption @click="exp('pdf')">
                                <svg
                                    t="1641213059942"
                                    class="icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="3873"
                                    width="20"
                                    height="20"
                                    style="vertical-align: text-top"
                                >
                                    <path
                                        d="M332.799002 686.081014m-332.799002 0a332.799002 332.799002 0 1 0 665.598003 0 332.799002 332.799002 0 1 0-665.598003 0Z"
                                        fill="#FFDCEE"
                                        p-id="3874"
                                    />
                                    <path
                                        d="M883.19735 1024h-639.99808A141.055577 141.055577 0 0 1 102.399693 883.200422v-742.397772A141.055577 141.055577 0 0 1 243.19927 0.003072h516.350451a89.087733 89.087733 0 0 1 63.231811 25.599923l189.695431 189.695431A38.399885 38.399885 0 0 1 1023.996928 243.202342v639.99808a141.055577 141.055577 0 0 1-140.799578 140.799578zM243.19927 76.802842A63.999808 63.999808 0 0 0 179.199462 140.80265v742.397772A63.999808 63.999808 0 0 0 243.19927 947.20023h639.99808a63.999808 63.999808 0 0 0 63.999808-63.999808V259.074295l-179.199462-179.199463a12.799962 12.799962 0 0 0-8.447975-3.07199z"
                                        fill="#434260"
                                        p-id="3875"
                                    />
                                    <path
                                        d="M299.775101 399.105875h68.351795c51.199846 0 86.271741 17.151949 86.271741 68.095795s-35.839892 72.191783-84.991745 72.191784H335.358994v85.759743h-35.583893zM366.078902 512.001536c36.351891 0 53.503839-13.823959 53.503839-43.519869s-18.687944-39.679881-54.527836-39.679881H335.358994V512.001536zM488.190535 399.105875h58.623825c69.375792 0 109.055673 38.399885 109.055672 112.127663s-39.679881 113.919658-107.263678 113.919659h-60.415819z m56.319831 196.863409c48.383855 0 74.495777-28.671914 74.495777-84.735746s-25.599923-83.19975-74.495777-83.19975h-20.479938v167.935496zM692.733922 399.105875h133.887598v29.695911h-98.303705v69.119792h83.45575v29.695911h-83.45575v97.279708h-35.583893z"
                                        fill="#434260"
                                        p-id="3876"
                                    />
                                </svg>&nbsp;&nbsp;导出为&nbsp;&nbsp;PDF
                            </a-doption>
                        </template>
                    </a-dropdown>
                    <!-- 字数统计 -->
                    <a-dropdown trigger="hover">
                        <a-button
                            class="headerBtn"
                            :style="wordCount >= 15000 ? 'color : #f53f3f' : ''"
                        >
                            <icon-book />
                            &nbsp;&nbsp;{{ showChoice }}
                            <icon-caret-down />
                        </a-button>
                        <template #content>
                            <a-doption
                                @click="choice(0)"
                                :style="choiceArr[0] ? 'color: #165dff;' : ''"
                            >
                                <icon-check-circle
                                    :style="choiceArr[0] ? '' : 'visibility:hidden'"
                                />
                                &nbsp;字数&nbsp;&nbsp;&nbsp;&nbsp;{{ wordCount }}字
                            </a-doption>
                            <a-doption
                                @click="choice(1)"
                                :style="choiceArr[1] ? 'color: #165dff;' : ''"
                            >
                                <icon-check-circle
                                    :style="choiceArr[1] ? '' : 'visibility:hidden'"
                                />
                                &nbsp;字符&nbsp;&nbsp;&nbsp;&nbsp;{{ charCount }}个
                            </a-doption>
                            <a-doption
                                @click="choice(2)"
                                :style="choiceArr[2] ? 'color: #165dff;' : ''"
                            >
                                <icon-check-circle
                                    :style="choiceArr[2] ? '' : 'visibility:hidden'"
                                />
                                &nbsp;段落&nbsp;&nbsp;&nbsp;&nbsp;{{ paragraphs }}段
                            </a-doption>
                        </template>
                    </a-dropdown>
                </div>
            </a-layout-header>
            <a-layout>
                <a-layout-sider collapsible class="siderLeft">
                    <a-menu
                        :default-open-keys="[vid]"
                        :default-selected-keys="[cid]"
                        :style="{ width: '100%', textAlign: 'left' }"
                    >
                        <button @click="isNewVolume = true" class="topBtn">
                            <svg
                                t="1642929408096"
                                class="icon"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="14924"
                                width="20"
                                height="20"
                                style="margin-bottom: -3px;"
                            >
                                <path
                                    d="M832 928H192c-52.8 0-96-43.2-96-96V672c0-17.6 14.4-32 32-32s32 14.4 32 32v160c0 17.6 14.4 32 32 32h640c17.6 0 32-14.4 32-32V672c0-17.6 14.4-32 32-32s32 14.4 32 32v160c0 52.8-43.2 96-96 96zM256 800c-17.6 0-32-14.4-32-32V96c0-17.6 14.4-32 32-32s32 14.4 32 32v672c0 17.6-14.4 32-32 32z m160 0c-17.6 0-32-14.4-32-32V224c0-17.6 14.4-32 32-32s32 14.4 32 32v544c0 17.6-14.4 32-32 32z m368 0c-16 0-28.8-11.2-32-27.2l-94.4-536c-3.2-17.6 8-33.6 25.6-36.8 17.6-3.2 33.6 8 36.8 25.6l94.4 536c3.2 17.6-8 33.6-25.6 36.8-1.6 1.6-3.2 1.6-4.8 1.6z m-208 0c-17.6 0-32-14.4-32-32V352c0-17.6 14.4-32 32-32s32 14.4 32 32v416c0 17.6-14.4 32-32 32z"
                                    p-id="14925"
                                    fill="#4e5969"
                                />
                            </svg>
                            <span>添加卷</span>
                        </button>
                        <a-sub-menu v-for="item in booksLists.data" :key="item.vid">
                            <template #title>
                                <icon-double-right
                                    @click.stop="showLeftMore = showLeftMore === item.vid ? '' : item.vid"
                                    class="siderLeft-btn"
                                />
                                <span title="删除卷">
                                    <svg
                                        v-if="showLeftMore === item.vid"
                                        t="1642858152161"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="3021"
                                        width="20"
                                        height="20"
                                        style="margin-bottom: -5px; margin-right: 5px;margin-left: 5px;"
                                        @mouseenter="editVid1 = item.vid"
                                        @mouseleave="editVid1 = ''"
                                        @click.stop="deleteVolume(item.vid, item.volumeName)"
                                    >
                                        <path
                                            d="M512.625752 61.5928c-247.332085 0-447.833585 200.502523-447.833585 447.833585 0 247.331062 200.502523 447.832562 447.833585 447.832562 247.331062 0 447.832562-200.5015 447.832562-447.832562S759.956813 61.5928 512.625752 61.5928zM356.794637 742.478232l-72.894194-72.454172 159.40143-160.369477L282.932396 350.253152l72.454172-72.894194 160.370501 159.40143 159.40143-160.369477 72.894194 72.455195L588.651262 509.214561l160.370501 159.402453-72.455195 72.895217L516.19709 582.110801 356.794637 742.478232z"
                                            p-id="3022"
                                            :fill="editVid1 === item.vid ? '#bf5e00' : '#ff7d00'"
                                        />
                                    </svg>
                                </span>
                                <span title="重命名">
                                    <svg
                                        v-if="showLeftMore === item.vid"
                                        t="1642827186638"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="3275"
                                        width="20"
                                        height="20"
                                        style="margin-bottom: -5px; margin-right: 5px;"
                                        @mouseenter="editVid2 = item.vid"
                                        @mouseleave="editVid2 = ''"
                                        @click.stop="showReName('v', item.vid, item.volumeName)"
                                    >
                                        <path
                                            d="M936.96 332.8c-23.04-56.32-56.32-107.52-99.84-148.48-43.52-43.52-94.72-76.8-148.48-99.84-56.32-23.04-115.2-35.84-176.64-35.84s-120.32 12.8-176.64 35.84c-56.32 23.04-104.96 56.32-148.48 99.84-43.52 43.52-76.8 94.72-99.84 148.48-23.04 56.32-35.84 115.2-35.84 176.64 0 61.44 12.8 120.32 35.84 176.64 23.04 56.32 56.32 107.52 99.84 148.48 43.52 43.52 94.72 76.8 148.48 99.84 56.32 23.04 115.2 35.84 176.64 35.84s120.32-12.8 176.64-35.84c56.32-23.04 107.52-56.32 148.48-99.84 43.52-43.52 76.8-94.72 99.84-148.48 23.04-56.32 35.84-115.2 35.84-176.64 0-61.44-12.8-120.32-35.84-176.64z m-161.28 94.72L537.6 665.6c-5.12 5.12-10.24 5.12-15.36 5.12s-10.24 0-12.8-5.12c-7.68-7.68-7.68-20.48 0-28.16l238.08-238.08c5.12-5.12 7.68-12.8 7.68-23.04s-5.12-20.48-10.24-28.16l-112.64-112.64c-12.8-12.8-30.72-5.12-40.96 7.68l-227.84 227.84-61.44 61.44-23.04 174.08 158.72-25.6-89.6-92.16c-7.68-7.68-7.68-20.48 0-28.16 7.68-7.68 20.48-7.68 28.16 0l117.76 117.76c5.12 5.12 7.68 12.8 5.12 20.48-2.56 7.68-7.68 12.8-15.36 12.8l-225.28 35.84H256c-5.12 0-10.24-2.56-12.8-5.12-5.12-5.12-7.68-10.24-5.12-17.92l28.16-207.36c0-5.12 2.56-7.68 5.12-10.24l38.4-38.4 256-256c30.72-30.72 71.68-33.28 97.28-7.68l112.64 112.64c15.36 15.36 23.04 35.84 23.04 56.32-2.56 23.04-10.24 40.96-23.04 53.76z"
                                            :fill="editVid2 === item.vid ? '#276dbc' : '#3491fa'"
                                            p-id="3276"
                                        />
                                    </svg>
                                </span>
                                <span title="新增章">
                                    <svg
                                        v-if="showLeftMore === item.vid"
                                        t="1642906752840"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="1549"
                                        width="18"
                                        height="18"
                                        style="margin-bottom: -4px; margin-right: 5px;"
                                        @mouseenter="editVid3 = item.vid"
                                        @mouseleave="editVid3 = ''"
                                        @click.stop="newChapter(item.vid)"
                                    >
                                        <path
                                            d="M512 0C229.229877 0 0 229.229877 0 512S229.229877 1024 512 1024 1024 794.770123 1024 512 794.770123 0 512 0zM820.798216 512a50.37806 50.37806 0 0 1-50.229654 50.229654H562.229654V770.568562a50.37806 50.37806 0 0 1-50.229654 50.229654 50.37806 50.37806 0 0 1-50.229654-50.229654V562.229654H253.431438a50.37806 50.37806 0 0 1-50.229654-50.229654 50.37806 50.37806 0 0 1 50.229654-50.229654h208.338908V253.431438a50.37806 50.37806 0 0 1 50.229654-50.229654 50.37806 50.37806 0 0 1 50.229654 50.229654v208.338908H770.568562a50.37806 50.37806 0 0 1 50.229654 50.229654z"
                                            p-id="1550"
                                            :fill="editVid3 === item.vid ? '#008720' : '#00b42a'"
                                        />
                                    </svg>
                                </span>
                                {{ item.volumeName }}
                            </template>
                            <a-dropdown
                                v-for="it in item.volume"
                                :key="it.cid"
                                trigger="contextMenu"
                                alignPoint
                                :style="{ display: 'block' }"
                            >
                                <a-menu-item
                                    :key="it.cid"
                                    @click="onClickMenuItem(item.vid, it.cid)"
                                    :style="deletedCid === it.cid ? 'color:#f53f3f;text-decoration:line-through;text-indent:10px;' : 'text-indent:10px;'"
                                    :title="it.chapterName"
                                >{{ it.chapterName }}</a-menu-item>
                                <template #content>
                                    <a-doption @click="showReName('c', it.cid, it.chapterName)">重命名</a-doption>
                                    <a-doption
                                        @click="deleteChapter(item.vid, it.cid, it.chapterName)"
                                    >删除章</a-doption>
                                </template>
                            </a-dropdown>
                        </a-sub-menu>
                    </a-menu>
                    <template #trigger="{ collapsed }">
                        <IconCaretRight v-if="collapsed"></IconCaretRight>
                        <IconCaretLeft v-else></IconCaretLeft>
                    </template>
                </a-layout-sider>
                <a-layout-content
                    @mouseover="showScroll"
                    @mouseout="closeScroll"
                    @scroll="getScrollTop"
                >
                    <WritingPaper @todata="getData" ref="myRef"></WritingPaper>
                </a-layout-content>
                <a-resize-box :directions="['left']" class="sider-right" style="width: 100px;">
                    <template #resize-trigger="{ direction }">
                        <div
                            :class="[
                                `resizebox-demo`,
                                `resizebox-demo-${direction === 'left' ? 'vertical' : 'horizontal'}`
                            ]"
                        >
                            <div class="resizebox-demo-line" />
                        </div>
                    </template>
                </a-resize-box>
            </a-layout>
        </a-layout>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue';
import {
    IconDown,
    IconClose,
    IconExport,
    IconCaretRight,
    IconCaretLeft,
    IconBook,
    IconCaretDown,
    IconCheckCircle,
    IconFullscreen,
    IconDoubleRight
} from '@arco-design/web-vue/es/icon';
import TitleBlock from '../components/TitleBlock.vue';
import WritingPaper from '../components/WritingPaper.vue';
import { useRoute, useRouter } from 'vue-router';
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import { throttle } from '../utils/flowControl';
import { db } from '../db/db';
import useCurrentInstance from '../utils/useCurrentInstance';
import { v4 } from 'uuid';

const { proxy } = useCurrentInstance();
const $modal = proxy.$modal;
const $message = proxy.$message;
const route = useRoute();
const query_id = parseInt(<string>route.query.id);
const vid = ref(route.query.vid);
const cid = ref(route.query.cid);
loadListData();

onMounted(() => {
    nextTick(() => {
        myRef.value.setFont(uWritingOption.value.uFont, true);
        myRef.value.setFontSize(uWritingOption.value.uFontSize, true);
        myRef.value.setLineHeight(uWritingOption.value.uLineHeight, true);
        myRef.value.setFontWeight(uWritingOption.value.uFontWeight, true);
        myRef.value.setSegSpacing(uWritingOption.value.uSpacing, true);
        myRef.value.setTextIndent(uWritingOption.value.uTextIndent, true);
        myRef.value.setColor(uWritingOption.value.uColor, true);
        myRef.value.setBgcColor(uWritingOption.value.uBgcColor, true);
        myRef.value.setPaperSize(uWritingOption.value.uPaperSize, true);
        myRef.value.setParaFocus(uWritingOption.value.uParaFocus, true);
    })
})
onBeforeUnmount(() => {
    setScrollTop(<string>vid.value, <string>cid.value);
    db.opus.update(query_id, { historRecord: { vid: vid.value, cid: cid.value } });
})

onUnmounted(() => {
    window.removeEventListener('keydown', shortcut);
    window.removeEventListener('click', leftMoreControl);
})

/*----数据统计与初始化----*/
const wordCount = ref(0),
    charCount = ref(0),
    paragraphs = ref(0),
    fontList = ref(),
    paperSize = ref([
        { type: 'Max', size: 1280, now: false },
        { type: 'iPad Pro', size: 1024, now: false },
        { type: 'A4', size: 794, now: true },
        { type: 'iPad', size: 768, now: false },
        { type: 'Surface Duo', size: 540, now: false },
        { type: 'iPhone6/7/8 Plus', size: 414, now: false },
        { type: 'iPhone6/7/8 X', size: 375, now: false },
        { type: 'iPhone5/SE', size: 320, now: false },
        { type: 'Galaxy Fold', size: 280, now: false }]);

//获得子组件传递的记数
const getData = (data: Pagecount) => {
    wordCount.value = data.wordCount;
    charCount.value = data.charCount;
    paragraphs.value = data.paragraphs;
}

// 获取页面上下相对位置
let temp_scrollTop = 0;
const getScrollTop = (e: Event) => {
    temp_scrollTop = (<HTMLElement>e.target).scrollTop;
}

// 读取本地用户缓存设置(localStorage缓存状态)
const uWritingOption = ref({
    uFontSize: 22,
    uLineHeight: 1.5,
    uFontWeight: 'normal',
    uFont: 'KaiTi',
    uColor: '#333333',
    uSpacing: 10,
    uTextIndent: '0',
    uParaFocus: 'close',
    uBgcColor: '#ffffff',
    uPaperSize: 'A4'
});
const getuWritingOption = localStorage.getItem('uWritingOption');
if (getuWritingOption === null) {
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
} else {
    uWritingOption.value = JSON.parse(getuWritingOption);
}

/*----获取系统字体列表备用----*/
let _fontList: Array<string>, slideDown: number = 1;
window.$API.ipcSend('count-fonts-item');
window.$API.ipcOn('get-fonts-item', (data: Array<string>) => {
    // 这里可以通过分析内容是中文还是英文选择是否逆序
    _fontList = data.reverse();
    if (data.length > 20) {
        // 列表拆分为20一组
        slideDown = data.length % 20 === 0 ? data.length / 20 : Math.floor(data.length / 20);
        // 首先渲染20个
        fontList.value = _fontList.slice(1, 20);
    } else {
        fontList.value = _fontList;
    }
});

/*----通过Scroll滚动事件懒加载字字体列表----*/
const fontListNode = ref();
let count = 0, countSlideDown = 1, scrollTop: Array<number> = [];
// 触发节流函数
const fontlistScroll = throttle(() => {
    count++;
    if (count === 1) {
        scrollTop[0] = fontListNode.value.scrollTop;
    } else if (count === 2) {
        scrollTop[1] = fontListNode.value.scrollTop;
        count = 0;
        // 下滑操作时加载新字体列表
        if (scrollTop[1] > scrollTop[0]) {
            if (countSlideDown <= slideDown) {
                for (let i = 0; i < 20; i++) {
                    if (_fontList[i + countSlideDown * 20] === undefined) break;
                    fontList.value.push(_fontList[i + countSlideDown * 20])
                }
            }
            countSlideDown++;
        }
    }
}, 100);

/*----字数统计选择----*/
const choiceArr = ref([true, false, false]);
const choice = (order: number) => {
    choiceArr.value = [false, false, false];
    choiceArr.value[order] = !choiceArr.value[order];
}
const showChoice = computed(() => {
    let tempStr = '';
    if (choiceArr.value[0]) tempStr = wordCount.value + ' 字';
    if (choiceArr.value[1]) tempStr = charCount.value + ' 个';
    if (choiceArr.value[2]) tempStr = paragraphs.value + ' 段';
    return tempStr;
})

/*----父组件调用子组件的方法----*/
// 导出文件
const myRef = ref();
const exp = (type: string) => {
    myRef.value.expFile(type);
}
// 设置字体
const selectFont = (i: number) => {
    myRef.value.setFont(fontList.value[i]);
    uWritingOption.value.uFont = fontList.value[i];
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}
// 修改字体大小
const fontSize = ref(uWritingOption.value.uFontSize);
const changeFontSize = () => {
    myRef.value.setFontSize(fontSize.value);
    uWritingOption.value.uFontSize = fontSize.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}
// 修改字体行高
const lineHeight = ref(uWritingOption.value.uLineHeight);
const changeLineHeight = () => {
    myRef.value.setLineHeight(lineHeight.value);
    uWritingOption.value.uLineHeight = lineHeight.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}
// 修改字体粗细
const fontWeight = ref(uWritingOption.value.uFontWeight);
const changeFontWeight = () => {
    myRef.value.setFontWeight(fontWeight.value);
    uWritingOption.value.uFontWeight = fontWeight.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}
// 修改段落间距
const segSpacing = ref(uWritingOption.value.uSpacing);
const changeSegSpacing = () => {
    myRef.value.setSegSpacing(segSpacing.value);
    uWritingOption.value.uSpacing = segSpacing.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}
// 修改段前缩进
const textIndent = ref(uWritingOption.value.uTextIndent);
const changeTextIndent = () => {
    myRef.value.setTextIndent(textIndent.value);
    uWritingOption.value.uTextIndent = textIndent.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}

// 获得子组件选择的color并修改字体颜色
const fontColor = ref(uWritingOption.value.uColor), bgcColor = ref(uWritingOption.value.uBgcColor);
const gradientColor = ref("linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)");
const getColor = () => {
    myRef.value.setColor(fontColor.value);
    uWritingOption.value.uColor = fontColor.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}
// 获得子组件选择的color并修改纸张背景色
const getBgcColor = () => {
    myRef.value.setBgcColor(bgcColor.value);
    uWritingOption.value.uBgcColor = bgcColor.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}
// 设置纸张类型
for (let item in paperSize.value) {
    paperSize.value[item].now = false;
    if (paperSize.value[item].type === uWritingOption.value.uPaperSize) {
        paperSize.value[item].now = true;
    }
}
const changePaperSize = (type: string) => {
    paperSize.value.forEach(item => {
        item.now = false;
        item.type === type ? item.now = true : null;
    });
    myRef.value.setPaperSize(type);
    uWritingOption.value.uPaperSize = type;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}

// 设置聚焦模式
const paraFocus = ref(uWritingOption.value.uParaFocus);
const changeParaFocus = () => {
    myRef.value.setParaFocus(paraFocus.value);
    uWritingOption.value.uParaFocus = paraFocus.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}

/*----左侧栏功能----*/
const onClickMenuItem = (tvid: string, tcid: string) => {
    if (tcid !== cid.value) {
        setScrollTop(<string>vid.value, <string>cid.value);
        vid.value = tvid;
        cid.value = tcid;
        myRef.value.setId(tvid, tcid);
        const toDisplay: Array<object> = [];

        db.opus.get(query_id).then(value => {
            if (value) {
                for (let i = 0; i < value.data.length; i++) {
                    if (value.data[i].vid === tvid) {
                        for (let j = 0; j < value.data[i].volume.length; j++) {
                            if (value.data[i].volume[j].cid === tcid) {
                                value.data[i].volume[j].chapter.forEach((item: string) => {
                                    toDisplay.push({
                                        type: "paragraph",
                                        content: [
                                            {
                                                type: "text",
                                                text: item
                                            }
                                        ]
                                    });
                                });
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            loadListData();
            myRef.value.refreshPaper(toDisplay);
        })
    }
}

// 左栏展开更多操作
const editVid1 = ref(''), editVid2 = ref(''), editVid3 = ref(''), showLeftMore = ref('');

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
            loadListData();
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
            loadListData();
        })
    }
}

// 删除章（移至废纸篓）
const deletedCid = ref('');
const deleteChapter = (dvid: string, dcid: string, cname: string) => {
    $modal.warning({
        title: "删除章",
        content: `目标章《${cname}》将放入废纸篓,并保留30天`,
        simple: true,
        onOk: () => {
            db.opus.where(':id').equals(query_id).modify(item => {
                for (let i = 0; i < item.data.length; i++) {
                    if (item.data[i].vid === dvid) {
                        for (let j = 0; j < item.data[i].volume.length; j++) {
                            if (item.data[i].volume[j].cid === dcid) {
                                item.data[i].volume[j].discard = true;
                                item.data[i].volume[j].discardTime = new Date().getTime();
                                break;
                            }
                        }
                        break;
                    }
                }
            }).then(() => {
                // 删除的目标是当前编辑的目标
                if (dvid === vid.value && dcid === cid.value) {
                    deletedCid.value = dcid;
                    myRef.value.refreshPaper([{
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: ''
                            }
                        ]
                    }]);
                } else {
                    loadListData();
                }
                $message.success('删除成功!');
            })
        }
    })
}

// 删除卷（移至废纸篓）
const deleteVolume = (vid: string, vname: string) => {
    $modal.warning({
        title: "删除卷",
        content: `目标卷【${vname}】将放入废纸篓,并保留30天`,
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
                loadListData();
                $message.success('删除成功!');
            })
        }
    })
}

// 点击添加章
const isNewChapter = ref(false), chapterName = ref('未命名章');
let volumeId: string; // 找到目标卷才能向里面push章
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
                    updateTime: new Date().getTime(),
                    chapter: ['HELLO 用户1234']
                });
                break;
            }
        }
    }).then(() => {
        isNewChapter.value = false;
        loadListData();
        $message.success('添加成功!');
    })
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
                chapter: ['HELLO 用户1234']
            }]
        });
    }).then(() => {
        isNewVolume.value = false;
        loadListData();
        $message.success('添加成功!');
    })
}

/*----右侧滚动条的样式设置----*/
const scrollbarColor = ref('#ccc');
const showScroll = () => {
    scrollbarColor.value = '#ccc';
}
const closeScroll = () => {
    scrollbarColor.value = '#f5f5f5';
}

const modify = () => {
    isRename.value = false;
    isNewVolume.value = false;
    isNewChapter.value = false;
}

// 获取列表数据
const router = useRouter();
const booksLists: { data: Array<Volume> } = reactive({ data: [] });
function loadListData() {
    db.opus.get(query_id).then(value => {
        if (value) {
            myRef.value.setBooksData(value);
            booksLists.data = value.data.filter((item: Volume) => {
                // 判断目标卷是否有删除标记
                return !item.discard;
            });
            booksLists.data.forEach((item: Volume) => {
                item.volume = item.volume.filter((it: Chapter) => {
                    // 判断目标章是否有删除标记
                    return !it.discard;
                })
            });
            if (booksLists.data.length === 0) {
                router.push({
                    path: '/detail',
                    query: {
                        type: 'opus',
                        id: query_id
                    }
                })
            }
            for (let i = 0; i < booksLists.data.length; i++) {
                if (booksLists.data[i].vid === vid.value) {
                    for (let j = 0; j < booksLists.data[i].volume.length; j++) {
                        if (booksLists.data[i].volume[j].cid === cid.value) {
                            (<HTMLElement>document.querySelector('.arco-layout-content')).scrollTop =
                                <number>booksLists.data[i].volume[j].scrollTop;
                            break;
                        }
                    }
                    break;
                }
            }
        }

    })
}

// 设置纸张距离顶部的高度（用户跳转至编辑位置
function setScrollTop(tvid: string, tcid: string) {
    db.opus.where(':id').equals(query_id).modify(item => {
        for (let i = 0; i < item.data.length; i++) {
            if (item.data[i].vid === tvid) {
                for (let j = 0; j < item.data[i].volume.length; j++) {
                    if (item.data[i].volume[j].cid === tcid) {
                        item.data[i].volume[j].scrollTop = temp_scrollTop;
                        break;
                    }
                }
                break;
            }
        }
    })
}
/*----自定义全局快捷键----*/
//获取路由参数确定详情页显示的目标
window.addEventListener('keydown', shortcut);
window.addEventListener('click', leftMoreControl);

function shortcut(e: KeyboardEvent) {
    if (deletedCid.value === cid.value) {
        // Ctrl+S
        if (e.ctrlKey === true && e.key === 's') $message.error('目标已被删除!');
    } else {
        // Ctrl+S
        if (e.ctrlKey === true && e.key === 's') myRef.value.saveDocData();
    }
}

function leftMoreControl() {
    showLeftMore.value = '';
}

</script>

<style scoped>
::-webkit-scro ::-webkit-scrollbar {
    width: 14px;
}

::-webkit-scrollbar-track {
    box-shadow: none;
    border-radius: 0;
    border-left: 1px dashed #e5e6eb;
}

::-webkit-scrollbar-thumb {
    background-color: v-bind(scrollbarColor);
    border-radius: 0;
    border-left: 1px dashed #e5e6eb;
}

.layout-write :deep(.arco-layout-header) {
    height: 35px;
    border-bottom: 2px dashed #e5e6eb;
    background-color: #fff;
}

.layout-write :deep(.arco-layout-content) {
    height: calc(100vh - 85px);
    min-width: 20px;
    background-color: #fff;
    overflow-y: scroll;
}

.sider-right {
    min-width: 50px;
}
.head-item {
    float: right;
    width: 100%;
}
.siderLeft {
    height: calc(100vh - 85px);
}
.siderLeft-btn {
    width: 20px;
    height: 20px;
    margin-right: 0px !important;
    margin-bottom: -4px;
    border-radius: 4px;
}
.siderLeft-btn:hover {
    background-color: #ddd;
    transition: background-color 0.3s;
}
/* 伸缩杆内容 */
.resizebox-demo {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    /* width: 100%; */
    width: 8px;
    height: 100%;
    background-color: #fff;
    /* background-color: #f5f5f5; */
}
/* .resizebox-demo::before,
.resizebox-demo::after {
    width: 6px;
    height: 6px;
    border: 1px solid red;
    content: "";
} */
.resizebox-demo-line {
    flex: 1;
    background-color: #e5e6eb;
}
.resizebox-demo-vertical {
    flex-direction: column;
}
.resizebox-demo-vertical .resizebox-demo-line {
    width: 2px;
    height: 100%;
    transition: background-color 0.2s;
}
.resizebox-demo-vertical .resizebox-demo-line:hover {
    width: 6px;
    background-color: #ccc;
}
.resizebox-demo-horizontal .resizebox-demo-line {
    height: 2px;
    transition: background-color 0.2s;
}
.resizebox-demo-horizontal .resizebox-demo-line:hover {
    width: 6px;
    background-color: #ccc;
}

/* 触发弹出框基本样式  */
.trigger {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 2px 4px 10px #0000001a;
}

.typeface {
    max-width: 180px;
    max-height: 500px;
    padding: 10px 0;
    overflow: scroll;
    transform: translateY(62px);
}

.typeface::-webkit-scrollbar-thumb {
    background-color: #e5e6eb;
}
.typeface::-webkit-scrollbar-track {
    border-left: none;
}
.typeface li {
    list-style-type: none;
    height: 30px;
    line-height: 30px;
    padding-left: 14px;
    padding-right: 20px;
    font-size: 16px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.headerBtn {
    background-color: #fff;
}
.headerBtn:hover {
    background-color: #f2f3f5;
}
.paper-size {
    width: 210px;
    max-width: 210px;
}
.paper-size li {
    font-size: 14px;
}
.paper-size li span:nth-child(1) {
    float: left;
}
.paper-size li span:nth-child(2) {
    float: right;
}

.typeface .typeface-head {
    /* font-weight: bold; */
    margin-bottom: 5px;
    border-bottom: 1px solid #e5e6eb;
    color: #fff;
    background-color: #3491fa;
}
.typeface .typeface-head:hover {
    background-color: #276dbc;
}
.typeface .typeface-head span {
    margin-right: 40px;
}
.typeface li:hover {
    background-color: #f2f3f5;
}

.topBtn {
    width: 100%;
    height: 30px;
    /* line-height: 30px; */
    color: #4e5969;
    background-color: #fff;
    border: none;
}
.topBtn span {
    line-height: 30px;
    margin-left: 10px;
    margin-top: -5px;
}
.topBtn:hover {
    background-color: #f2f3f5;
}

/* 弹窗 */
#modify-box {
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
}

#modify-box .box {
    position: relative;
    top: 50%;
    width: 550px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 4px;
    transform: translateY(-50%);
}

.box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    padding: 0 20px;
    border-bottom: 1px solid #e5e6eb;
}

.box-header .header-title {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
    color: #1d2129;
    font-weight: 500;
    font-size: 16px;
}

.box-header .header-close {
    margin-left: -12px;
    padding: 4px;
    color: #1d2129;
    font-size: 12px;
    cursor: pointer;
    border-radius: 50%;
}

.box-header .header-close:hover {
    background-color: #f2f3f5;
}

.box-body {
    position: relative;
    max-height: 300px;
    padding: 24px 20px;
    color: #1d2129;
    font-size: 14px;
}
.box-footer {
    box-sizing: border-box;
    width: 100%;
    padding: 16px 20px;
    text-align: right;
    border-top: 1px solid #e5e6eb;
}
</style>