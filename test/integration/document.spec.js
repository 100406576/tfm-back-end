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

describe("Document integration test", () => {
    let server;
    const mockUser = { username: 'testIntegration', user_id: "1", name: 'paco', lastName: 'perez', password: "1234", email: 'testuser2@example.com' };
    let documentId;

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

    test('Upload document OK', async () => {
        const mockDocument = {
            documentName: 'Test Document',
            data: Buffer.from('Test data'),
            mimetype: 'application/pdf',
            user_id: '1',
        };

        const res = await request(app)
            .post('/documents')
            .attach('file', mockDocument.data, { filename: mockDocument.documentName, contentType: mockDocument.mimetype })
            .set('Content-Type', 'multipart/form-data')

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe(`Document "${mockDocument.documentName}" uploaded successfully`);
    });

    test('Upload document with unsupported file type', async () => {
        const mockDocument = {
            documentName: 'Test Document',
            data: Buffer.from('Test data'),
            mimetype: 'text/plain',
            user_id: '1',
        };

        const res = await request(app)
            .post('/documents')
            .attach('file', mockDocument.data, { filename: mockDocument.documentName, contentType: mockDocument.mimetype })
            .set('Content-Type', 'multipart/form-data')

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Unsupported file type');
    });

    test('Upload document with missing file', async () => {
        const res = await request(app)
            .post('/documents')
            .set('Content-Type', 'multipart/form-data')

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('No file provided');
    });
});