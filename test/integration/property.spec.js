const request = require('supertest');
const { app, syncDatabase } = require('../../src/app.js');
const authMiddleware = require('../../src/middlewares/auth.middleware.js');
const userValidationMiddleware = require('../../src/middlewares/userValidation.middleware.js');
const { PORT } = require('../../src/config/config.js');

const authMiddlewareMock = (req, res, next) => {
    req.user = { user_id: 1 };
    next();
};
const userValidationMiddlewareMock = (req, res, next) => {
  next();
};
jest.mock('../../src/middlewares/auth.middleware.js', () => authMiddlewareMock);
jest.mock('../../src/middlewares/userValidation.middleware.js', () => userValidationMiddlewareMock);

describe("Property integration test", () => {
  let server;
  const mockUser = { username: 'testIntegration', name: 'paco', lastName: 'perez', password: "1234", email: 'testuser2@example.com' };
  const mockProperty = {
    property_id: 1,
    user_id: 1,
    name: 'Property 1',
    address: 'calle italia 2',
    cadastralReference: '1234',
    houseDetails: { property_id: 1, numberOfRooms: 2, hasGarden: true },
    flatDetails: { /* mock flat details */ },
    garageDetails: { /* mock garage details */ },
  };

  beforeAll(async () => {
    await syncDatabase().then(() => {
      server = app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT}`)
      });
    });
  });

  afterAll(done => {
    server.close(done);
  });

  /*test("Read properties of user OK", async () => {
    const res = await request(app).get(`/users/${mockUser.username}/properties`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toContainEqual(mockProperty);
  });*/

  test("Read properties of user KO - User not found", async () => {
    const res = await request(app).get(`/users/nonexistentuser/properties`).send();
    expect(res.statusCode).toBe(404);
  });

  /*test("Read property OK", async () => {
    const res = await request(app).get(`/properties/${mockProperty.property_id}`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual(mockProperty);
  });*/

  /*test("Read property KO - Property not found", async () => {
    const res = await request(app).get(`/properties/nonexistentproperty`).send();
    expect(res.statusCode).toBe(404);
  });*/

  /*test("Read property KO - Forbidden", async () => {
    const res = await request(app).get(`/properties/${mockProperty.property_id}`).send();
    expect(res.statusCode).toBe(403);
  });*/
});