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

    .upload-center-btn-wrap {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 0;
        z-index: 10;
    }

    .upload-center-btn {
        width: 180px;
        height: 60px;
        font-size: 22px;
        border-radius: 32px;
        background: #f5f7fa;
        color: #36d1c4;
        border: 1.5px solid #e0e0e0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        transition: background 0.2s, box-shadow 0.2s;
    }

    .upload-center-btn:active {
        background: #e6f7f7;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }
}

.app.tabBar-app {
    position: relative;
    min-height: 60vh;
}
</style>

<template>
    <!--标题栏-->
    <van-nav-bar title="上传" left-text="" right-text="" left-arrow @click-left="" @click-right="" />
    <div class="app tabBar-app">
        <!-- <van-divider content-position="center">选择上传图片</van-divider> -->

        <!--自定义大按钮触发上传-->
        <div class="upload-center-btn-wrap" v-if="fileList.length === 0">
            <van-button class="upload-center-btn" type="primary" icon="plus" @click="triggerUploader">选择图片</van-button>
        </div>

        <!--上传组件-->
        <van-uploader ref="uploaderRef" class="upload-group" v-model="fileList" multiple :beforeRead="asyncBeforeRead"
            :max-hotCount="10" :show-upload="false">
            <van-icon v-if="fileList.length > 0" class="upload-icon" name="photograph" />
        </van-uploader>

        <div class="image-info" v-if="fileList.length > 0">
            <van-divider content-position="center">统一标签设置</van-divider>
            <div class="image-info-form">
                <van-cell-group>
                    <van-field label="标签">
                        <template #input>
                            <van-space wrap :size="[10, 6]">
                                <div v-for="(item, tagIndex) in unifyTag">
                                    <van-badge>
                                        <van-tag class="tag bottom" plain type="primary">{{ item }}</van-tag>
                                        <template #content>
                                            <van-icon name="cross" class="badge-icon" @click="delTag(undefined)" />
                                        </template>
                                    </van-badge>
                                </div>
                                <van-button class="bottom" size="mini" icon="add">选择</van-button>
                                <van-button class="bottom" size="mini" icon="edit" @click="clickInputTag(undefined)">输入
                                </van-button>
                            </van-space>
                        </template>
                    </van-field>
                </van-cell-group>
            </div>
        </div>

        <div class="image-info" v-if="fileList.length > 0">
            <van-divider content-position="center">独立标签设置</van-divider>
            <div class="image-info-form" v-for="(item, imageIndex) in fileList">
                <van-form @submit="">
                    <van-cell-group>
                        <van-field :label="'图片' + (imageIndex + 1)">
                            <template #input>
                                <van-image class="image" fit="cover" :src="item.objectUrl" />
                            </template>
                        </van-field>
                        <van-field label="标签">
                            <template #input>
                                <van-space wrap :size="[10, 6]">
                                    <div v-for="(item, tagIndex) in item.file.tags">
                                        <van-badge>
                                            <van-tag class="tag bottom" plain type="primary">{{ item }}</van-tag>
                                            <template #content>
                                                <van-icon name="cross" class="badge-icon"
                                                    @click="delTag(imageIndex, tagIndex)" />
                                            </template>
                                        </van-badge>
                                    </div>
                                    <van-button class="bottom" size="mini" icon="add">选择</van-button>
                                    <van-button class="bottom" size="mini" icon="edit"
                                        @click="clickInputTag(imageIndex)">输入
                                    </van-button>
                                </van-space>
                            </template>
                        </van-field>
                    </van-cell-group>
                </van-form>
            </div>
            <div style="margin: 16px;">
                <van-button round block type="primary" @click="submit">
                    提交
                </van-button>
            </div>
        </div>

        <!-- 下方弹出 -->
        <van-popup v-model:show="showTagInput" position="bottom" :style="{ height: '25%' }">
            <template #default>
                <van-form>
                    <van-divider content-position="center">自定义标签</van-divider>
                    <van-cell-group inset>
                        <van-field v-model="tempTagName" label="标签名" placeholder="使用空格分隔多个标签" />
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
import { ref, triggerRef, watch } from "vue";
import common from "../../util/common";
import router from "../../router/router";

