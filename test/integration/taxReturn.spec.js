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

describe("TaxReturn integration test", () => {
    let server;
    const mockUser = { username: 'testIntegration', user_id: "1", name: 'paco', lastName: 'perez', password: "1234", email: 'testuser2@example.com' };
      const mockProperty = { propertyName: "Casa 1", address: "Calle inventada 2, Bajo A", cadastralReference: "1234", cadastralValue: 145000, constructionValue: 40000, acquisitionValue: 225000, acquisitionCosts: 25000, houseDetails: { numberOfRooms: 2, hasGarden: false } };
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
      const mockOperation = { description: "Mensualidad abril 2024", date: "2023-01-26", type: 'income', value: 900.00, property_id: propertyId };
      await request(app).post("/operations").send(mockOperation);
    });

    afterAll(async () => {
      await request(app).delete(`/users/${mockUser.username}`).send();
      await new Promise(resolve => server.close(resolve));
    });

    test("Calculate TaxReturn OK", async () => { 
        const body = {
            property_id: propertyId,
            fiscalYear: 2023,
            numberOfDaysRented: 365,
            previousYearsImprovements: 0,
            currentYearImprovements: 10000
        }
        const res = await request(app).post("/tax-return").send(body);
        expect(res.statusCode).toBe(200);
        console.log(res.body);
        expect(res.body).toHaveProperty('taxReturn_id');
        expect(res.body.fiscalYear).toBe(2023);
        expect(res.body.taxableIncome).toBe(900);
        expect(res.body.deductibleExpenses).toBe(0);
        expect(res.body.amortization).toBe(2368.97);
    });

    test("Calculate TaxReturn KO - Property not found", async () => {
        const body = {
            property_id: 999,
            fiscalYear: 2023,
            numberOfDaysRented: 365,
            previousYearsImprovements: 0,
            currentYearImprovements: 10000
        }
        const res = await request(app).post("/tax-return").send(body);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
    });

    test("Calculate TaxReturn KO - Missing required fields", async () => {
        const body = {
            fiscalYear: 2023,
            numberOfDaysRented: 365,
            previousYearsImprovements: 0,
            currentYearImprovements: 10000
        }
        const res = await request(app).post("/tax-return").send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'property_id is required');
    });

    test("Calculate TaxReturn KO - Invalid fiscal year", async () => {
        const body = {
            property_id: propertyId,
            fiscalYear: 23,
            numberOfDaysRented: 365,
            previousYearsImprovements: 0,
            currentYearImprovements: 10000
        }
        const res = await request(app).post("/tax-return").send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'fiscalYear must be a valid year');
    });

    test("Calculate TaxReturn KO - Invalid number of days rented", async () => {
        const body = {
            property_id: propertyId,
            fiscalYear: 2023,
            numberOfDaysRented: 400,
            previousYearsImprovements: 0,
            currentYearImprovements: 10000
        }
        const res = await request(app).post("/tax-return").send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'numberOfDaysRented must be between 0 and 365');
    });
});