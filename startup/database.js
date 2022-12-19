const mongoose = require('mongoose');
const logger = require('../logger');

const ENV = require('../config');

mongoose.set('strictQuery', true);

let db = ENV.MONGO_URI;
if (process.env.NODE_ENV === 'test'){
    db = ENV.MONGO_URI_TEST;
}

(async () => {
    try {
        await mongoose.connect(db);
        logger.info(`${db} is connected`);

    } catch (ex) {
        logger.error(ex);
    }
})();