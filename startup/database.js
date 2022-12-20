const mongoose = require('mongoose');
const logger = require('../logger');

const ENV = require('../config');

mongoose.set('strictQuery', true);

let db;
db = `mongodb://${ENV.MONGO_HOST}:${ENV.MONGO_DB_PORT}/${ENV.MONGO_DB_NAME}`;

if (process.env.NODE_ENV === 'test'){
    db =`mongodb://${ENV.MONGO_HOST}:${ENV.MONGO_DB_PORT}/${ENV.MONGO_DB_NAME_TEST}`;
}

if (process.env.NODE_ENV === 'production'){
    db = `mongodb://${ ENV.MONGO_USER }:${ ENV.MONGO_PASSWORD }@${ ENV.MONGO_HOST }:${ENV.MONGO_DB_PORT}`;
}

(async () => {
    try {
        logger.info(`trying connecto to ${db}`)
        await mongoose.connect(db);
        logger.info(`${db} is connected env: ${process.env.NODE_ENV}`);

    } catch (ex) {
        logger.error(ex);
    }
})();