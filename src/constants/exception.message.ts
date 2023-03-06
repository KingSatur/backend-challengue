export const ExceptionMessage = {
  CANNOT_HAVE_MULTIPLE_RIDES_AT_ONCE: {
    message: 'Cannot have more than one ride at once',
    code: 'CANNOT_HAVE_MULTIPLE_RIDES_AT_ONCE',
  },
  CANNOT_REQUEST_RIDE_WITHOUT_PAYMENT_METHOD_CREATED: {
    message: 'Cannot request ride without already payment method created',
    code: 'CANNOT_REQUEST_RIDE_WITHOUT_PAYMENT_METHOD_CREATED',
  },
  INVALID_CREDENTIALS: {
    message: 'Invalid credentials',
    code: 'INVALID_CREDENTIALS',
  },
  CANNOT_FINISH_NOT_OWNED_RIDE: {
    message: 'Cannot finish not owned ride',
    code: 'CANNOT_HAVE_MULTIPLE_RIDES_AT_ONCE',
  },
  CANNOT_FINISH_ALREADY_FINISH_RIDE: {
    message: 'Cannot finish already finished ride',
    code: 'CANNOT_FINISH_ALREADY_FINISH_RIDE',
  },
  RIDE_DOES_NOT_EXIST: {
    message: 'Ride does not exists',
    code: 'RIDE_DOES_NOT_EXIST',
  },
  CANNOT_CREATE_CREATE_PAYMENT_METHOD_WITH_USED_TOKEN: {
    message: 'Cannot create payment method with use token',
    code: 'CANNOT_CREATE_CREATE_PAYMENT_METHOD_WITH_USED_TOKEN',
  },
  USER_DOES_NOT_EXIST: {
    message: 'User does not exist',
    code: 'USER_DOES_NOT_EXIST',
  },
  SERVER_ERROR: {
    message: 'server error',
    code: 'SERVER_ERROR',
  },
};

export const OperationMessage = {
  PAYMENT_WAS_CREATED: {
    message: 'Payment was created for user',
    code: 'PAYMENT_WAS_CREATED',
  },
  RIDE_WAS_CREATED: {
    message: 'Ride was created for user',
    code: 'RIDE_WAS_CREATED',
  },
  RIDE_WAS_FINISHED: {
    message: 'Ride was finished',
    code: 'RIDE_WAS_FINISHED',
  },
  AUTH_SUCCESS: {
    message: 'Success authentication',
    code: 'AUTH_SUCCESS',
  },
};
