import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionMessage } from '../constants/exception.message';
import { ServiceResponse, ServiceResponseNotification } from 'src/shared/dto';
import { RideManagementException } from 'src/shared/exception/ride-management-exception';

@Catch()
export class AllExceptionsFilter
  implements ExceptionFilter<RideManagementException | any>
{
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: RideManagementException | any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof RideManagementException
        ? exception.notification?.status
        : exception?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: ServiceResponse<any> = {
      data: null,
      notification:
        exception instanceof RideManagementException
          ? exception.notification
          : new ServiceResponseNotification(
              exception?.response?.statusCode ||
                HttpStatus.INTERNAL_SERVER_ERROR,
              exception?.response?.message ||
                ExceptionMessage.SERVER_ERROR.message,
              exception?.response?.error || ExceptionMessage.SERVER_ERROR.code,
            ),
      success: false,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
