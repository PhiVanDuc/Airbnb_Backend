const moment = require("moment-timezone");

const convert_time = (time) => {
    const inputTimeUTC = moment.utc(time);
    const inputTimeVN = inputTimeUTC.clone().tz('Asia/Ho_Chi_Minh');

    return inputTimeVN.format('YYYY-MM-DD HH:mm:ss');
}

const current_time = () => {
    return moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ssZ');
}

const formatDateToDateOnly = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

module.exports = {
    convert_time,
    current_time,
    formatDateToDateOnly
}