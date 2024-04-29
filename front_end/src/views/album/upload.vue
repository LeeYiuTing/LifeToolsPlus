<style scoped lang="less">
.app {
    .group-title {
        font-size: 17px;
        //水平居中
        //text-align: center;
        //淡点的黑色
        color: rgba(0, 0, 0, 0.5);
        margin-top: 10px;

    }

    .upload-icon {
        font-size: 23px;
        padding: 28px;
        color: rgba(0, 0, 0, 0.2);
        //边框
        border: 1px solid rgba(0, 0, 0, 0.1);
        //圆角
        border-radius: 10px;
    }

    .upload-group {
        padding-bottom: 30px;
    }

    .image-info {
        .image-info-form {
            padding-bottom: 20px;

            .image {
                width: 100px;
                height: 100px;
            }
        }
    }
}
</style>

<template>
    <!--标题栏-->
    <van-nav-bar
        title="上传"
        left-text=""
        right-text=""
        left-arrow
        @click-left=""
        @click-right=""
    />
    <div class="app tabBar-app">
        <van-divider content-position="center">选择上传图片</van-divider>

        <!--上传组件-->
        <van-uploader
            class="upload-group"
            v-model="fileList"
            multiple
            :beforeRead="uploadCheck"
            :max-count="10"
        >
            <van-icon class="upload-icon" name="photograph"/>
        </van-uploader>

        <div class="image-info" v-if="fileList.length>0">
            <van-divider content-position="center">图片信息设置</van-divider>
            <div class="image-info-form" v-for="(item,imageIndex) in fileList">
                <van-divider content-position="left">图片{{ imageIndex + 1 }}</van-divider>
                <van-form @submit="">
                    <van-cell-group>
                        <van-field
                            v-model="item.file.name"
                            name="图片名称"
                            label="图片名称"
                            placeholder="请输入图片名称"
                        />
                        <van-field label="图片">
                            <template #input>
                                <van-image class="image" fit="cover" :src="item.objectUrl"/>
                            </template>
                        </van-field>
                        <van-field label="标签">
                            <template #input>
                                <van-space wrap :size="[10,6]">
                                    <div v-for="(item,tagIndex) in item.file.tags">
                                        <van-badge>
                                            <van-tag class="tag bottom" plain type="primary">{{ item }}</van-tag>
                                            <template #content>
                                                <van-icon name="cross" class="badge-icon" @click="delTag(imageIndex,tagIndex)"/>
                                            </template>
                                        </van-badge>
                                    </div>
                                    <van-button class="bottom" size="mini" icon="add">选择</van-button>
                                    <van-button class="bottom" size="mini" icon="edit" @click="clickInputTag(imageIndex)">输入</van-button>
                                </van-space>
                            </template>
                        </van-field>
                    </van-cell-group>
                </van-form>
            </div>
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                    提交
                </van-button>
            </div>
        </div>

        <!-- 下方弹出 -->
        <van-popup
            v-model:show="showTagInput"
            position="bottom"
            :style="{ height: '25%' }"
        >
            <template #default>
                <van-form>
                    <van-divider content-position="center">自定义标签</van-divider>
                    <van-cell-group inset>
                        <van-field v-model="tempTagName" label="标签名" placeholder="使用空格分隔多个标签"/>
                    </van-cell-group>
                </van-form>
                <div style="margin: 16px;">
                    <van-button round block type="primary" @click="addTag">
                        添加
                    </van-button>
                </div>
            </template>
        </van-popup>

        <!--TabBar-->
        <TarBar active="upload"></TarBar>
    </div>
</template>

<script setup>
import TarBar from "./components/TabBar.vue";
import {ref, triggerRef, watch} from "vue";

const fileList = ref([]);
let showTagInput = ref(false);
let tempTagName = ref('');
let currentEditImage = ref(null);

//上传检查方法uploadCheck
const uploadCheck = (file) => {
    file.tags = [];
    //检查文件大小
    return true;
}



//点击手动输入标签
const clickInputTag = (index) =>{
    showTagInput.value = true;
    currentEditImage.value = index;
}

//手动添加标签
const addTag = () => {
    let value = tempTagName.value;
    if (!value) {
        showTagInput.value = false;
        return;
    }
    let target = fileList.value[currentEditImage.value];

    const tags = value.split(' ');
    tags.forEach(item => {
        target.file.tags.push(item);
    });
    showTagInput.value = false;
}

//删除标签
const delTag = (imageIndex,tagIndex) => {
    let target = fileList.value[imageIndex];
    target.file.tags.splice(tagIndex, 1);
    triggerRef(fileList);
}

watch(showTagInput, (newVal, oldVal) => {
    if (!newVal) {
        tempTagName.value = '';
    }
})

const data=()=>{

}

</script>