import { ServiceResponseNotification } from './service-response-notification';

export interface ServiceResponse<T> {
  success: boolean;
  notification: ServiceResponseNotification;
  data: T;
}
