export default class SearchApiError {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}