
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
  // Pass in our custom logger, and pass all log levels through.
  // custom: customLogger,
  level: 'error',

  // Disable captain's log so it doesn't prefix or stringify our meta data.
  inspect: false
};
