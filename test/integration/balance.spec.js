const request = require('supertest');
const { app, syncDatabase } = require('../../src/app.js');
const authMiddleware = require('../../src/middlewares/auth.middleware.js');
const userService = require('../../src/services/user.service.js');
const { PORT } = require('../../src/config/config.js');

const authMiddlewareMock = (req, res, next) => {
  req.user = {
    username: 'testIntegration',
    user_id: '1',
  };
  next();
};
jest.mock('../../src/middlewares/auth.middleware.js', () => authMiddlewareMock);

describe("Balance integration test", () => {
    let server;
    const mockUser = { username: 'testIntegration', user_id: "1", name: 'paco', lastName: 'perez', password: "1234", email: 'testuser2@example.com' };
      const mockProperty = { propertyName: "Casa 1", address: "Calle inventada 2, Bajo A", cadastralReference: "1234", houseDetails: { numberOfRooms: 2, hasGarden: false } };
      let propertyId;
      let operationId;
  
    beforeAll(async () => {
      await syncDatabase().then(() => {
        server = app.listen(PORT, () => {
          console.log(`Server listening at http://localhost:${PORT}`)
        });
      });
      await request(app).post("/users").send(mockUser);
      const res = await request(app).post("/properties").send(mockProperty);
      propertyId = res.body.property_id;
      const mockOperation = { description: "Mensualidad abril 2024", date: "2024-01-26", type: 'income', value: 900.00, property_id: propertyId };
      await request(app).post("/operations").send(mockOperation);
    });

    afterAll(async () => {
      await request(app).delete(`/users/${mockUser.username}`).send();
      await new Promise(resolve => server.close(resolve));
    });

    test("Create Balance OK", async () => { 
        const body = {
            property_id: propertyId,
            dateRange: {
                startDate: "2024-01-01",
                endDate: "2024-01-31",
            },
            timeInterval: "0"
        }
        const res = await request(app).post("/balances").send(body);
        expect(res.statusCode).toBe(201);
        console.log(res.body);
    });

    test("Create Balance KO - Property not found", async () => {
        const body = {
            property_id: 999,
            dateRange: {
                startDate: "2024-01-01",
                endDate: "2024-01-31",
            },
            timeInterval: "0"
        }
        const res = await request(app).post("/balances").send(body);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'Property not found');
    });

    test("Create Balance KO - Validation Error", async () => {
        const body = {
            dateRange: {
                startDate: "2024-01-01",
                endDate: "2024-01-31",
            },
            timeInterval: "0"
        }
        const res = await request(app).post("/balances").send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Missing required fields');
    });

    test("Create Balance KO - Validation Error timeinterval", async () => {
        const body = {
            property_id: propertyId,
            dateRange: {
                startDate: "2024-01-01",
                endDate: "2024-01-31",
            },
            timeInterval: "month"
        }
        const res = await request(app).post("/balances").send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid time interval');
    });
});