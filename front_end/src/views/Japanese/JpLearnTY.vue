<template>
    <div class="JpLearn">
        <van-nav-bar
            title="假名听音"
            left-text="返回"
            left-arrow
            @click-left="router().back()"
        />

        <!--进度-->
        <div class="form-title"></div>
        <div class="form-title"></div>
        <div class="step-Line">
            <van-progress inactive :percentage="(((kanaIndex-1)/rangeList.length) * 100).toFixed(2)"/>
        </div>
        <div class="form-title"></div>
        <div class="step-text">{{ kanaIndex > rangeList.length ? rangeList.length : kanaIndex }}/{{ rangeList.length }}</div>
        <div class="form-title"></div>

        <!--字图-->
        <van-row justify="center">
            <van-col>
                <div class="alias-layout">
                    <div class="alias-text" v-for="(item,index) in randomKanaList" @click="clickKana(item)">
                        {{ item.kana }}
                    </div>
                </div>
            </van-col>
        </van-row>

        <!--功能区-->

        <van-row class="lock-to-bottom" justify="center" gutter="100">
            <van-col @click="playAudio">
                <van-button round type="success" size="large" class="lock-to-bottom">重听</van-button>
            </van-col>
        </van-row>
    </div>
</template>

<script>
import common from "../../util/common";
import router from "../../router/router";
import kana from "/src/config/kana.json";

export default {
    name: 'JpLearnTY',
    data() {
        return {
            kanaList: kana,
            randomKanaList: [],
            audioPlayer: new Audio(),
            target: {},
            rangeList: [],
            kanaType: 0,
            rowNum: 0,

            learnNum: 0,
            kanaIndex: 0,
        };
    },
    mounted() {
        let query = this.$route.query;
        console.log('query', query)
        this.rowNum = Number(query.rowNum);
        this.kanaType = Number(query.kanaType);
        this.learnNum = 5 * this.rowNum;

        this.collectKana();
    },
    methods: {
        router() {
            return router
        },

        /**
         * 整理假名
         */
        collectKana() {
            // 全部假名
            let allKana = this.kanaList;

            //取出要学习的假名
            let targetList = [];
            let rowList = allKana.slice(0, this.rowNum)
            rowList.forEach(row=>{
                row.forEach(item=>{
                    if (item.Hiragana) {
                        targetList.push(item);
                    }
                })
            })
            console.log(this.kanaType)
            targetList.forEach(item => {
                if (this.kanaType === 1 || this.kanaType === 3) {
                    // 平假
                    item.kana = item.Hiragana;
                } else if (this.kanaType === 2) {
                    // 片假
                    item.kana = item.Katakana;
                }
            })

            targetList = common.shuffleArray(targetList);

            this.rangeList = targetList;

            this.next();
        },

        /**
         * 随机抽取3个假名
         * @returns {*[]}
         */
        randomGetFourKana() {
            // 用于存放随机抽取的不同的假名
            let {rangeList, target} = this;
            let list = [];
            list.push(target);

            let randomGet = () => {
                let index = Math.floor(Math.random() * rangeList.length);
                return rangeList[index];
            };

            let addKana = () => {
                let item = randomGet();
                if (!list.includes(item)) {
                    list.push(item);
                } else {
                    addKana();
                }
            };

            // 循环以确保我们得到不同的假名
            while (list.length < 4) {
                addKana();
            }

            return list;
        },

        next() {
            let {randomKanaList, rangeList, kanaIndex, learnNum} = this;
            //判断是否还有
            if (kanaIndex >= rangeList.length) {
                console.log('全部完成')
                this.kanaIndex += 1
                common.showTips('全部完成 !', 'success');
                setTimeout(() => {
                    router.back()
                }, 1000)
            } else {
                //还有
                // 随机抽取4个假名
                this.target = rangeList[kanaIndex];
                this.kanaIndex = kanaIndex + 1;
                randomKanaList = this.randomGetFourKana();

                //打乱
                this.randomKanaList = common.shuffleArray(randomKanaList);

                //首次播放
                this.playAudio();
            }
        },

        playAudio() {
            let {audioPlayer, target} = this;
            audioPlayer.src = target.audio;
            audioPlayer.play().catch(error => {
                // 处理错误
                common.showTips('首次请手动点击播放', 'success');
            });
        },

        /**
         * 点击假名
         * @param item
         */
        clickKana(item) {
            let {target} = this;
            if (item.Hiragana === target.Hiragana) {
                //答对
                common.showNotify("回答正确", "success");

                common.showTips('前往下一个 !', 'loading');
                setTimeout(() => {
                    this.next();
                }, 800)
            } else {
                //答错
                common.showTips('答错咯', 'fail');
                this.playAudio();
            }
        }

        //end
    },
}


</script>

<style scoped lang="less">
.JpLearn {
    height: 100%;
    .step-text {
        //居中
        text-align: center;
        //字体
        font-size: 40px;
        color: #888888;
    }

    .step-Line {
        //居中
        text-align: center;
        //字体
        font-size: 40px;
        color: #888888;
        width: 72%;
        //整体居中
        margin: 0 auto;
    }

    .func-text {
        //灰灰色
        color: #888888;
        text-align: center;
    }

    .alias-layout {
        //使用flex布局
        display: flex;
        //水平居中
        justify-content: center;
        //垂直居中
        align-items: center;
        //换行
        flex-wrap: wrap;

        width: 100%;
    }

    .alias-text {
        /* 圆角矩形 */
        border-radius: 10px;
        /* 长宽 */
        width: 160px;
        height: 160px;
        /* 使用flex布局 */
        display: flex;
        /* 水平居中 */
        justify-content: center;
        /* 垂直居中 */
        align-items: center;
        //底色
        background-color: #ebf1ec;
        //字体
        font-size: 80px;
        //间距
        margin: 10px;
    }
}
</style>