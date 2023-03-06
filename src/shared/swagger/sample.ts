import { ExceptionMessage } from '../../constants/exception.message';

export const SAMPLE = {
  CreateRideResponseDto: {
    success: true,
    data: {
      rideId: 'a6a851cc-7176-41fc-97e6-e09056c87192',
      driverId: 'a9a852cc-7176-41fc-97e6-e09056c87192',
      driverEmail: 'sample@mail.com',
    },
    notification: {
      status: 200,
      message: 'Ride was created for user',
      code: 'ride_was_created',
    },
  },
  FinishRideResponseDto: {
    success: true,
    data: {
      rideId: 'a6a851cc-7176-41fc-97e6-e09056c87192',
      driverId: 'a9a852cc-7176-41fc-97e6-e09056c87192',
    },
    notification: {
      status: 200,
      message: 'Ride was finished',
      code: 'ride_was_finished',
    },
  },
  LoginResponseDto: {
    success: true,
    data: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imy05N2U2LWUwOTA1NmM4NzE5MiIsImlhdCI6MTY3ODEyMzM2MCwiZXhwIjoxNjgwNzE1MzYwfQ.pTrq9cvJx1CUR5OJikZ2IWao8',
    },
    notification: {
      status: 200,
      message: 'Success authentication',
      code: 'auth_success',
    },
  },
  CreatePaymentResponseDto: {
    success: true,
    data: {
      id: 'a6b861cc-7176-41fc-97e6-e09056c87192',
      status: 'AVAILABLE',
    },
    notification: {
      status: 200,
      message: 'Success authentication',
      code: 'auth_success',
    },
  },
  Unauthorized: {
    success: false,
    data: null,
    notification: {
      status: 401,
      message: '',
      code: '',
    },
  },
  Forbidden: {
    success: false,
    data: null,
    notification: {
      status: 403,
      message: '',
      code: '',
    },
  },
  CANNOT_REQUEST_RIDE_WITHOUT_PAYMENT_METHOD_CREATED: {
    success: false,
    data: null,
    notification: {
      status: 400,
      ...ExceptionMessage.CANNOT_REQUEST_RIDE_WITHOUT_PAYMENT_METHOD_CREATED,
    },
  },
  CANNOT_HAVE_MULTIPLE_RIDES_AT_ONCE: {
    success: false,
    data: null,
    notification: {
      status: 400,
      ...ExceptionMessage.CANNOT_HAVE_MULTIPLE_RIDES_AT_ONCE,
    },
  },
  RIDE_DOES_NOT_EXIST: {
    success: false,
    data: null,
    notification: {
      status: 404,
      ...ExceptionMessage.RIDE_DOES_NOT_EXIST,
    },
  },
  CANNOT_FINISH_NOT_OWNED_RIDE: {
    success: false,
    data: null,
    notification: {
      status: 400,
      ...ExceptionMessage.CANNOT_FINISH_NOT_OWNED_RIDE,
    },
  },
  CANNOT_FINISH_ALREADY_FINISH_RIDE: {
    success: false,
    data: null,
    notification: {
      status: 400,
      ...ExceptionMessage.CANNOT_FINISH_ALREADY_FINISH_RIDE,
    },
  },
  CANNOT_CREATE_CREATE_PAYMENT_METHOD_WITH_USED_TOKEN: {
    success: false,
    data: null,
    notification: {
      status: 400,
      ...ExceptionMessage.CANNOT_CREATE_CREATE_PAYMENT_METHOD_WITH_USED_TOKEN,
    },
  },
  USER_DOES_NOT_EXIST: {
    success: false,
    data: null,
    notification: {
      status: 400,
      ...ExceptionMessage.USER_DOES_NOT_EXIST,
    },
  },
};
