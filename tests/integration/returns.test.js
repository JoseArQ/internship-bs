const { default: mongoose } = require('mongoose');
const supertest = require('supertest');
const moment = require('moment');

const { Rental } = require('../../models/Rental');
const { User } = require('../../models/User');
const { Movie } = require('../../models/Movie');
const app = require('../../index');

describe('/api/returns', ()=>{
    let server;
    let request;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    const exec = () => {
        return request
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({ customerId, movieId });
    }
    beforeAll(()=>{
        server = app.listen();
    });

    beforeEach(async ()=>{
        request = supertest(server);

        token = new User().generateAuthToken();
        
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            genre: { name: '12345'},
            dailyRentalRate: 2,
            numberInStock: 10
        });
        await movie.save();
        rental = new Rental({
            customer:{
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });

        await rental.save()
    });

    afterEach(async ()=>{
        // await server.close();

        await Rental.deleteMany({});
        await Movie.deleteMany({});
    });

    afterAll(async ()=>{
        // await app.delete();
        // console.log(app);
    });
    it('should return 401 if client is not logged in', async ()=>{
       token = ''
        const res = await exec()

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async ()=>{
        customerId = '';
        const res = await exec()
        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async ()=>{
        movieId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if not rental found for the customer/movie', async ()=>{
        await Rental.deleteMany({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental is already process', async ()=>{

        rental.dateReturned = new Date()
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if a reques is valid', async ()=>{
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set the returnDate if input is valid', async ()=>{
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10*1000);
    });

    it('should set the rentalFee if input is valid', async ()=>{
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save()

        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);

        expect(rentalInDb.rentalFee).toBe(14);
    });

    it('should increase the movie stock if input is valid', async ()=>{

        const res = await exec();
        const movieInDb = await Movie.findById(movieId);

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental if input is valid', async ()=>{

        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);

        expect(res.body).toHaveProperty('dateOut');
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(
                ['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']
                )
        );
        
    });
});