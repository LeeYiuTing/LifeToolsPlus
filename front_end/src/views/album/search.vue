<style scoped lang="less">
.app {
    padding-top: 70px;

    .search {
        position: fixed;
        top: 0; /* 固定在顶部 */
        left: 0; /* 固定在左侧，可以根据需要调整为right或其他值 */
        width: 100%; /* 元素宽度，可根据需要调整 */
        z-index: 1000; /* 确保元素在页面上层，防止被其他内容遮挡 */
    }

    .monthColumn {
        padding-bottom: 30px;

        .imageGroup {
            display: flex;
            flex-wrap: wrap;
        }

        .imageContainer {
            display: flex;
            justify-content: space-between;
            box-sizing: border-box;
            padding:3px;
            .image{
                width: 110px;
                height: 80px;
            }
        }
    }
}
</style>

<template>
    <div class="tabBar-app app">
        <!--搜索-->
        <div action="/" class="search">
            <van-search
                v-model="searchValue"
                show-action
                placeholder="请输入搜索关键词"
                @search="pageList"
            >
                <template #action>
                    <div @click="pageList(searchValue)">搜索</div>
                </template>
            </van-search>
        </div>


        <!--按月分栏-->
        <div v-for="(item, index) in dateList" :key="index">
            <div class="monthColumn">
                <div class="group-title">{{ item }}</div>
                <div class="imageGroup">
                    <div class="imageContainer" v-for="item in groupedByDate[item]">
                        <van-image class="image" fit="cover" :src="item.file.previewUrl"/>
                    </div>
                </div>
            </div>
        </div>

        <!--TabBar-->
        <TarBar active="search"></TarBar>
    </div>
</template>

<script>

import common from "../../util/common";
import {ref} from 'vue';
import TarBar from "./components/TabBar.vue";
import data from "../../util/data";

export default {
    name: "album",
    components: {TarBar},
    setup() {
        const active = ref('home');
        const searchValue = ref('');


        return {
            active,
            searchValue,
        };
    },
    mounted() {
        this.pageList();
    },
    data() {
        return {
            searchValue: '',
            active: '',
            dataList:[],
            dateList:[],
            groupedByDate: {},
        }
    },
    methods: {
        pageList(keyword) {
            let {groupedByDate} = this;
            common.post({
                url: '/resourceFile/list',
                params: {},
                success: (res) => {
                    let list = res.data.data;

                    list.forEach(item => {
                        item.file.url = data.STATIC_SERVER + item.file.url;
                        item.file.previewUrl = data.STATIC_SERVER + item.file.previewUrl;

                        // 解析createTime并按日分组
                        const date = new Date(item.createTime).toDateString(); // 将createTime转换为日期字符串（忽略时间部分）
                        if (!groupedByDate[date]) {
                            groupedByDate[date] = []; // 如果这个日期还没有初始化数组，则初始化一个
                        }
                        groupedByDate[date].push(item); // 将当前项添加到对应日期的数组中
                    });
                    console.log(groupedByDate)
                    this.groupedByDate = groupedByDate; // 将分组后的数据赋值给dataList
                    this.dateList = Object.keys(groupedByDate);
                },
                fail: (res) => {
                    console.log('error', res);
                }
            })
        }
    }
}
</script>