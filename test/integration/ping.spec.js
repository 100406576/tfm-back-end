const request = require('supertest')
const app = require('../../src/app.js')
const { PORT } = require('../../src/config/config.js')

describe("GET /ping", () => {
    let server;

    beforeAll(() => {
    server = app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT}`)
    });
    });

    afterAll(done => {
    server.close(done);
    });

    it("should respond with a 200 status code", async () => {
      const response = await request(app).get("/api/v1/ping").send();
      expect(response.statusCode).toBe(200);
    });
  
    it("should respond pong", async () => {
      const response = await request(app).get("/api/v1/ping").send();
      expect(response.body).toStrictEqual({
        "message": "pong"
    })
    });
  });