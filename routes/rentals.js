const express = require('express');
const router = express.Router();

const Fawn = require('fawn');

const { Rental, validRental} = require('../models/Rental');
const { Customer } = require('../models/Customers');
const { Movie } = require('../models/Movie');

router.get('/', async (req, res) => {
    // list of rental
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', async (req, res) =>{
    const { error } = validRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock ')
    // create a rental
    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id }, {
                $inc: { numberInStock: -1}
            })
            .run()
        
            res.send(rental);
    } catch (ex) {
        res.status(500).send("Something faild")        
    }

    res.send(rental);
});

module.exports = router;