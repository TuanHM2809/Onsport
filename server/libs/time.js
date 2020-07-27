var moment = require('moment-timezone')
var time = {}

time.FORMAT_IN_FULL_TIME = 'DD/MM/YYYY HH:mm:ss.SSSZ'
time.FORMAT_OUT_FULL_TIME = 'YYYY-MM-DD HH:mm:ss.SSSZ'
time.FORMAT_IN = 'DD/MM/YYYY'
time.FORMAT_OUT = 'YYYY-MM-DD'
time.FORMAT_IN_TIME = 'DD/MM/YYYY HH:mm:ss'
time.FORMAT_OUT_TIME = 'YYYY-MM-DD HH:mm:ss'

/* Get start of Day */
time.startDay = (value = false, formatIn = time.FORMAT_IN_FULL_TIME, formatOut = time.FORMAT_OUT_FULL_TIME) => {
  if (value) {
    return moment(value, formatIn).utc().startOf('day').format(formatOut)
  } else {
    return moment().utc().startOf('day').format(formatOut)
  }
}

/* Get end of Day */
time.endDay = (value = false, formatIn = time.FORMAT_IN_FULL_TIME, formatOut = time.FORMAT_OUT_FULL_TIME) => {
  if (value) {
    return moment(value, formatIn).utc().endOf('day').format(formatOut)
  } else {
    return moment().utc().endOf('day').format(formatOut)
  }
}

time.format = (value = false, formatIn = time.FORMAT_IN_FULL_TIME, formatOut = time.FORMAT_OUT_FULL_TIME) => {
  if (value) {
    return moment(value, formatIn).utc().format(formatOut)
  } else {
    return moment().utc().format(formatOut)
  }
}

time.isValid = (value = false, formatIn = time.FORMAT_IN_FULL_TIME) => {
  if (value) {
    return moment(value, formatIn).isValid()
  } else {
    return false
  }
}

module.exports = time
