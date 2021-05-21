const getTodayByFormat = () =>{
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return str;
}

module.exports = {
    getTodayByFormat: getTodayByFormat
}