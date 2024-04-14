const { readUser, userExists, createUser } = require('../../../src/services/user.service.js');
const bcryptjs = require('bcryptjs');
const User = require('../../../src/models/user.model.js');

jest.mock('../../../src/models/user.model.js');
jest.mock('bcryptjs', () => ({
    hashSync: jest.fn(() => 'hashedPassword'),
}));

describe('User Service', () => {
    /*test('readUsersOK', async () => {
        const mockUsers = [
            { username: 'testuser1', email: 'testuser1@example.com' },
            { username: 'testuser2', email: 'testuser2@example.com' }
        ];
        User.findAll.mockResolvedValue(mockUsers);

        const users = await readUsers();

        expect(users).toEqual(mockUsers);
    });*/
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
});