const fileList = ref([]);
const unifyTag = ref([]);
let showTagInput = ref(false);
let tempTagName = ref('');
let currentEditImage = ref(null);
const uploaderRef = ref();

// 上传检查方法
const asyncBeforeRead = async (files) => {
    // 确保files是一个数组
    const filesArray = Array.isArray(files) ? files : [files];

    // 使用map创建一个promise数组，每个文件都通过check函数处理
    const promises = filesArray.map(file => {
        return new Promise((resolve, reject) => {
            if (file.type === 'image/webp') {
                console.log('有webp图片');
                // 创建一个FileReader来读取文件
                const reader = new FileReader();
                reader.onload = function (event) {
                    // 创建一个Image对象
                    const img = new Image();
                    img.onload = function () {
                        // 创建一个Canvas
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, img.width, img.height);
                        // 将Canvas内容转换为JPG
                        canvas.toBlob((blob) => {
                            // 创建一个新的File对象
                            const newFile = new File([blob], file.name.replace('.webp', '.jpg'), { type: 'image/jpeg' });
                            // 这里可以继续处理新的JPG文件
                            console.log('Conversion successful, new file:', newFile);
                            common.showTips('已将webp自动转为jpg', 'success');
                            newFile.tags = [];
                            resolve(newFile);
                        }, 'image/jpeg', 0.92); // 0.92是JPG的质量参数
                    };
                    img.onerror = () => {
                        console.error('Image load error');
                        reject(new Error('Image load error'));
                    };
                    img.src = event.target.result;
                };
                reader.onerror = () => {
                    console.error('FileReader error');
                    reject(new Error('FileReader error'));
                };
                reader.readAsDataURL(file);
            } else {
                file.tags = [];
                resolve(file);
            }
        });
    });

    return Promise.all(promises)
        .then(results => {
            console.log('All files processed:', results);
            return results;
        })
        .catch(error => {
            console.error('Error processing files:', error);
            throw error;
        });
}


//点击手动输入标签
const clickInputTag = (index) => {
    showTagInput.value = true;
    if (index === undefined) {
        currentEditImage.value = null;
    } else {
        currentEditImage.value = index;
    }
}

//手动添加标签
const addTag = () => {
    //前后去空格
    let value = tempTagName.value.trim();
    if (!value) {
        showTagInput.value = false;
        return;
    }
    const tags = value.split(' ');
    if (currentEditImage.value === null) {
        tags.forEach(item => {
            unifyTag.value.push(item);
        });
        //去重一下
        unifyTag.value = [...new Set(unifyTag.value)];
    } else {
        let target = fileList.value[currentEditImage.value];
        tags.forEach(item => {
            target.file.tags.push(item);
        });
        //去重一下
        target.file.tags = [...new Set(target.file.tags)];
    }
    showTagInput.value = false;
}

//删除标签
const delTag = (imageIndex, tagIndex) => {
    if (imageIndex === undefined) {
        unifyTag.value.splice(tagIndex, 1);
    } else {
        let target = fileList.value[imageIndex];
        target.file.tags.splice(tagIndex, 1);
        triggerRef(fileList);
    }
}

watch(showTagInput, (newVal, oldVal) => {
    if (!newVal) {
        tempTagName.value = '';
    }
})

const submit = () => {
    let value = fileList.value;
    value.forEach(item => {
        let formData = new FormData();

        formData.append('file', item.file);

        if (item.file.tags) {
            item.file.tags.forEach(item => {
                formData.append('tags', item);
            });
        }
        common.uploadToServer({
            url: '/resourceFile/add',
            params: formData,
            success: (res) => {
                console.log('上传成功')
                common.showTips('上传成功', 'success')
                //回到search页
                router.push('/album');
            },
            fail: (res) => {
                console.log('上传失败')
                console.log(res.msg);
            }
        })
    })
}

const triggerUploader = () => {
    if (uploaderRef.value) {
        uploaderRef.value.chooseFile();
    }
};

</script>