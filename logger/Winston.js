var winston = require('winston');
var logger = new winston.Logger();

module.exports = function(){
    logger.log('info', 'Hello distributed log files!');
    logger.info('Hello again distributed logs');
};
