const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('../config');

module.exports = function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status('401').send('Acces deneid. No token provided');

    try {
        const decoded = jwt.verify(token, PRIVATE_KEY);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token');
    }
}

