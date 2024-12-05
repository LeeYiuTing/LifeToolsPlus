<template>
    <div class="home">
        <van-nav-bar
            title="功能列表"
        />
        <van-grid :column-num="3">
            <van-grid-item
                v-for="(funcName,index) in funcList"
                :key="index"
                :text="funcName"
                icon="home-o"
                @click="handleClick(index)"
            />
        </van-grid>
    </div>
</template>

<script>
import { ref } from 'vue';
import { Grid, GridItem } from 'vant';
import router from "../router/router";

export default {
    name: 'Home',
    components: {
        [Grid.name]: Grid,
        [GridItem.name]: GridItem,
    },
    setup() {
        const funcList = ref([
            "出门",
            "相册",
            "日语学习",
        ]);

        const handleClick = (index) => {
            // 这里可以添加点击宫格后的逻辑
            console.log(funcList.value)
            const funcName = funcList.value[index];
            console.log(`点击了宫格 ${index}`,'功能是：',funcName);
            switch (funcName) {
                case "出门":
                    router.push({
                        path: 'goOut',
                    });
                    break;
                case "相册":
                    router.push({
                        path: 'album',
                    });
                    break;
                case "日语学习":
                    router.push({
                        path: 'jpLearnSet',
                    });
                    break;
                case "商品":
                    router.push({
                        path: 'good',
                    });
                    break;
                default:
                    break;
            }
        };

        return {
            //data
            funcList,
            //func
            handleClick,
        };
    },
};
</script>

<style scoped>
.home {
    padding: 16px;
}
</style>
