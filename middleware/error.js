const logger = require('../logger');

module.exports = function(err, req, res, next){
    logger.error(err.message);
    // winston.error(err.message);
    return res.status(500).json({
        message: err.message,
        success: false
    });
}