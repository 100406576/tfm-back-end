const { ValidationError } = require('sequelize');
const Document = require('../../../src/models/document.model');
const documentService = require('../../../src/services/document.service');
const NotFoundError = require('../../../src/errors/notFound.error');
const ForbiddenError = require('../../../src/errors/forbidden.error');

jest.mock('../../../src/models/document.model');

describe('Document Service', () => {
    const mockDocument = {
        documentName: 'Test Document',
        data: Buffer.from('Test data'),
        mimetype: 'text/plain',
        user_id: '1',
    };
    const mockDocumentId = '1';

    beforeEach(() => {
        Document.create.mockClear();
        Document.findOne.mockClear();
        Document.findByPk.mockClear();
        Document.findAll.mockClear();
        Document.destroy.mockClear();
    });

    test('createDocument', async () => {
        Document.create.mockResolvedValue(mockDocument);

        const document = await documentService.createDocument('Test Document', Buffer.from('Test data'), 'text/plain', '1');

        expect(Document.create).toHaveBeenCalledTimes(1);
        expect(Document.create).toHaveBeenCalledWith(mockDocument);
        expect(document).toEqual(mockDocument);
    });

    test('createDocument with missing fields', async () => {
        try {
            await documentService.createDocument(null, null, null, null);
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
        }
    });

    test('createDocument with invalid data', async () => {
        try {
            await documentService.createDocument('Test Document', 'Invalid data', 'text/plain', '1');
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
        }
    });

    test('readDocumentByDocumentName', async () => {
        const mockDocumentName = 'Test Document';

        Document.findOne.mockResolvedValue(mockDocument);

        const document = await documentService.readDocumentByDocumentName(mockDocumentName);

        expect(Document.findOne).toHaveBeenCalledTimes(1);
        expect(Document.findOne).toHaveBeenCalledWith({ where: { documentName: mockDocumentName } });
        expect(document).toEqual(mockDocument);
    });

    test('readDocumentByDocumentId', async () => {
        Document.findByPk.mockResolvedValue(mockDocument);

        const document = await documentService.readDocumentByDocumentId(mockDocumentId);

        expect(Document.findByPk).toHaveBeenCalledTimes(1);
        expect(Document.findByPk).toHaveBeenCalledWith(mockDocumentId);
        expect(document).toEqual(mockDocument);
    });

    test('readDocumentsByUserId', async () => {
        const mockUserId = '1';
        const mockDocuments = [mockDocument];

        Document.findAll.mockResolvedValue(mockDocuments);

        const documents = await documentService.readDocumentsByUserId(mockUserId);

        expect(Document.findAll).toHaveBeenCalledTimes(1);
        expect(Document.findAll).toHaveBeenCalledWith({ where: { user_id: mockUserId }, attributes: { exclude: ['data'] } });
        expect(documents).toEqual(mockDocuments);
    });

    test('deleteDocumentByDocumentId', async () => {
        Document.destroy.mockResolvedValue(1);

        const deletedRows = await documentService.deleteDocumentByDocumentId(mockDocumentId);

        expect(Document.destroy).toHaveBeenCalledTimes(1);
        expect(Document.destroy).toHaveBeenCalledWith({ where: { document_id: mockDocumentId } });
        expect(deletedRows).toBe(1);
    });

    test('deleteDocumentsByUserId', async () => {
        const mockUserId = '1';

        Document.destroy.mockResolvedValue(1);

        const deletedRows = await documentService.deleteDocumentsByUserId(mockUserId);

        expect(Document.destroy).toHaveBeenCalledTimes(1);
        expect(Document.destroy).toHaveBeenCalledWith({ where: { user_id: mockUserId } });
        expect(deletedRows).toBe(1);
    });

    test('validateDocumentOwnership', async () => {
        const mockUserId = '1';

        Document.findByPk.mockResolvedValue(mockDocument);

        await documentService.validateDocumentOwnership(mockDocumentId, mockUserId);

        expect(Document.findByPk).toHaveBeenCalledTimes(1);
        expect(Document.findByPk).toHaveBeenCalledWith(mockDocumentId);
    });

    test('validateDocumentOwnership with non-existing document', async () => {
        const mockUserId = '1';

        Document.findByPk.mockResolvedValue(null);

        try {
            await documentService.validateDocumentOwnership('2', mockUserId);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
        }
    });

    test('validateDocumentOwnership with non-owner user', async () => {
        const mockUserId = '2';

        Document.findByPk.mockResolvedValue(mockDocument);

        try {
            await documentService.validateDocumentOwnership(mockDocumentId, mockUserId);
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenError);
        }
    });
});