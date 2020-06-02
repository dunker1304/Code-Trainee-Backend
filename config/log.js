
var winston = require('winston');
var customLogger = new winston.Logger();

// A console transport logging debug and above.
customLogger.add(winston.transports.Console, {
  level: 'debug',
  colorize: true
});

// A file based transport logging only errors formatted as json.
customLogger.add(winston.transports.File, {
  level: 'error',
  filename: 'log_data/application.log',
  json: true
});

module.exports.log = {
  // open comment if you want to log to file.
  // custom: customLogger,
  level: 'info',

  // Disable captain's log so it doesn't prefix or stringify our meta data.
  inspect: false
};
