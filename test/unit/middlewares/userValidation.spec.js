const userValidationMiddleware = require('../../../src/middlewares/userValidation.middleware.js');
const ForbiddenError = require('../../../src/errors/forbidden.error.js');

describe('User Validation middleware', () => {
    test('Requested username is the same as the authenticated username', async () => {
        const req = {
            params: {
                username: 'user1'
            },
            user: {
                username: 'user1'
            }
        };
        const next = jest.fn();

        userValidationMiddleware(req, null, next);

        expect(next).toHaveBeenCalled();
    });

    test('Requested username is not the same as the authenticated username', async () => {
        const req = {
            params: {
                username: 'user2'
            },
            user: {
                username: 'user1'
            }
        };
        const next = jest.fn();

        expect(() => userValidationMiddleware(req, null, next)).toThrowError(ForbiddenError);
        expect(next).not.toHaveBeenCalled();
    });
});