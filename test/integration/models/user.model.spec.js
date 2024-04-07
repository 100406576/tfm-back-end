const User = require('../../../src/models/user.model.js');
const sequelize = require('../../../src/models/index.js');

describe('User Model', () => {
    it('should create a new user', async () => {
        const users = await User.findAll();

        expect(Array.isArray(users)).toBe(true);
        expect(users[0]).toHaveProperty('username', 'oli');
    });
});
