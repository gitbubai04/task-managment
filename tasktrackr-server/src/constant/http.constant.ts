export const HTTP_STATUSCODE = {
    OK: 200,
    CREATE: 201,
    BAD_REQUEST: 400,
    AUTH_FAILED: 401,
    DUPLICATE_RECORD: 409,
    LIMIT_EXCEEDED: 429,
    NOT_PRESENT: 404,
    INTERNAL_ERROR: 500,
    OPERATION_FAIL: 501,
};

export const HTTPS_MESSAGE = {
    BAD_REQUEST: "Bad request",
    INVALID_EMAIL: "Invalid email address",
    INVALID_PHONE: "Invalid phone number",
    WEAK_PASSWORD: "Weak password, try some strong",
    INVALID_CRED: "Invalid credentials",
    INTERNAL_ERROR: "Something went wrong",
    NOT_AUTHORISED: "You are not authorised to make this request",
    INVALID_USERNAME: "Invalid username, only letter, numbers,_. allowed",
    INACTIVATE_PRO: "Pro account is not activated",
};
