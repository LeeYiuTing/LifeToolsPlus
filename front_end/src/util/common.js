import axios from 'axios';
import {showConfirmDialog, showFailToast, showSuccessToast, showToast} from 'vant';

let module = {};

const server = 'http://localhost:8024';

// 通过form-data上传文件的请求
module.uploadToServer = (options) => {
    let {url, params, success, fail} = options;
    url = server + url;
    axios.post(url, params, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => {
        success && success(res);
    }).catch(err => {
        console.log('errInfo',err)
        module.showTips(err.response.data.msg, 'fail')
        fail && fail(err);
    });
}

// 封装axios的post请求
module.post = (options) => {
    let {url, params, success, fail} = options;
    url = server + url;
    axios.post(url, params).then(res => {
        success && success(res);
    }).catch(err => {
        module.showTips(err.msg, 'fail')
        fail && fail(err);
    });
}

/**
 * 展示提示方法
 * @param msg 文字
 * @param type 类型
 * @param icon 图标
 */
module.showTips = (msg, type, icon) => {
    if (!type && !icon) {
        //仅文字
        showToast(msg);
    } else if (msg && icon) {
        //文字和图标
        showToast({
            message: msg,
            icon: icon,
        });
    } else if (msg && type) {
        //文字和类型
        if (type === 'success') {
            showSuccessToast(msg);
        } else if (type === 'fail') {
            showFailToast(msg);
        }
    }
}

export default module;
