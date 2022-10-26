const moment = require('moment');

function formatMessage(userName,text){
  return {
    userName,
    text,
    time: moment().format('hh:mm a')
  }
}

module.exports = formatMessage;