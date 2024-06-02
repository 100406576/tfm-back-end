const request = require('supertest');
const { app } = require('../../../src/app.js');
const documentService = require('../../../src/services/document.service.js');
const NotFoundError = require('../../../src/errors/notFound.error.js');
const ForbiddenError = require('../../../src/errors/forbidden.error.js');
const authMiddleware = require('../../../src/middlewares/auth.middleware.js');
const { ValidationError } = require('sequelize');

const authMiddlewareMock = (req, res, next) => {
    req.user = { user_id: 1 };
    next();
};
jest.mock('../../../src/middlewares/auth.middleware.js', () => authMiddlewareMock);
jest.mock('../../../src/services/document.service.js');

describe('Document Controller', () => {
    test('Upload document OK', async () => {
        const mockFile = {
            originalname: 'Test Document',
            buffer: Buffer.from('Test data'),
            mimetype: 'application/pdf',
        };

        documentService.createDocument.mockResolvedValue();

        const res = await request(app)
            .post('/documents')
            .attach('file', mockFile.buffer, { filename: mockFile.originalname, contentType: mockFile.mimetype })
            .set('Content-Type', 'multipart/form-data')

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe(`Document "${mockFile.originalname}" uploaded successfully`);
        expect(documentService.createDocument).toHaveBeenCalledTimes(1);
        expect(documentService.createDocument).toHaveBeenCalledWith(mockFile.originalname, mockFile.buffer, mockFile.mimetype, 1);
    });

    test('Upload document with unsupported file type', async () => {
        const mockFile = {
            originalname: 'Test Document',
            buffer: Buffer.from('Test data'),
            mimetype: 'text/plain',
        };

        const res = await request(app)
            .post('/documents')
            .attach('file', mockFile.buffer, { filename: mockFile.originalname, contentType: mockFile.mimetype })
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
