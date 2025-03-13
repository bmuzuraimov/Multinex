export type ApiResponse<T = undefined> = {
  success: boolean;
  code: number;
  message: string;
  data?: T;
};
