<style lang="less">
.app {
    padding-top: 70px;

    .search {
        position: fixed;
        top: 0;
        /* 固定在顶部 */
        left: 0;
        /* 固定在左侧，可以根据需要调整为right或其他值 */
        width: 100%;
        /* 元素宽度，可根据需要调整 */
        z-index: 1000;
        /* 确保元素在页面上层，防止被其他内容遮挡 */
    }

    .monthColumn {
        padding-bottom: 30px;

        .imageGroup {
            column-count: 3;
            column-gap: 8px;
            break-inside: avoid;
        }

        .imageContainer {
            box-sizing: border-box;
            padding: 0;
            display: block;
            position: relative;
            margin-bottom: 8px;
            break-inside: avoid;
        }

        .image {
            width: 100%;
            height: auto;
            min-height: 80px;
            object-fit: cover;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            transition: all 0.2s ease;
        }

        .image:hover {
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        .group-title {
            font-size: 22px;
            color: rgba(98, 98, 98, 0.7);
            margin: 10px 0 10px 0;
        }
    }

    /* 响应式瀑布流 */
    @media (max-width: 768px) {
        .monthColumn .imageGroup {
            column-count: 3;
            column-gap: 6px;
        }

        .monthColumn .imageContainer {
            margin-bottom: 6px;
        }
    }

    @media (max-width: 480px) {
        .monthColumn .imageGroup {
            column-count: 3;
            column-gap: 4px;
        }

        .monthColumn .imageContainer {
            margin-bottom: 4px;
        }
    }
}

.fab-upload {
    position: fixed;
    right: 24px;
    bottom: 80px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    z-index: 2000;
    background: linear-gradient(135deg, #36d1c4 0%, #5b86e5 100%);
    border: none;
    color: #fff;
    transition: box-shadow 0.2s, background 0.2s;
}

.fab-upload:active {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    background: linear-gradient(135deg, #5b86e5 0%, #36d1c4 100%);
}
</style>

<template>
    <div class="tabBar-app app">
        <!--搜索-->
        <div action="/" class="search">
            <van-search v-model="searchValue" show-action placeholder="请输入搜索关键词" @search="search">
                <template #action>
                    <div @click="search">搜索</div>
                </template>
            </van-search>
        </div>

        <!--按月分栏-->
        <div v-for="(date, index) in dateList" :key="index">
            <div class="monthColumn">
                <div class="group-title">{{ date }}</div>
                <div class="imageGroup">
                    <div class="imageContainer" v-for="(item, imgIndex) in groupedByDate[date]" :key="imgIndex">
                        <img class="image" @click="showPicture(imgIndex, groupedByDate[date])"
                            :src="item.file.previewUrl" :initial-index="imgIndex" alt="保存中..." />
                    </div>
                </div>
            </div>
        </div>

        <!-- 悬浮上传按钮 -->
        <van-button class="fab-upload" type="primary" icon="plus" @click="goUpload" />

        <!--TabBar-->
        <TarBar active="search"></TarBar>
        <!--大图浏览-->
        <van-image-preview />
    </div>
</template>

<script>
import common from "../../util/common";
import { ref } from 'vue';
import TarBar from "./components/TabBar.vue";
import data from "../../util/data";
import DateUtil from "../../util/DateUtil";
import { showImagePreview } from "vant";
import { useRouter } from 'vue-router';

export default {
    name: "album",
    components: { TarBar },
    setup() {
        const active = ref('home');
        const router = useRouter();
        const goUpload = () => {
            router.push('/album/upload');
        };
        return {
            active,
            goUpload
        };
    },
    mounted() {
        this.pageList();

    },
    data() {
        return {
            searchValue: '',
            active: '',
            dataList: [],
            dateList: [],
            groupedByDate: {},

        }
    },
    methods: {
        search() {
            let { searchValue } = this;
            let groupedByDate = [];
            console.log(searchValue)
            common.post({
                url: '/resourceFile/search',
                params: {
                    keyword: searchValue
                },
                success: (res) => {
                    let list = res.data.data;
                    list.forEach(item => {
                        item.file.url = data.STATIC_SERVER + item.file.url;
                        item.file.previewUrl = data.STATIC_SERVER + item.file.previewUrl;

                        // 解析createTime并按日分组
                        let date = DateUtil.formatDate(item.createTime);
                        console.log(date)
                        if (!groupedByDate[date]) {
                            groupedByDate[date] = []; // 如果这个日期还没有初始化数组，则初始化一个
                        }
                        groupedByDate[date].push(item); // 将当前项添加到对应日期的数组中
                    });
                    console.log(groupedByDate)
                    this.groupedByDate = groupedByDate; // 将分组后的数据赋值给dataList
                    this.dateList = Object.keys(groupedByDate);
                }
            })
        },

        pageList(keyword) {
            let { groupedByDate } = this;
            common.post({
                url: '/resourceFile/list',
                params: {},
                success: (res) => {
                    let list = res.data;
                    console.log(res)
                    if (list.length === 0) {
                        // TODO: 展示无数据
                    }
                    list.forEach(item => {
                        //dealStatus不等于2不显示
                        /*if (item.dealStatus !== 2) {
                            return;
                        }*/

                        item.file.url = data.STATIC_SERVER + item.file.url;
                        item.file.previewUrl = data.STATIC_SERVER + item.file.previewUrl;

                        // 解析createTime并按日分组
                        let date = DateUtil.formatDate(item.createTime);
                        if (!groupedByDate[date]) {
                            groupedByDate[date] = []; // 如果这个日期还没有初始化数组，则初始化一个
                        }
                        groupedByDate[date].push(item); // 将当前项添加到对应日期的数组中
                    });


                    console.log(groupedByDate)
                    this.groupedByDate = groupedByDate; // 将分组后的数据赋值给dataList
                    this.dateList = Object.keys(groupedByDate);
                }
            })
        },


        /**
         * 显示图片
         * @param index 索引
         * @param imageList 图片列表
         */
        showPicture(index, imageList) {
            showImagePreview({
                images: imageList.map(item => item.file.url),
                showIndex: true,
                startPosition: index,
                closeable: true,
                showIndicators: false,
            });
        }
    }
}
</script>