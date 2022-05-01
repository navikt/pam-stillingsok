export default class APIError {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
