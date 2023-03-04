import { ServiceResponseNotification } from '../dto/service-response-notification';

export class RideManagementException extends Error {
  public notification: ServiceResponseNotification;

  constructor(notification: ServiceResponseNotification) {
    super(notification.message);
    this.notification = notification;
  }
}
