const mongoose = require('mongoose');
const supertest = require('supertest');
const {Genre} = require('../../models/Genres');
const { User } = require('../../models/User');
const app = require('../../index');

describe('api/genres', ()=>{
    let server;
    let request;

    beforeAll(()=>{
        server = app.listen()
    });

    beforeEach(async ()=>{
        
        request = supertest(server);
    });
    
    afterEach(async ()=>{
        await server.close();
        await Genre.deleteMany({});
    });
    
    describe('GET /', ()=>{

        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                {name: "genre1"},
                {name: "genre2"}
            ]);

            const response = await request.get('/api/genres');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(response.body.some(g => g.name === 'genre2')).toBeTruthy();

        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async ()=>{
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request.get('/api/genres/'+ genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return a 404 if invalid id is passed', async ()=>{

            const res = await request.get('/api/genres/1');

            expect(res.status).toBe(404);
        });
        it('should return a 404 if the genre not exist', async ()=>{
            const id = mongoose.Types.ObjectId();
            const res = await request.get('/api/genres/'+id);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', ()=>{
        let token;
        let name;

        const exec = async ()=>{
            return  await request
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name });
        }

        beforeEach(()=>{
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should return 401 if client is not logged in', async ()=>{
            token = '';

            const res = await exec();
            
            expect(res.status).toBe(401);
        });
        it('should return 400 if genre is less than 5 characters', async ()=>{
            
            name = '1234';

            const res = await exec()

            expect(res.status).toBe(400);
        });
        it('should return 400 if genre is more than 50 characters', async ()=>{

            name = new Array(52).join('a');

            const res = await exec()

            expect(res.status).toBe(400);
        });
        it('should save save the genre if it is valid', async ()=>{
            
            await exec()
            const genre = await Genre.find({name: 'genre1'});

            expect(genre).not.toBeNull();
        });
        it('should the genre if it is valid', async ()=>{

            const res = await exec();
            
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});