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
});

describe('Document Model', () => {
    test('Create document', async () => {
        const mockDocument = { document_id: '2', documentName: 'Test Document 2', data: Buffer.from('Test data 2'), mimetype: 'text/plain', user_id: '2' };
        const createdDocument = await DocumentMock.create(mockDocument);
        expect(createdDocument.document_id).toBe('2');
    });   

    test('Create document missing parameter', async () => {
        const mockDocument = { document_id: '3', data: Buffer.from('Test data 3'), mimetype: 'text/plain', user_id: '3'};
        try {
            await DocumentMock.create(mockDocument);
        } catch (error) {
            expect(error.name).toBe('SequelizeValidationError');
        }
    });
});