<!-- TabBar.vue -->
<template>
    <van-tabbar v-model="localActive" @change="handleChange">
        <van-tabbar-item name="search" to="/album/search" icon="search">搜索</van-tabbar-item>
        <!-- <van-tabbar-item name="upload" to="/album/upload" icon="home-o">上传</van-tabbar-item> -->
        <van-tabbar-item name="tagPage" to="/album/tagPage" icon="friends-o">标签管理</van-tabbar-item>
        <van-tabbar-item name="setting" icon="setting-o">设置</van-tabbar-item>
    </van-tabbar>
</template>

<script>
export default {
    name: 'AlbumTabBar',
    props: {
        active: {
            type: String,
            default: 'search'
        },

    },
    data() {
        return {
            localActive: this.active
        };
    },
    methods: {
        handleChange(name) {
            this.localActive = name;
            console.log('name', name);
        }
    },
    watch: {

    }
};
</script>

<style scoped>
/* 如果有额外样式，请在这里添加 */
</style>
