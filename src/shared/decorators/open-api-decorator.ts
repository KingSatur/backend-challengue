import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiHeader,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ServiceResponseNotification } from '../dto';
import { SAMPLE } from '../swagger/sample';

export const OpenApiSpecRideSystemResponse = (metadata: {
  model: any;
  authRequired?: boolean;
}) => {
  const authDecorators = metadata?.authRequired
    ? [
        ApiHeader({
          name: 'Authorization',
          description: 'Required BEARER token to consume api endpoints',
          example:
            'Beaer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imy05N2U2LWUwOTA1NmM4NzE5MiIsImlhdCI6MTY3ODEyMzM2MCwiZXhwIjoxNjgwNzE1MzYwfQ.pTrq9cvJx1CUR5OJikZ2IWao8',
        }),
      ]
    : [];

  return applyDecorators(
    ApiExtraModels(metadata?.model),
    ApiExtraModels(ServiceResponseNotification),
    ...authDecorators,
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: { example: SAMPLE['Unauthorized'] },
    }),
    ApiResponse({
      status: 403,
      description: 'Unauthorized',
      schema: { example: SAMPLE['Forbidden'] },
    }),
    ApiOkResponse({
      schema: {
        properties: {
          data: {
            $ref: getSchemaPath(metadata?.model),
          },
          notification: {
            $ref: getSchemaPath(ServiceResponseNotification),
          },
          success: {
            type: 'boolean',
          },
        },
        example: SAMPLE[metadata?.model?.name],
      },
    }),
  );
};
