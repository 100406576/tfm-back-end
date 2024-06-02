const { ValidationError } = require('sequelize');
const Document = require('../../../src/models/document.model');
const documentService = require('../../../src/services/document.service');

jest.mock('../../../src/models/document.model');

describe('Document Service', () => {
    beforeEach(() => {
        Document.create.mockClear();
    });

    test('createDocument', async () => {
        const mockDocument = {
            documentName: 'Test Document',
            data: Buffer.from('Test data'),
            mimetype: 'text/plain',
            user_id: '1',
        };

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
});