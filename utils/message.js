const moment = require('moment');

//returning message with time and username 
function messageFormat(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}
module.exports = messageFormat;

