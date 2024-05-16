const request = require('supertest');
const { app, syncDatabase } = require('../../src/app.js');
const authMiddleware = require('../../src/middlewares/auth.middleware.js');
const userValidationMiddleware = require('../../src/middlewares/userValidation.middleware.js');
const userService = require('../../src/services/user.service.js');
const { PORT } = require('../../src/config/config.js');
const { text } = require('express');

const authMiddlewareMock = (req, res, next) => {
  req.user = {
    username: 'testIntegration',
    user_id: '1',
  };
  next();
};
const userValidationMiddlewareMock = (req, res, next) => {
  next();
};
jest.mock('../../src/middlewares/auth.middleware.js', () => authMiddlewareMock);
jest.mock('../../src/middlewares/userValidation.middleware.js', () => userValidationMiddlewareMock);

describe("Operation integration test", () => {
  let server;
  const mockUser = { username: 'testIntegration', user_id: "1", name: 'paco', lastName: 'perez', password: "1234", email: 'testuser2@example.com' };
    const mockProperty = { propertyName: "Casa 1", address: "Calle inventada 2, Bajo A", cadastralReference: "1234", houseDetails: { numberOfRooms: 2, hasGarden: false } };
    let propertyId;

  beforeAll(async () => {
    await syncDatabase().then(() => {
      server = app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT}`)
      });
    });
    await request(app).post("/users").send(mockUser);
    const res = await request(app).post("/properties").send(mockProperty);
    propertyId = res.body.property_id;
  });

  afterAll(async () => {
    await request(app).delete(`/users/${mockUser.username}`).send();
    await new Promise(resolve => server.close(resolve));
  });

  test("Read operations of property OK- No operations", async () => {
    const res = await request(app).get(`/operations/property/${propertyId}`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  test("Read operations KO - Property not found", async () => {
    const res = await request(app).get(`/operations/property/999`).send();
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Property not found');
  });

  test("Read operation KO - Not Found", async () => {
    const res = await request(app).get(`/operations/999`).send();
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Operation not found');
  });
});