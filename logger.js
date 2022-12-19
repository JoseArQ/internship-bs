const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
    format: format.combine(format.simple()),
    transports:[
        new transports.Console({
            level:'info',
            colorize: true,
            prettyPrint: true
        }),
        // new transports.File({
        //     filename: 'loggerFile.log'
        // })
    ]
});