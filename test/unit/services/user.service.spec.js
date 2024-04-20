const { readUser, createUser, isCorrectPassword, generateToken, deleteUser } = require('../../../src/services/user.service.js');
const bcryptjs = require('bcryptjs');
const User = require('../../../src/models/user.model.js');

jest.mock('../../../src/models/user.model.js');
jest.mock('bcryptjs', () => ({
    hashSync: jest.fn(() => 'hashedPassword'),
    compare: jest.fn(() => true),
}));
jest.mock('jwt-simple', () => ({
    encode: jest.fn(() => 'testToken'),
}));

describe('User Service', () => {
    
    test('readUser OK', async () => {
        const mockUser = { username: 'testuser1', name: 'paco', lastName: 'perez', password: "1234", email: 'testuser1@example.com' };
        User.findOne.mockResolvedValue(mockUser);

        const user = await readUser('testuser1');

        expect(user).toEqual(mockUser);
    });

    test('readUser OK - But user not found', async () => {
        User.findOne.mockResolvedValue(null);
        
        const user = await readUser('testuser1');

        expect(user).toBe(null);
    });

    test('createUser OK', async () => {
        const mockUser = { username: 'testuser1', name: 'paco', lastName: 'perez', password: "1234", email: 'testuser1@example.com' };
        User.create.mockResolvedValue(mockUser);

        const user = await createUser(mockUser);
        expect(user).toEqual(mockUser);
    });

    test('isCorrectPassword OK', async () => {
        const mockPassword = '1234';
        const mockHash = 'hashedPassword';

        const result = await isCorrectPassword(mockPassword, mockHash);

        expect(result).toBe(true);
    });

    test('generateToken OK', () => {
        const mockUser = { user_id: '1', username: 'testuser1' };

        const token = generateToken(mockUser);

        expect(token).toBe('testToken');
    });

    test('deleteUser OK', async () => {
        User.destroy.mockResolvedValue(1);

        const result = await deleteUser('testuser1');

        expect(result).toBe(1);
    });

    test('deleteUser KO - User not found', async () => {
        User.destroy.mockResolvedValue(0);

        const result = await deleteUser('testuser1');

        expect(result).toBe(0);
    });
});
