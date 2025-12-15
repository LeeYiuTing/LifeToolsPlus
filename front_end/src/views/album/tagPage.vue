<script lang="ts">
import {defineComponent} from 'vue'
import TarBar from "./components/TabBar.vue";
import common from "../../util/common";
import { showImagePreview } from 'vant';

export default defineComponent({
name: "tagPage",
    components: {TarBar},
    setup() {
        return {}
    },
    mounted() {
    },
    data() {
        return {}
    },
    methods: {
        showPicture() {
            showImagePreview({
                images: [
                    'https://img01.yzcdn.cn/vant/apple-1.jpg',
                    'https://img01.yzcdn.cn/vant/apple-2.jpg',
                ],
                showIndex: true,
                startPosition: 1,
            });
        },
        showMsg() {
            common.showTips('提示信息', 'success')
        }
    }
})

</script>

<template>
    <div class="tabBar-app app">
        <van-button @click="showPicture">按钮</van-button>
        <van-button @click="showMsg">按钮2</van-button>
        <van-image-preview />
        <!--TabBar-->
        <TarBar active="tagPage" ></TarBar>
    </div>
</template>

<style scoped lang="less">

</style>