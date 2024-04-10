const request = require('supertest')
const app = require('../../src/app.js')
const { PORT } = require('../../src/config/config.js')

describe("Users", () => {
  let server;
  // Cuando se implemente el borrar se borrara en vez de hacer esto
  const randomUsername = 'user' + Math.floor(Math.random() * 10000);

  beforeAll(() => {
    server = app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`)
    });
  });

  afterAll(done => {
    server.close(done);
  });

  /*test("get users", async () => {
    const response = await request(app).get("/api/v1/users").send();
    expect(response.statusCode).toBe(200);
    expect(response.body.users[0].username).toStrictEqual('oli')
  });*/
  test("Read user KO - User not found", async () => {
    const response = await request(app).get(`/users/${randomUsername}`).send();
    expect(response.statusCode).toBe(404);
  });
  test("Create user OK", async () => {
    const mockUser = { username: randomUsername, name: 'paco', lastName: 'perez', password: "1234", email: 'testuser2@example.com' };
    const response = await request(app).post("/users").send(mockUser);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'User created');
  });
  test("Create user KO - Username already exists", async () => {
    const mockUser = { username: randomUsername, name: 'paco', lastName: 'perez', password: "1234", email: 'existinguser@example.com' };
    const response = await request(app).post("/users").send(mockUser);
    expect(response.statusCode).toBe(409);
  });
  test("Read user OK", async () => {
    const response = await request(app).get(`/users/${randomUsername}`).send();
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toStrictEqual(randomUsername);
  });
  test("Create user KO - Bad request", async () => {
    const mockUser = { username: 'testUser', password: 'paco' };
    const response = await request(app).post("/users").send(mockUser);
    expect(response.statusCode).toBe(400);
  });
});