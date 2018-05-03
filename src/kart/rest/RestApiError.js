export default class RestApiError {
    constructor(error) {
        this.error = error.error;
        this.status = error.status;
        this.message = error.message;
    }
}
