const {User} = require('../../../models/User');
const {Types} = require('mongoose');
const jwt = require('jsonwebtoken');

const {PRIVATE_KEY} = require('../../../config');

describe('user.genereteAuthToekn', ()=>{
    it('should return a valid token', ()=>{
        const payload = {
            _id: Types.ObjectId().toHexString(),
            isAdmin: true
        }
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, PRIVATE_KEY);
        expect(decoded).toMatchObject(payload);
    });
});