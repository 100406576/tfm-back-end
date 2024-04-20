const request = require('supertest');
const app = require('../../src/app.js');
const authMiddleware = require('../../src/middlewares/auth.middleware.js');
const userValidationMiddleware = require('../../src/middlewares/userValidation.middleware.js');
const { PORT } = require('../../src/config/config.js');


const authMiddlewareMock = (req, res, next) => {
  next();
};
const userValidationMiddlewareMock = (req, res, next) => {
  next();
};
jest.mock('../../src/middlewares/auth.middleware.js', () => authMiddlewareMock);
jest.mock('../../src/middlewares/userValidation.middleware.js', () => userValidationMiddlewareMock);

describe("Users", () => {
  let server;
  const mockUser = { username: 'testIntegration', name: 'paco', lastName: 'perez', password: "1234", email: 'testuser2@example.com' };

  beforeAll(() => {
    server = app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`)
    });
  });

  afterAll(done => {
    server.close(done);
  });

  test("Read user KO - User not found", async () => {
    const res = await request(app).get(`/users/${mockUser.username}`).send();
    expect(res.statusCode).toBe(404);
  });

  test("Create user OK", async () => {
    const res = await request(app).post("/users").send(mockUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User created');
  });

  test("Create user KO - Username already exists", async () => {
    const res = await request(app).post("/users").send(mockUser);
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error', 'Username already exists');
  });

  test("Read user OK", async () => {
    const res = await request(app).get(`/users/${mockUser.username}`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toStrictEqual(mockUser.username);
  });

  test("Create user KO - Bad request", async () => {
    const mockWrongUser = { username: 'testUser', password: 'paco' };
    const res = await request(app).post("/users").send(mockWrongUser);
    expect(res.statusCode).toBe(400);
  });

  test("Create user KO - Bad request no password", async () => {
    const mockUserNoPass = { username: 'testUser' };
    const res = await request(app).post("/users").send(mockUserNoPass);
    expect(res.statusCode).toBe(400);
  });

  test("Login user OK", async () => {
    const res = await request(app)
      .get(`/users/login`)
      .query(mockUser);

    expect(res.statusCode).toBe(200);
    expect(res.headers.authorization).toBeDefined();
    expect(res.body).toHaveProperty('message', 'Login success');
  });

  test("Login user KO - No password", async () => {
    const mockUserNoPass = { username: 'nonexistentuser' };
    const res = await request(app)
      .get(`/users/login`)
      .query(mockUserNoPass);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'No username or password');
  });

  test("Login user KO - User not found", async () => {
    const mockUserNoExist = { username: 'nonexistentuser', password: '1234' };
    const res = await request(app)
      .get(`/users/login`)
      .query(mockUserNoExist);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Incorrect username or password');
  });

  test("Login user KO - Incorrect password", async () => {
    const mockUserWrongPass = { username: mockUser.username, password: 'wrongpassword' };
    const res = await request(app)
      .get(`/users/login`)
      .query(mockUserWrongPass);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Incorrect username or password');
  });

  test("Delete user OK", async () => {
    const res = await request(app).delete(`/users/${mockUser.username}`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User deleted');
  });

  test("Delete user KO - User not found", async () => {
    const res = await request(app).delete(`/users/${mockUser.username}`).send();
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found');
  });
});