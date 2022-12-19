const { Schema, model } = require('mongoose');
const Joi = require('joi');


function validateGenre(genre) {
    const schema = {
      name: Joi.string().min(5).max(50).required()
    };
  
    return Joi.validate(genre, schema);
}

const genreSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    }
});

module.exports.Genre = model('Genre', genreSchema);

module.exports.validate = validateGenre;

module.exports.genreSchema = genreSchema;