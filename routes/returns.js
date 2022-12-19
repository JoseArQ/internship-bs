const Joi = require('joi');
const { Router } = require('express');
const auth = require('../middleware/auth');
const { Rental } = require('../models/Rental');
const { Movie } = require('../models/Movie');
const validate = require('../middleware/validate');
const router = Router();

router.post('/', [auth, validate(validateReturn)], async (req, res)=>{
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send('Rental not found');

    if(rental.dateReturned) return res.status(400).send('Rental is already processed');

    rental.return();
    
    await rental.save()

    // const movie = await Movie.findById(req.body.movieId);
    // movie.numberInStock++;
    // await movie.save();

    await Movie.updateOne({_id: req.body.movieId}, {
        $inc:{numberInStock:1}
    })
    return res.send(rental);
});


function validateReturn(req) {
    const schema = {
      customerId: Joi.objectId().required(),
      movieId: Joi.objectId().required()
    };
  
    return Joi.validate(req, schema);
}
module.exports = router;