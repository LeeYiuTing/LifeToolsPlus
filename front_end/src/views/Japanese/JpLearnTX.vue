<template>
    <div class="JpLearn">
        <van-nav-bar
            title="假名听写"
            left-text="返回"
            left-arrow
            @click-left="router().back()"
        />

        <!--进度-->
        <div class="form-title"></div>
        <div class="step-Line">
            <van-progress inactive :percentage="(((kanaIndex-1)/rangeList.length) * 100).toFixed(2)"/>
        </div>
        <div class="form-title"></div>

        <!--字图-->
        <van-row justify="center">
            <van-col class="alias-s">
                <div class="alias-layout">
                    <div class="column-container" v-for="(item,index) in completeKanaList">
                        <div class="alias-text"  @click="playAudio(item.audio)">
                            {{ kanaType === 1 ? item.Hiragana : item.Katakana}}
                        </div>
                        <div class="alias-text">
                            <van-image v-if="item.txImage" :src="item.txImage" />
                        </div>
                    </div>
                </div>
            </van-col>
        </van-row>
        <div class="form-title"></div>
        <div class="form-title"></div>
        <div class="form-title"></div>
        <!--画布-->
        <div class="canvas-container">
            <van-row justify="center">
                <van-col >
                    <div class="canvas-layout">
                        <van-signature :line-width="6" class="van-signature" ref="signature" background-color="#eee" @submit="onSubmit" />
                    </div>
                </van-col>
            </van-row>

        </div>

        <!--功能区-->
        <van-row class="lock-to-bottom" justify="center" gutter="70">
            <van-col @click="onClear">
                <van-icon name="replay" size="5rem" color="#b0dbda"/>
                <div class="func-text">重写</div>
            </van-col>
            <van-col @click="playAudio()">
                <van-icon name="play-circle-o" size="5rem" color="#b0dbda"/>
                <div class="func-text">重听</div>
            </van-col>
            <van-col @click="next">
                <van-icon name="arrow" size="5rem" color="#b0dbda"/>
                <div class="func-text">下一个</div>
            </van-col>
        </van-row>
    </div>
</template>

<script>
import common from "../../util/common";
import router from "../../router/router";
import kana from "/src/config/kana.json";

export default {
    name: 'JpLearnTX',
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

            completeKanaList: [],               // 已完成听写的假名

            painting: false,
            canvas: null,
            ctx: null,
            lastX: 0,
            lastY: 0,
            canvasWidth: 0,
            canvasHeight: 0,

            image:'',
        };
    },
    mounted() {
        let query = this.$route.query;
        console.log('query', query)
        this.rowNum = Number(query.rowNum);
        this.kanaType = Number(query.kanaType);
        this.learnNum = 5 * this.rowNum;

        window.addEventListener('resize', this.updateCanvasSize);
        this.collectKana();
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateCanvasSize);
        this.$refs.signature.resize()
    },
    methods: {
        router() {
            return router
        },

        onSubmit(data){
            this.image = data.image;
        },

        onClear() {
            this.$refs.signature.clear();
        },



        /**
         * 整理假名
         */
        collectKana() {
            // 全部假名
            let allKana = this.kanaList;
            console.log(allKana)
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

            //打乱
            this.rangeList = common.shuffleArray(targetList);

            this.next();
        },

        /**
         * 下一个
         */
        next() {
            let { rangeList, kanaIndex,} = this;
            //判断是否还有
            //显示听完的
            if (kanaIndex > 0 && kanaIndex <= rangeList.length) {
                this.$refs.signature.submit();
                //添加到已完成列表
                this.completeKanaList.unshift(this.target);
                this.kanaIndex += 1
                this.completeKanaList[0].txImage = this.image;
                this.image = '';
                this.$refs.signature.clear();
            }
            if (kanaIndex >= rangeList.length) {
                console.log('全部完成')
                common.showTips('全部完成 !', 'success');
                setTimeout(() => {

                }, 1500)
            } else {
                //还有
                // 随机抽取4个假名
                this.target = rangeList[kanaIndex];
                this.kanaIndex = kanaIndex + 1;

                //首次播放
                this.playAudio();
            }
        },

        //播放音频
        playAudio(audio) {
            let {audioPlayer, target} = this;
            audioPlayer.src = target.audio;
            if (audio) {
                audioPlayer.src = audio;
            }
            audioPlayer.play().catch(error => {
                // 处理错误
                console.log('音频播放错误',error)
                common.showTips('首次请手动点击播放', 'success');
            });
        },

        //绘画相关
        // 监听窗口大小变化
        updateCanvasSize() {
            const layout = this.$el.querySelector('.canvas-layout');
            this.canvasWidth = layout.clientWidth;
            this.canvasHeight = layout.clientHeight;
        },

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

    :deep(.van-signature__footer) {
        display: none;
    }
    :deep(.van-signature__content) {
        width: 100%;
        height: 100%;
        border-radius: 10px;
    }


    /* 父容器的样式 */

    .canvas-container {
        position: fixed;               /* 使用 fixed 定位 */
        bottom: 120px;                  /* 底部贴边，距离 */
        display: flex;                 /* 使用 Flexbox 布局 */
        justify-content: center;       /* 水平居中 */
        align-items: center;           /* 垂直居中 */
        padding: 25px;                 /* 可选，添加一些内边距 */
    }

    .canvas-layout {
        width: 100%;
        justify-content: center;
        align-items: center;
        display: flex;
        margin: 0 auto;
        height: 350px; /* 明确设置了高度 */
        position: relative; /* 确保可以相对于画布定位 */

        //canvas标签选择
        .van-signature{
            height: 100%;
        }
    }

    .alias-s{
        width: 80%;
        .alias-layout {
            //使用flex布局
            display: flex;
            //垂直居中
            align-items: center;
            width: 100%;
            overflow-x: auto;
            //不换行
            flex-wrap: nowrap;

            .column-container {
                .alias-text {
                    border-radius: 10px;
                    width: 50px; /* 子元素的宽度 */
                    height: 50px; /* 子元素的高度 */
                    background-color: #ebf1ec;
                    font-size: 20px;
                    margin: 10px; /* 子元素的间隔 */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    white-space: nowrap;
                    text-align: center;
                    flex-shrink: 0
                }
            }
        }
    }

}
</style>