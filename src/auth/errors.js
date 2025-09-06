export class AuthenticationError extends Error {
    constructor(message, code = 'AUTH_ERROR') {
        super(message);
        this.name = 'AuthenticationError';
        this.code = code;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthenticationError);
        }
    }
}

export class TurnstileError extends Error {
    constructor(message, code = 'TURNSTILE_ERROR') {
        super(message);
        this.name = 'TurnstileError';
        this.code = code;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TurnstileError);
        }
    }
}

export class TokenExpiredError extends Error {
    constructor(
        message = 'Authentication token has expired',
        code = 'TOKEN_EXPIRED'
    ) {
        super(message);
        this.name = 'TokenExpiredError';
        this.code = code;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TokenExpiredError);
        }
    }
}

export class TokenValidationError extends Error {
    constructor(message, code = 'TOKEN_VALIDATION_ERROR') {
        super(message);
        this.name = 'TokenValidationError';
        this.code = code;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TokenValidationError);
        }
    }
}

export class RateLimitError extends Error {
    constructor(message, retryAfter = null, code = 'RATE_LIMIT_ERROR') {
        super(message);
        this.name = 'RateLimitError';
        this.code = code;
        this.retryAfter = retryAfter;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RateLimitError);
        }
    }
}

export class NetworkError extends Error {
    constructor(message, code = 'NETWORK_ERROR') {
        super(message);
        this.name = 'NetworkError';
        this.code = code;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NetworkError);
        }
    }
}

export function createErrorFromResponse(response, message) {
    if (response.status === 401) {
        return new AuthenticationError(
            message || 'Authentication required',
            'UNAUTHORIZED'
        );
    }

    if (response.status === 403) {
        return new AuthenticationError(
            message || 'Access forbidden',
            'FORBIDDEN'
        );
    }

    if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        return new RateLimitError(
            message || 'Rate limit exceeded',
            retryAfter ? parseInt(retryAfter) : null
        );
    }

    if (response.status >= 500) {
        return new NetworkError(message || 'Server error', 'SERVER_ERROR');
    }

    return new AuthenticationError(
        message || `Request failed with status ${response.status}`
    );
}
