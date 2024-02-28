import axios from 'axios';

let module = {};

const server = 'http://localhost:8023/';

// 封装axios的post请求
module.post = (options) => {
    let {url, params, success, fail} = options;
    url = server + url;
    return new Promise((success, fail) => {
        axios.post(url, params).then(res => {
            success && success(res);
        }).catch(err => {
            fail && fail(err);
        });
    });
}

export default module;
