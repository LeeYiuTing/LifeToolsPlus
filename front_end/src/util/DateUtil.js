let module = {};

module.formatDate = function (timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    let month = date.getMonth() + 1; // 月份是从0开始的，所以加1
    let day = date.getDate();

    // 保证月份和日期始终为两位数
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}年${month}月${day}日`;
}

export default module;