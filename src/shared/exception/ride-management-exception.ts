import { ServiceResponseNotification } from '../dto/service-response-notification';

export class RideManagementException {
  public notification: ServiceResponseNotification;

  constructor(notification: ServiceResponseNotification) {
    this.notification = notification;
  }
}
