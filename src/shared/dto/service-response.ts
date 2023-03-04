import { ServiceResponseNotification } from './service-response-notification';

export class ServiceResponse<T> {
  constructor(
    public readonly success,
    public readonly notification: ServiceResponseNotification,
    public readonly data: T,
  ) {
    this.success = success;
    this.notification = notification;
    this.data = data;
  }
}
