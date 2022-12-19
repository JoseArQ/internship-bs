require('express-async-errors');
const express = require('express');

const logger = require('./logger');
const app = express();

require('./startup/routes')(app);
require('./startup/handleException');
require('./startup/database');
require('./startup/config');
require('./startup/validations');

// const p = Promise.reject(new Error('Something faild miserably'));
// p.then(()=>console.log('done'));

// throw new Error('ALL FAILD!!');
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test'){
    app.listen(port, () => logger.info(`Server listening on port ${port}`));
}

module.exports = app;
