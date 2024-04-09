class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConflictError";
        this.status = 409;
    }
}

module.exports = NotFoundError;