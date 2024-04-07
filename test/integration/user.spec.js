const request = require('supertest')
const app = require('../../src/app.js')
const { PORT } = require('../../src/config/config.js')

describe("Users", () => {
    let server;

    beforeAll(() => {
    server = app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT}`)
    });
    });

    afterAll(done => {
    server.close(done);
    });

    test("get users", async () => {
      const response = await request(app).get("/api/v1/users").send();
      expect(response.statusCode).toBe(200);
      expect(response.body.users[0].username).toStrictEqual('oli')
    });
  });