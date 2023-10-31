export class HttpError {
    message: string;
    code?: number;

    constructor(message: string, errorCode: number) {
        this.message = message;
        this.code = errorCode;
    }
}