const { Schema, model } = require('mongoose');
const Joi = require('joi');

const Customer = model('Customer', new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    isGold: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    }
}));

function validate(customer) {
    const schema = {
      name: Joi.string().min(5).max(50).required(),
      phone: Joi.string().min(5).max(50).required()
    };
  
    return Joi.validate(customer, schema);
}

module.exports = {
    Customer,
    validate
}

