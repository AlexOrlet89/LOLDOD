const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  email: 'test@dod.com',
  password: '12345',
};

describe('user testing', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it.skip('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });
  it('signs in an existing user', async () => {
    const { email } = mockUser;

    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@dod.com', password: '12345' });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });
  it.skip('logs out a user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@dod.com', password: '12345' });
    expect(res.status).toEqual(200);
    await request(app).delete('/api/v1/users/sessions');

    afterAll(() => {
      pool.end();
    });
  });
});
