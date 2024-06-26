const request = require('supertest');
const { app, syncDatabase } = require('../../src/app.js');
const authMiddleware = require('../../src/middlewares/auth.middleware.js');
const { PORT } = require('../../src/config/config.js');

const authMiddlewareMock = (req, res, next) => {
  req.user = {
    username: 'testIntegration',
    user_id: '1',
  };
  next();
};
jest.mock('../../src/middlewares/auth.middleware.js', () => authMiddlewareMock);

describe("Property integration test", () => {
  let server;
  const mockUser = { username: 'testIntegration', user_id: "1", name: 'paco', lastName: 'perez', password: "1234", email: 'testuser2@example.com' };
  let propertyId;

  beforeAll(async () => {
    await syncDatabase().then(() => {
      server = app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT}`)
      });
    });
    await request(app).post("/users").send(mockUser);
  });

  afterAll(async () => {
    await request(app).delete(`/users/${mockUser.username}`).send();
    await new Promise(resolve => server.close(resolve));
  });

  test("Read properties of user OK - No properties", async () => {
    const res = await request(app).get(`/properties`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  test("Create property OK", async () => {
    const res = await request(app).post(`/properties`).send({
      propertyName: "Casa 1",
      address: "Calle inventada 2, Bajo A",
      cadastralReference: "1234",
      houseDetails: {
        numberOfRooms: 2,
        hasGarden: false
      }
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('property_id');
    propertyId = res.body.property_id;
  });

  test("Create property KO - Bad request", async () => {
    const res = await request(app).post(`/properties`).send({
      propertyName: "Casa 1",
      address: "Calle inventada 2, Bajo A"
    });
    expect(res.statusCode).toBe(400);
  });

  test("Read properties of user OK", async () => {
    const res = await request(app).get(`/properties`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test("Read property OK", async () => {
    const res = await request(app).get(`/properties/${propertyId}`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('property_id', propertyId);

  });

  test("Read property KO - Property not found", async () => {
    const res = await request(app).get(`/properties/0`).send();
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Property not found');
  });

  test("Update property OK", async () => {
    const res = await request(app).put(`/properties/${propertyId}`).send({
      propertyName: "Casa 2",
      address: "Calle inventada 2, Bajo A",
      cadastralReference: "1234",
      houseDetails: {
        numberOfRooms: 3,
        hasGarden: false
      }
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('propertyName', 'Casa 2');
  });

  test("Delete property OK", async () => {
    const res = await request(app).delete(`/properties/${propertyId}`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Property deleted');
  });

  test("Delete property KO - Property not found", async () => {
    const res = await request(app).delete(`/properties/0`).send();
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Property not found');
  });
});
