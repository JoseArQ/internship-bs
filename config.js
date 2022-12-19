const { config } = require('dotenv');

config();

exports.PRIVATE_KEY = process.env.PRIVATE_KEY || 'privateKey';
exports.MONGO_HOST = process.env.MONGO_HOST || 'localhost';
exports.MONGO_DB_PORT = process.env.MONGO_DB_PORT || 27017;
exports.MONGO_DB_NAME = process.env.MONGO_DB_NAME;
exports.MONGO_DB_NAME_TEST = process.env.MONGO_DB_NAME_TEST;
exports.MONGO_USER = process.env.MONGO_USER;
exports.MONGO_PASSWORD = process.env.MONGO_PASSWORD;
