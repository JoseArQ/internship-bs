const supertest = require('supertest');

const { User } = require('../../models/User');
const {Genre} = require('../../models/Genres');

const app = require('../../index');


describe('auth middleware', () => {
    let server; 
    let request;
    let token;

    beforeAll(()=>{
        server = app.listen();
    });
    beforeEach(()=>{
        // server = require('../../index');
        request = supertest(server);
    });
    
    afterEach(async ()=>{ 
        // await server.close();
        await Genre.deleteMany({});
     });
    
    const exec = () => {
        return  request
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    }

    beforeEach(()=>{
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided', async ()=> {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);

    });

    it('should return 200 if token is valid', async ()=> {
        
        const res = await exec();

        expect(res.status).toBe(200);
        
    });
});