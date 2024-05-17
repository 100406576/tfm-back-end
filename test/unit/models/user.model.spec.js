const SequelizeMock = require('sequelize-mock');
const User = require('../../../src/models/user.model.js');

// Setup the mock database connection
const DBConnectionMock = new SequelizeMock();

// Mocks the User model
const UserMock = DBConnectionMock.define('User', {
    username: 'testuser1',
    name: 'paco',
    lastName: 'perez',
    password: 'password',
    email: 'testuser1@example.com',
});
UserMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
    if (query === 'findOne') {
        return UserMock.build({
            username: 'testuser1',
            name: 'paco',
            lastName: 'perez',
            password: 'password',
            email: 'testuser1@example.com',
        });
    }

    if (query === 'create') {
        return UserMock.build(queryOptions);
    }

    if (query === 'update') {
        return [1];
    }
});

describe('User Model', () => {

    test('Find User by username', async () => {
        const foundUser = await UserMock.findOne({ where: { username: 'testuser1' } });
        expect(foundUser.username).toBe('testuser1');
    });

    test('Create user', async () => {
        const mockUser = { username: 'testuser2', name: 'john', lastName: 'doe', password: 'password', email: 'testuser2@example.com' };
        const createdUser = await UserMock.create(mockUser);
        expect(createdUser.username).toBe('testuser2');
    }); 
    
    test('Create user KO - missing required field', async () => {
        const mockUser = { username: 'testuser2', name: 'john', lastName: 'doe', password: 'password' };
        try {
            await UserMock.create(mockUser);
        } catch (error) {
            expect(error.name).toBe('SequelizeValidationError');
        }
    });

    test('Update user', async () => {
        const dataUser = { name: 'updatedName' };
        const username = 'testuser1';
        const affectedRows = await UserMock.update(dataUser, { where: { username: username } });
        expect(affectedRows[0]).toBe(1);
    });
    
    test('Delete user', async () => {
        const deletedUser = await UserMock.destroy({ where: { username: 'testuser1' } });
        expect(deletedUser).toBe(1);
    });
});
