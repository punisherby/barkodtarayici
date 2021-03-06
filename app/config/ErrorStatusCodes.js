export const ErrorStatusCode = {
    AUTHORIZATION_EXCEPTION: 40301,
    WRONG_CREDENTIALS_EXCEPTION: 40108,
    CUSTOMER_NOT_ALLOWED_EXCEPTION: 40302,
    AUTHORIZATION_TOKEN_NOT_VALID_EXCEPTION: 40307,
    AUTHORIZATION_TOKEN_HAS_EXPIRED_EXCEPTION: 40313,
    CUSTOMER_NOT_HAVE_ACTIVE_SUBSCRIPTION: 40201,
    ATTEMPTED_TO_UPDATE_STALE_DATA: 50089,
    CUSTOMER_SUSPENDED: 40301,
    PHOTO_SIZE_NOT_VALID: 40044,
    TIMEOUT_EXCEPTION: "Network request failed",
    VALIDATION_FAILED_EXCEPTION: 40071,
    NOT_FOUND: 404
    
};

export const AlertExcludeErrorStatusCode = [ErrorStatusCode.ATTEMPTED_TO_UPDATE_STALE_DATA, ErrorStatusCode.CUSTOMER_NOT_HAVE_ACTIVE_SUBSCRIPTION, ErrorStatusCode.CUSTOMER_SUSPENDED];