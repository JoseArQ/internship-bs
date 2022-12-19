const logger = require('../logger');

module.exports = function () {
    process.on('uncaughtException', (ex)=>{
        console.log("uncaughtException");
        logger.error(ex.message, ex);
        process.exit(1);
    
    });
    
    process.on('unhandleRejection', (ex)=>{
        console.log("unhandleRejection");
        logger.error(ex.message, ex);
        process.exit(1);
    });
}();