const setup = require('../data/setup');
const app = require('../lib/app');
const request = require('supertest');

const pool = require('../lib/utils/pool');

const mockUser = {
  email: 'test@dod.com',
  password: '12345',
};

describe('user testing', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it.skip('should return a 401 when returning state secrets', async () => {
    const res = await request(app).get('/api/v1/secrets');
    expect(res.body).toEqual({
      message: 'You must be signed in to continue',
      status: 401,
    });
  });
  it('should return a list of secrets if user is signed in', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@dod.com', password: '12345' });
    expect(res.status).toEqual(200);
    const secretsRevealed = await request(app).get('/api/v1/secrets');
    expect(secretsRevealed.status).toEqual(200);
  });
  afterAll(() => {
    pool.end();
  });
});
