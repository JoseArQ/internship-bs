const { config } = require('dotenv');

config();

exports.PRIVATE_KEY = process.env.PRIVATE_KEY || 'privateKey';
exports.MONGO_URI = process.env.MONGO_URI;
exports.MONGO_URI_TEST = process.env.MONGO_URI_TEST;
