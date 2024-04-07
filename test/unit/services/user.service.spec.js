const { readUsers } = require('../../../src/services/user.service.js');
const User = require('../../../src/models/user.model.js');

jest.mock('../../../src/models/user.model.js');

describe('User Service', () => {
    it('should return a list of users', async () => {
        const mockUsers = [
            { username: 'testuser1', email: 'testuser1@example.com' },
            { username: 'testuser2', email: 'testuser2@example.com' }
        ];
        User.findAll.mockResolvedValue(mockUsers);

        const users = await readUsers();

        expect(users).toEqual(mockUsers);
    });
});
