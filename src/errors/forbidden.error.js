class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = "ForbiddenError";
        this.status = 403;
    }
}

module.exports = ForbiddenError;