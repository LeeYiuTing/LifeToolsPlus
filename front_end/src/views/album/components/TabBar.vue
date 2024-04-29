<!-- TabBar.vue -->
<template>
    <van-tabbar v-model="localActive" >
        <van-tabbar-item name="search" to="/album" icon="search">搜索</van-tabbar-item>
        <van-tabbar-item name="upload" to="/album/upload" icon="home-o">上传</van-tabbar-item>
        <van-tabbar-item name="tag" icon="friends-o">标签管理</van-tabbar-item>
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
            console.log(name)
            this.localActive = name;
            //this.onChange(name);

            switch (name) {
                case 'search':
                    this.$router.push('/album',);
                    break;
                case 'upload':
                    this.$router.push('/album/upload');
                    break;
                case 'tag':
                    this.$router.push('/album/tag');
                    break;
                case 'setting':
                    this.$router.push('/album/setting');
                    break;
            }
        }
    },
    watch: {
        active(newVal) {
            this.localActive = newVal;
        }
    }
};
</script>

<style scoped>
/* 如果有额外样式，请在这里添加 */
</style>
