const setup = require('../data/setup');
const app = require('../lib/app');
const request = require('supertest');

const pool = require('../lib/utils/pool');

describe('user testing', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should return a 401 when returning state secrets', async () => {
    const res = await request(app).get('/api/v1/secrets');
    expect(res.body).toEqual({
      message: 'You must be signed in to continue',
      status: 401,
    });
  });
  afterAll(() => {
    pool.end();
  });
});
