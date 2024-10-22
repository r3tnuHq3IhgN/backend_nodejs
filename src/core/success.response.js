'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204
}

const ReasonPhrase = {
    OK: 'OK',
    CREATED: 'Created',
    NO_CONTENT: 'No Content'
}
class SuccessResponse {
    constructor({message, statusCode = StatusCode.OK, reasonStatusCode = ReasonPhrase.OK, metadata = {}}) {
        this.message = !message ? reasonStatusCode: message;
        this.metadata = metadata;
        this.statusCode = statusCode;
    }

    send(req, headers = {}) {
        return req.status(this.statusCode).json(this);
    }
}

class OKResponse extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, metadata, statusCode: StatusCode.OK, reasonStatusCode: ReasonPhrase.OK});
    }
}

class CreatedResponse extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, metadata, statusCode: StatusCode.CREATED, reasonStatusCode: ReasonPhrase.CREATED});
    }
}

module.exports = {
    OKResponse,
    CreatedResponse
}
