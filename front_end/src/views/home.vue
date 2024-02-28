<template>
    <div class="home">
        <van-notice-bar
            left-icon="volume-o"
            text="你爱我 我爱你 蜜雪冰城甜蜜蜜"
        />

        <van-cell-group inset title="我要出门啦">
            <van-cell v-for="(item,index) in taskList" :title="item.title" @click="goToNew">
                <template #right-icon>
                    <div>
                        <van-switch v-model="item.status" @click.stop="switchStatus"/>
                    </div>
                </template>
            </van-cell>
        </van-cell-group>

        <van-button class="go-button" round type="success" size="large" @click="clickGo">开始出发</van-button>

    </div>
</template>

<script>
import {showConfirmDialog, showToast} from 'vant';
import {showDialog} from 'vant';
import common from "../util/common";

export default {
    name: "home",
    //监听
    watch: {
        checkedAll: function (val) {
            console.log('checkedAll', val);
            if (val) {
                this.taskList.forEach(item => {
                    item.status = true
                })
                this.itemNum = this.taskList.length
            } else {
                this.taskList.forEach(item => {
                    item.status = false
                })
                this.itemNum = 0
            }
        }
    },
    data() {
        return {
            checkedAll: false,
            status: false,
            itemNum: 0,
            taskList: [
                {
                    title: '钥匙',
                    status: false
                },
                {
                    title: '手机',
                    status: false
                }
            ]
        }
    },

    mounted() {
        this.getMyGoOutThings();
    },

    methods: {

        //切换状态
        switchStatus() {
            console.log('switchStatus')
            this.status = !!this.status

            this.itemNum = this.taskList.filter(item => item.status).length
        },

        //点击出门
        clickGo() {
            let {taskList} = this;
            let tipsMsg = '';
            taskList.forEach(item => {
                if (!item.status) {
                    tipsMsg += item.title + '、'
                }
            });
            if (tipsMsg) {
                tipsMsg = tipsMsg.substring(0, tipsMsg.length - 1);
                showConfirmDialog({
                    title: '标题',
                    message: `你还没有准备好${tipsMsg}，确定要出发吗？`,
                }).then(() => {
                    this.confirmGo()
                }).catch(() => {
                    // on cancel
                });
            } else {
                this.confirmGo()
            }
        },

        //确认出发提示
        confirmGo() {
            showToast('出发啦！');
        },

        //获取我要出门的东西
        getMyGoOutThings() {
            common.post({
                url: 'goOut/getMyGoOutThings',
                params: {},
                success: (res) => {
                    console.log('请求成功', res.data);
                }
            })
        }

    }
}
</script>

<style scoped lang="less">
.home {
    .go-button {
        //锁死在离底部100px的位置
        position: fixed;
        bottom: 10px;
        width: 95%;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>