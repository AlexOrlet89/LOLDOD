const setup = require('../data/setup');
const app = require('../lib/app');
const request = require('supertest');

const pool = require('../lib/utils/pool');
const UserService = require('../lib/services/UserService');

const mockUser = {
  email: 'test@dod.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  const agent = request.agent(app);

  const user = await UserService.create({ ...mockUser, userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

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
  it('should return a list of secrets if user is signed in', async () => {
    const [agent] = await registerAndLogin();

    const secretsRevealed = await agent.get('/api/v1/secrets');
    expect(secretsRevealed.status).toEqual(200);
  });
  afterAll(() => {
    pool.end();
  });
});
