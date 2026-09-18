export type ApiCudResponse = {
  Error_Code?: number;
  Message?: string;
  message?: string;
  errors?: Record<string, string[]>;
};

export type ApiListResponse<T> = ApiCudResponse & {
  data?: T[];
};
