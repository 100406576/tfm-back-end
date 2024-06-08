const request = require('supertest');
const { app } = require('../../../src/app.js');
const documentService = require('../../../src/services/document.service.js');
const NotFoundError = require('../../../src/errors/notFound.error.js');
const ForbiddenError = require('../../../src/errors/forbidden.error.js');

const authMiddlewareMock = (req, res, next) => {
    req.user = { user_id: 1 };
    next();
};
jest.mock('../../../src/middlewares/auth.middleware.js', () => authMiddlewareMock);
jest.mock('../../../src/services/document.service.js');

describe('Document Controller', () => {
    const mockDocument = {
        document_id: 1,
        documentName: 'Test Document',
        data: Buffer.from('Test data'),
        mimetype: 'application/pdf',
        user_id: 1,
    };

    test('Upload document OK', async () => {
        documentService.createDocument.mockResolvedValue();

        const res = await request(app)
            .post('/documents')
            .attach('file', mockDocument.data, { filename: mockDocument.documentName, contentType: mockDocument.mimetype })
            .set('Content-Type', 'multipart/form-data')

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe(`Document "${mockDocument.documentName}" uploaded successfully`);
        expect(documentService.createDocument).toHaveBeenCalledTimes(1);
    });

    test('Upload document with unsupported file type', async () => {
        const res = await request(app)
            .post('/documents')
            .attach('file', mockDocument.data, { filename: mockDocument.documentName, contentType: "image/gif" })
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

    test('Upload document with existing document name', async () => {
        documentService.readDocumentByDocumentName.mockResolvedValue(mockDocument);

        const res = await request(app)
            .post('/documents')
            .attach('file', mockDocument.data, { filename: mockDocument.documentName, contentType: mockDocument.mimetype })
            .set('Content-Type', 'multipart/form-data')

        expect(res.statusCode).toBe(409);
        expect(res.body.error).toBe('Document with this name already exists');
    });

    test('Read documents of user OK', async () => {
        const mockDocuments = [
            {
                document_id: "0990115b-79ad-459a-963b-34c255604418",
                documentName: "Liquidación y Finiquito Firmado.pdf",
                mimetype: "application/pdf",
                user_id: "ec6e731c-bb99-484d-afd3-0e62f023d953"
            },
            {
                document_id: "6408dd2a-9738-4096-9f76-990571f1734b",
                documentName: "home1.jpg",
                mimetype: "image/jpeg",
                user_id: "ec6e731c-bb99-484d-afd3-0e62f023d953",
            }
        ]
    
        documentService.readDocumentsByUserId.mockResolvedValue(mockDocuments);
    
        const res = await request(app).get('/documents');
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockDocuments);
        expect(documentService.readDocumentsByUserId).toHaveBeenCalledTimes(1);
    });

    test('Read documents of user KO', async () => {
        documentService.readDocumentsByUserId.mockRejectedValue(new Error());

        const res = await request(app).get('/documents');

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal server error');
    });

    test('Read document OK', async () => {
        documentService.validateDocumentOwnership.mockResolvedValue();
        documentService.readDocumentByDocumentId.mockResolvedValue(mockDocument);

        const res = await request(app).get(`/documents/${mockDocument.document_id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockDocument.data);
        expect(res.header['content-type']).toBe(mockDocument.mimetype);
        expect(documentService.readDocumentByDocumentId).toHaveBeenCalledTimes(1);
    });

    test('Read document KO - document not found', async () => {
        documentService.validateDocumentOwnership.mockResolvedValue(new NotFoundError('Document not found'));
        documentService.readDocumentByDocumentId.mockResolvedValue(null);

        try {
            await request(app).get(`/documents/${mockDocument.document_id}`);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.body.error).toBe('Document not found');
        }
    });


    test('delete document OK', async () => {
        documentService.validateDocumentOwnership.mockResolvedValue();
        documentService.deleteDocumentByDocumentId.mockResolvedValue();

        const res = await request(app).delete(`/documents/${mockDocument.document_id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Document deleted successfully');
        expect(documentService.deleteDocumentByDocumentId).toHaveBeenCalledTimes(1);
    });

    test('delete document KO - document not found', async () => {
        documentService.validateDocumentOwnership.mockRejectedValue(new NotFoundError('Document not found'));
        documentService.deleteDocumentByDocumentId.mockResolvedValue();

        try {
            await request(app).delete(`/documents/${mockDocument.document_id}`);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(res.body.error).toBe('Document not found');
        }
    });

    test('delete document KO - forbidden', async () => {
        documentService.validateDocumentOwnership.mockRejectedValue(new ForbiddenError('You are not allowed to perform this operation on this document'));
        documentService.deleteDocumentByDocumentId.mockResolvedValue();

        try {
            await request(app).delete(`/documents/${mockDocument.document_id}`);
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(res.body.error).toBe('You are not allowed to perform this operation on this document');
        }
    });

    test('delete documents of user OK', async () => {
        documentService.deleteDocumentsByUserId.mockResolvedValue();

        const res = await request(app).delete('/documents');

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Documents deleted successfully');
        expect(documentService.deleteDocumentsByUserId).toHaveBeenCalledTimes(1);
    });

    test('delete documents of user KO', async () => {
        documentService.deleteDocumentsByUserId.mockRejectedValue(new Error());

        try {
            await request(app).delete('/documents');

        } catch (error) {
            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Internal server error');
        }
    });
});
