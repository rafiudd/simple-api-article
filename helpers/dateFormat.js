
function dateFormat(date) {
    let d = new Date(date);
    let formatedDate, hours, minutes, milisecond, formatedTime;
    let trueMonth = d.getMonth() + 1;
    
    formatedDate = d.getFullYear() + "-" + ("0" + trueMonth ).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
    hours = ("0" + d.getHours()).slice(-2);
    minutes = ("0" + d.getMinutes()).slice(-2);
    milisecond = ("0" + d.getSeconds()).slice(-2);
  
    formatedTime = hours + ":" + minutes + ":" + milisecond
    return formatedDate + " " + formatedTime
}

module.exports = dateFormat;