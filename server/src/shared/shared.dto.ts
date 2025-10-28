export class SuccessRes {
  statusCode: string;
  data: any;

  constructor(partial: Partial<SuccessRes>) {
    Object.assign(this, partial);
  }
}
