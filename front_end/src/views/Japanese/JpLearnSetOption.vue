<template>
    <div class="JpLearnSetOption">
        <van-nav-bar
            title="假名闯关设置"
        />
        <div class="form-title">假名选择</div>
        <van-radio-group v-model="kanaType">
            <van-cell-group inset>
                <van-cell title="平假" clickable @click="kanaType = '1'">
                    <template #right-icon>
                        <van-radio name="1"/>
                    </template>
                </van-cell>
                <van-cell title="片假" clickable @click="kanaType = '2'">
                    <template #right-icon>
                        <van-radio name="2"/>
                    </template>
                </van-cell>
            </van-cell-group>
        </van-radio-group>

        <div class="form-title">行数选择</div>
        <van-cell-group inset>
            <van-field label="行数">
                <template #button>
                    <van-stepper v-model="rowNum"/>
                </template>
            </van-field>
        </van-cell-group>

<!--        <div class="form-title">包含混淆</div>
        <van-cell-group inset>
            <van-cell center :title="obfuscation ? '是' : '否'">
                <template #right-icon>
                    <van-switch v-model="obfuscation"/>
                </template>
            </van-cell>
        </van-cell-group>-->

        <van-button round type="success" size="large" @click="goLearn" class="bottom-button">Go!</van-button>
    </div>
</template>

<script>
import {ref} from 'vue';
import router from "../../router/router";

export default {
    name: 'JpLearnSetOption',
    setup() {
        const kanaType = ref('1');
        const rowNum = ref(1);
        const obfuscation = ref(false);

        const goLearn = () => {
            //跳转
            router.push(
                {
                    path: '/JpLearn',
                    query: {
                        kanaType: kanaType.value,
                        rowNum: rowNum.value,
                        obfuscation: obfuscation.value,
                    }
                }
                )
        };
        return {
            //data
            kanaType,
            rowNum,
            obfuscation,
            //func
            goLearn,
        };
    },
};

</script>

<style scoped lang="less">
.JpLearnSetOption {
    .stepper-right {
        /* 设置步进器为inline-block，以便与输入框在同一行显示 */
        display: inline-block;
        /* 移除默认的边距 */
        margin: 0;
        /* 根据需要调整垂直对齐 */
        vertical-align: middle;
    }
}
</style>