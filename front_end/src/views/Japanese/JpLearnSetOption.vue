<template>
    <div class="JpLearnSetOption">
        <van-nav-bar
            title="假名闯关设置"
        />
        <div class="form-title">假名选择</div>
        <van-radio-group v-model="kanaType">
            <van-cell-group inset>
                <van-cell title="平假" clickable @click="kanaType = 1">
                    <template #right-icon>
                        <van-radio :name="1"/>
                    </template>
                </van-cell>
                <van-cell title="片假" clickable @click="kanaType = 2">
                    <template #right-icon>
                        <van-radio :name="2"/>
                    </template>
                </van-cell>
            </van-cell-group>
        </van-radio-group>

        <div class="form-title">题型</div>
        <van-radio-group v-model="quesType">
            <van-cell-group inset>
                <van-cell title="听音" clickable @click="quesType = 1">
                    <template #right-icon>
                        <van-radio :name="1"/>
                    </template>
                </van-cell>
                <van-cell title="听写" clickable @click="quesType = 2">
                    <template #right-icon>
                        <van-radio :name="2"/>
                    </template>
                </van-cell>
            </van-cell-group>
        </van-radio-group>

        <div class="form-title">行数选择</div>


        <div class="form-title">行数选择</div>
        <van-cell-group inset>
            <van-field label="行数">
                <template #button>
                    <van-stepper v-model="rowNum" :max="19"/>
                </template>
            </van-field>
            <van-field v-for="index in rowNum">
                <template #left-icon>
                    <van-row gutter="28" justify="space-between">
                        <van-col v-for="item in kanaList[index]"><div class="show-kana">{{kanaType === 1 ? item.Hiragana　: item.Katakana}}</div></van-col>
                    </van-row>
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

        <van-button round type="success" size="large" @click="goLearn" class="lock-to-bottom">Go!</van-button>
    </div>
</template>

<script>
import {ref} from 'vue';
import router from "../../router/router";
import hanaList from "/src/config/kana.json";

export default {
    name: 'JpLearnSetOption',
    setup() {
        const kanaType = ref(1);
        const rowNum = ref(1);
        const quesType = ref(1);
        const obfuscation = ref(false);
        const kanaList = ref(hanaList);

        //去学习
        const goLearn = () => {
            let path = "/JpLearnTY";
            if (quesType.value === 2) {
                path = "/JpLearnTX";
            }
            //跳转
            router.push(
                {
                    path: path,
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
            kanaList,
            quesType,
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
    .show-kana {
        font-size: 17px;
        width: 18px;
    }
}
</style>