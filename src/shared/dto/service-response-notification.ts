export class ServiceResponseNotification {
  constructor(
    public status: number,
    public message: string,
    public code: string,
  ) {}
}
