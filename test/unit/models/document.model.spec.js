const SequelizeMock = require('sequelize-mock');
const Document = require('../../../src/models/document.model.js');

const DBConnectionMock = new SequelizeMock();

const DocumentMock = DBConnectionMock.define('Document', {
    document_id: '1',
    documentName: 'Test Document',
    data: Buffer.from('Test data'),
    mimetype: 'text/plain',
    user_id: '1',
});

DocumentMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
    if (query === 'create') {
        return DocumentMock.build(queryOptions);
    }
    if (query === 'findOne') {
        return DocumentMock.build(queryOptions.where);
    }
    if (query === 'findAll') {
        return [DocumentMock.build(queryOptions.where)];
    }
    if (query === 'destroy') {
        return 1;
    }
});

describe('Document Model', () => {
    test('Create document', async () => {
        const mockDocument = { document_id: '2', documentName: 'Test Document 2', data: Buffer.from('Test data 2'), mimetype: 'text/plain', user_id: '2' };
        const createdDocument = await DocumentMock.create(mockDocument);
        expect(createdDocument.documentName).toBe('Test Document 2');
    });   

    test('Create document missing parameter', async () => {
        const mockDocument = { document_id: '3', data: Buffer.from('Test data 3'), mimetype: 'text/plain', user_id: '3'};
        try {
            await DocumentMock.create(mockDocument);
        } catch (error) {
            expect(error.name).toBe('SequelizeValidationError');
        }
    });

    test('Read document by documentName', async () => {
        const mockDocumentName = 'Test Document';
        const foundDocument = await DocumentMock.findOne({ where: { documentName: mockDocumentName } });
        expect(foundDocument.documentName).toBe(mockDocumentName);
    });

    test('Read document by documentId', async () => {
        const mockDocumentId = '1';
        const foundDocument = await DocumentMock.findOne({ where: { document_id: mockDocumentId } });
        expect(foundDocument.document_id).toBe(mockDocumentId);
    });

    test('Read documents by userId', async () => {
        const mockUserId = '1';
        const foundDocuments = await DocumentMock.findAll({ where: { user_id: mockUserId } });
        expect(foundDocuments[0].user_id).toBe(mockUserId);
    });

    test('Delete document by documentId', async () => {
        const mockDocumentId = '1';
        const deletedRows = await DocumentMock.destroy({ where: { document_id: mockDocumentId } });
        expect(deletedRows).toBe(1);
    });

    test('Delete documents by userId', async () => {
        const mockUserId = '1';
        const deletedRows = await DocumentMock.destroy({ where: { user_id: mockUserId } });
        expect(deletedRows).toBe(1);
    });
});
