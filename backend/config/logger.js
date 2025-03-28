const log4js = require("log4js");

log4js.configure({
  appenders: {
    out: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss} [%p] [%f] - %m',  // Timestamp and log pattern
      },
    },
    logfile: {
      type: 'file',
      filename: 'logs/logfile.log', // Log file location
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss} [%p] [%f] - %m',  // Timestamp and log pattern
      },
    },
  },
  categories: {
    default: { appenders: ['out', 'logfile'], level: 'info' }, // Default logger settings
  }
  // categories: { default: { appenders: ["out", "logfile"], level: "error" } },
});

// Create and export logger instance
const logger = log4js.getLogger();

module.exports = logger;