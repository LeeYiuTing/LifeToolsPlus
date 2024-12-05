<template>
    <div class="JpLearn">
        <van-nav-bar
            title="假名闯关"
        />
        <!--功能区-->
        <div class="form-title"></div>
        <van-row justify="center" gutter="100">
            <van-col @click="playAudio">
                <van-icon name="play-circle-o" size="3rem" color="#24c168"/>
                <div class="func-text">播放</div>
            </van-col>
            <van-col>
                <van-icon name="replay" size="3rem" color="#24c168"/>
                <div class="func-text">换一批</div>
            </van-col>
        </van-row>

        <!--图-->
        <div class="form-title"></div>
        <div class="step-text">{{ kanaIndex }}/{{ learnNum }}</div>
        <div class="form-title"></div>

        <van-row justify="center">
            <van-col>
                <div class="alias-layout">
                    <div class="alias-text" v-for="(item,index) in randomKanaList" @click="clickKana(item)">
                        {{ item.Hiragana }}
                    </div>
                </div>
            </van-col>
        </van-row>

        <van-button class="bottom-button" round type="success" size="large">下一个</van-button>
    </div>
</template>

<script>
import common from "../../util/common";
import router from "../../router/router";

export default {
    name: 'JpLearnSetOption',
    data() {
        return {
            kanaList: [
                {"Hiragana": "あ", "Katakana": "ア", "Romanization": "a", "audio": "/audio/kana/あ.mp3"},
                {"Hiragana": "い", "Katakana": "イ", "Romanization": "i", "audio": "/audio/kana/い.mp3"},
                {"Hiragana": "う", "Katakana": "ウ", "Romanization": "u", "audio": "/audio/kana/う.mp3"},
                {"Hiragana": "え", "Katakana": "エ", "Romanization": "e", "audio": "/audio/kana/え.mp3"},
                {"Hiragana": "お", "Katakana": "オ", "Romanization": "o", "audio": "/audio/kana/お.mp3"},
                {"Hiragana": "か", "Katakana": "カ", "Romanization": "ka", "audio":"/audio/kana/か.mp3"},
                {"Hiragana": "き", "Katakana": "キ", "Romanization": "ki", "audio":"/audio/kana/き.mp3"},
                {"Hiragana": "く", "Katakana": "ク", "Romanization": "ku", "audio":"/audio/kana/く.mp3"},
                {"Hiragana": "け", "Katakana": "ケ", "Romanization": "ke", "audio":"/audio/kana/け.mp3"},
                {"Hiragana": "こ", "Katakana": "コ", "Romanization": "ko", "audio":"/audio/kana/こ.mp3"},
                {"Hiragana": "さ", "Katakana": "サ", "Romanization": "sa", "audio":"/audio/kana/さ.mp3"},
                {"Hiragana": "し", "Katakana": "シ", "Romanization":"shi", "audio":"/audio/kana/し.mp3"},
                {"Hiragana": "す", "Katakana": "ス", "Romanization": "su", "audio":"/audio/kana/す.mp3"},
                {"Hiragana": "せ", "Katakana": "セ", "Romanization": "se", "audio":"/audio/kana/せ.mp3"},
                {"Hiragana": "そ", "Katakana": "ソ", "Romanization": "so", "audio":"/audio/kana/そ.mp3"},
                {"Hiragana": "た", "Katakana": "タ", "Romanization": "ta", "audio":"/audio/kana/た.mp3"},
                {"Hiragana": "ち", "Katakana": "チ", "Romanization": "chi","audio":"/audio/kana/ち.mp3"},
                {"Hiragana": "つ", "Katakana": "ツ", "Romanization": "tsu","audio":"/audio/kana/つ.mp3"},
                {"Hiragana": "て", "Katakana": "テ", "Romanization": "te", "audio":"/audio/kana/て.mp3"},
                {"Hiragana": "と", "Katakana": "ト", "Romanization": "to", "audio":"/audio/kana/と.mp3"},
                {"Hiragana": "な", "Katakana": "ナ", "Romanization": "na", "audio":"/audio/kana/な.mp3"},
                {"Hiragana": "に", "Katakana": "ニ", "Romanization": "ni", "audio":"/audio/kana/に.mp3"},
                {"Hiragana": "ぬ", "Katakana": "ヌ", "Romanization": "nu", "audio":"/audio/kana/ぬ.mp3"},
                {"Hiragana": "ね", "Katakana": "ネ", "Romanization": "ne", "audio":"/audio/kana/ね.mp3"},
                {"Hiragana": "の", "Katakana": "ノ", "Romanization": "no", "audio":"/audio/kana/の.mp3"},
                {"Hiragana": "は", "Katakana": "ハ", "Romanization": "ha", "audio":"/audio/kana/は.mp3"},
                {"Hiragana": "ひ", "Katakana": "ヒ", "Romanization": "hi", "audio":"/audio/kana/ひ.mp3"},
                {"Hiragana": "ふ", "Katakana": "フ", "Romanization": "fu", "audio":"/audio/kana/ふ.mp3"},
                {"Hiragana": "へ", "Katakana": "ヘ", "Romanization": "he", "audio":"/audio/kana/へ.mp3"},
                {"Hiragana": "ほ", "Katakana": "ホ", "Romanization": "ho", "audio":"/audio/kana/ほ.mp3"},
                {"Hiragana": "ま", "Katakana": "マ", "Romanization": "ma", "audio":"/audio/kana/ま.mp3"},
                {"Hiragana": "み", "Katakana": "ミ", "Romanization": "mi", "audio":"/audio/kana/み.mp3"},
                {"Hiragana": "む", "Katakana": "ム", "Romanization": "mu", "audio":"/audio/kana/む.mp3"},
                {"Hiragana": "め", "Katakana": "メ", "Romanization": "me", "audio":"/audio/kana/め.mp3"},
                {"Hiragana": "も", "Katakana": "モ", "Romanization": "mo", "audio":"/audio/kana/も.mp3"},
                {"Hiragana": "や", "Katakana": "ヤ", "Romanization": "ya", "audio":"/audio/kana/や.mp3"},
                {"Hiragana": "ゆ", "Katakana": "ユ", "Romanization": "yu", "audio":"/audio/kana/ゆ.mp3"},
                {"Hiragana": "よ", "Katakana": "ヨ", "Romanization": "yo", "audio":"/audio/kana/よ.mp3"},
                {"Hiragana": "ら", "Katakana": "ラ", "Romanization": "ra", "audio":"/audio/kana/ら.mp3"},
                {"Hiragana": "り", "Katakana": "リ", "Romanization": "ri", "audio":"/audio/kana/り.mp3"},
                {"Hiragana": "る", "Katakana": "ル", "Romanization": "ru", "audio":"/audio/kana/る.mp3"},
                {"Hiragana": "れ", "Katakana": "レ", "Romanization": "re", "audio":"/audio/kana/れ.mp3"},
                {"Hiragana": "ろ", "Katakana": "ロ", "Romanization": "ro", "audio":"/audio/kana/ろ.mp3"},
                {"Hiragana": "わ", "Katakana": "ワ", "Romanization": "wa", "audio":"/audio/kana/わ.mp3"},
                {"Hiragana": "を", "Katakana": "ヲ", "Romanization": "wo", "audio":"/audio/kana/を.mp3"},
                {"Hiragana": "ん", "Katakana": "ン", "Romanization": "n", "audio": "/audio/kana/ん.mp3"}
            ],
            randomKanaList: [],
            audioPlayer: new Audio(),
            target: {},
            rangeList: [],
            kanaRange: 0,
            rowNum: 0,

            learnNum: 0,
            kanaIndex: 0,
        };
    },
    mounted() {
        let query = this.$route.query;
        this.rowNum = Number(query.rowNum);
        this.kanaRange = Number(query.kanaRange);
        this.learnNum = 5 * this.rowNum;
        this.chooseKana();
    },
    methods: {

        /**
         * 选择假名
         */
        chooseKana() {
            // 全部假名
            let allKana = this.kanaList;
            //根据行数 每行5个
            let count = this.rowNum * 5;
            //取出要学习的假名
            this.rangeList = common.shuffleArray(allKana.slice(0, count));

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
            if (kanaIndex >= learnNum) {
                console.log('全部完成')
                common.showTips('全部完成 !', 'success');
                setTimeout(()=>{
                    router.back()
                },1000)
            } else {
                //还有
                // 随机抽取4个假名
                this.target = rangeList[kanaIndex];
                this.kanaIndex = kanaIndex+1;
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

    .step-text {
        //居中
        text-align: center;
        //字体
        font-size: 40px;
        color: #888888;
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

        width: 500px;
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