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
            padding: 3px 5px 0 0;
            max-width: 33.33333333%;
            display: block;
            box-sizing: border-box;
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
                @search="onSearch"
            >
                <template #action>
                    <div @click="onSearch(searchValue)">搜索</div>
                </template>
            </van-search>
        </div>


        <!--按月分栏-->
        <div v-for="(item, index) in 12" :key="index">
            <div class="monthColumn">
                <div class="group-title">2024年4月</div>
                <div class="imageGroup">
                    <div class="imageContainer">
                        <van-image fit="cover" src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"/>
                    </div>
                    <div class="imageContainer">
                        <van-image fit="cover" src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"/>
                    </div>
                    <div class="imageContainer">
                        <van-image fit="cover" src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"/>
                    </div>
                    <div class="imageContainer">
                        <van-image fit="cover" src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"/>
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

export default {
    name: "album",
    components: {TarBar},
    setup() {
        const active = ref('home');


        const searchValue = ref('');
        const onSearch = (value) => {
            common.showTips(`搜索 ${value}`);
        };

        return {
            active,


            searchValue,
            onSearch,
        };
    },
    data() {
        return {
            searchValue: '',
            active: '',
        }
    },
    methods: {}
}
</script>