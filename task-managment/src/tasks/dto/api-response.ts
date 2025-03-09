export class ApiResponse<T> {
  message: string;
  success: boolean;
  data: T | null;
  totalCount?: number;

  constructor(
    message: string,
    success: boolean,
    data: T | null,
    totalCount?: number,
  ) {
    this.message = message;
    this.success = success;
    this.data = data;
    this.totalCount = totalCount;
  }
}
