let module = {};
// 访问地址
const host = window.location.host
// 静态资源服务器
module.STATIC_SERVER = `http://${host.split(':')[0]}:80`;
// api服务器
module.ApiService = `http://${host.split(':')[0]}:8024`;


export default module;